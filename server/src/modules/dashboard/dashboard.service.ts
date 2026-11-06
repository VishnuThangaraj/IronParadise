import UserModel from "../user/user.model.js";
import AttendanceModel from "../attendance/attendance.model.js";
import MemberPaymentModel from "../member/member-payment/member-payment.model.js";
import MemberPaymentReceiptModel from "../member/member-payment-receipt/member-payment-receipt.model.js";
import MemberAssignmentModel from "../member/member-assignment/member-assignment.model.js";
import MembershipPlanModel from "../membership-plan/membership-plan.model.js";
import WorkoutPlanModel from "../workout-plan/workout-plan.model.js";
import DietPlanModel from "../diet-plan/diet-plan.model.js";
import TrainerDetailsModel from "../trainer/trainer-details/trainer-details.model.js";
import TrainerPaymentModel from "../trainer/trainer-payment/trainer-payment.model.js";
import EventModal from "../event/event.modal.js";
import EnquiryModel from "../enquiry/enquiry.model.js";
import AppError from "../../shared/errors/AppError.js";
import type {
  DashboardOverviewResponse,
  TrainerDashboardResponse,
  MemberDashboardResponse,
  AttendanceTrendPoint,
  PeakHourPoint,
  PaymentStatusCount,
  MonthlyFinancialTrend,
  PlanDistributionItem,
  DashboardCheckIn,
  DashboardEvent,
  DashboardBirthday,
  DashboardEnquiry,
} from "./dashboard.types.js";

class DashboardService {
  public async getOverview(): Promise<DashboardOverviewResponse> {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    const startOfToday = new Date(currentYear, currentMonth, now.getDate(), 0, 0, 0, 0);
    const endOfToday = new Date(currentYear, currentMonth, now.getDate(), 23, 59, 59, 999);

    const startOfMonth = new Date(currentYear, currentMonth, 1, 0, 0, 0, 0);
    const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1, 0, 0, 0, 0);
    const endOfLastMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

    // Parallel fetch across all domain models
    const [
      totalMembers,
      activeMembers,
      inactiveMembers,
      newMembersThisMonth,
      newMembersLastMonth,
      totalTrainers,
      activeTrainers,
      genderStats,
      todayAttendanceCount,
      currentlyCheckedInCount,
      latestAttendanceDoc,
      paymentAggregate,
      paymentStatuses,
      monthlyPaymentAgg,
      assignmentsByPlan,
      membershipPlans,
      totalWorkoutPlans,
      totalDietPlans,
      totalMembershipPlans,
      recentAttendanceDocs,
      upcomingEventsDocs,
      birthdaysDocs,
      pendingEnquiriesCount,
      recentEnquiriesDocs,
    ] = await Promise.all([
      // 1. Members
      UserModel.countDocuments({ role: "member" }),
      UserModel.countDocuments({ role: "member", isActive: true }),
      UserModel.countDocuments({ role: "member", isActive: false }),
      UserModel.countDocuments({
        role: "member",
        createdAt: { $gte: startOfMonth },
      }),
      UserModel.countDocuments({
        role: "member",
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      }),

      // 2. Trainers
      UserModel.countDocuments({ role: "trainer" }),
      UserModel.countDocuments({ role: "trainer", isActive: true }),

      // 3. Gender breakdown
      UserModel.aggregate<{ _id: string; count: number }>([
        { $match: { role: "member" } },
        { $group: { _id: "$gender", count: { $sum: 1 } } },
      ]),

      // 4. Attendance Today
      AttendanceModel.countDocuments({
        date: { $gte: startOfToday, $lte: endOfToday },
      }),
      AttendanceModel.countDocuments({
        date: { $gte: startOfToday, $lte: endOfToday },
        $or: [{ status: "checked_in" }, { checkOut: null }],
      }),
      AttendanceModel.findOne().sort({ date: -1 }).select("date").lean(),

      // 5. Member Payments Summary
      MemberPaymentModel.aggregate<{
        _id: null;
        totalBilled: number;
        totalCollected: number;
        totalDue: number;
      }>([
        {
          $group: {
            _id: null,
            totalBilled: { $sum: "$totalAmount" },
            totalCollected: { $sum: "$amountPaid" },
            totalDue: { $sum: "$amountDue" },
          },
        },
      ]),

      // 6. Payment Status Breakdown
      MemberPaymentModel.aggregate<{
        _id: "PAID" | "PARTIAL" | "PENDING" | "OVERDUE";
        count: number;
        amount: number;
      }>([
        {
          $group: {
            _id: "$paymentStatus",
            count: { $sum: 1 },
            amount: { $sum: "$amountPaid" },
          },
        },
      ]),

      // 7. Monthly Payment Trends (Last 6 Months)
      MemberPaymentModel.aggregate<{
        _id: { year: number; month: number };
        collected: number;
        due: number;
      }>([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            collected: { $sum: "$amountPaid" },
            due: { $sum: "$amountDue" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),

      // 8. Membership Plan Distribution from Assignments
      MemberAssignmentModel.aggregate<{ _id: string; count: number }>([
        { $match: { membershipPlanId: { $ne: null } } },
        { $group: { _id: "$membershipPlanId", count: { $sum: 1 } } },
      ]),

      // 9. All Active Membership Plans
      MembershipPlanModel.find({ isActive: true })
        .select("membershipPlanId planName price durationMonths")
        .lean(),

      // 10. Workout & Diet Plans
      WorkoutPlanModel.countDocuments({ isActive: true }),
      DietPlanModel.countDocuments({ isActive: true }),
      MembershipPlanModel.countDocuments({ isActive: true }),

      // 11. Recent Attendance Records
      AttendanceModel.find().sort({ checkIn: -1 }).limit(6).lean(),

      // 12. Upcoming Events
      EventModal.find({ isActive: true })
        .sort({ date: 1 })
        .limit(10)
        .lean(),

      // 13. Birthdays This Month
      UserModel.find({
        role: { $in: ["member", "trainer"] },
        isActive: true,
        dob: { $exists: true, $ne: null },
        $expr: {
          $eq: [
            {
              $month: {
                $cond: [
                  { $eq: [{ $type: "$dob" }, "date"] },
                  "$dob",
                  {
                    $dateFromString: {
                      dateString: "$dob",
                      onError: new Date(0),
                    },
                  },
                ],
              },
            },
            currentMonth + 1,
          ],
        },
      })
        .select("userId fullName role dob profileImage")
        .limit(8)
        .lean(),

      // 14. Enquiries
      EnquiryModel.countDocuments({ replied: false }),
      EnquiryModel.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    // Member Growth Rate Calculation
    let memberGrowthRate = 0;
    if (newMembersLastMonth > 0) {
      memberGrowthRate = Math.round(
        ((newMembersThisMonth - newMembersLastMonth) / newMembersLastMonth) * 100,
      );
    } else if (newMembersThisMonth > 0) {
      memberGrowthRate = 100;
    }

    // Demographics mapping
    const demographics = {
      male: 0,
      female: 0,
      other: 0,
      total: totalMembers,
    };
    for (const stat of genderStats) {
      if (stat._id === "male") demographics.male = stat.count;
      else if (stat._id === "female") demographics.female = stat.count;
      else demographics.other += stat.count;
    }

    // Financial calculations
    const financialStats = paymentAggregate[0] || {
      totalBilled: 0,
      totalCollected: 0,
      totalDue: 0,
    };
    const totalOverdue = paymentStatuses
      .filter((s) => s._id === "OVERDUE")
      .reduce((acc, curr) => acc + curr.amount, 0);

    const collectionRate =
      financialStats.totalBilled > 0
        ? Math.round((financialStats.totalCollected / financialStats.totalBilled) * 100)
        : 0;

    const paymentStatusBreakdown: PaymentStatusCount[] = [
      "PAID",
      "PARTIAL",
      "PENDING",
      "OVERDUE",
    ].map((status) => {
      const found = paymentStatuses.find((s) => s._id === status);
      return {
        status: status as PaymentStatusCount["status"],
        count: found?.count || 0,
        amount: found?.amount || 0,
      };
    });

    // 6-Month Financial Trend mapping
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const monthlyTrends: MonthlyFinancialTrend[] = [];
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(currentYear, currentMonth - i, 1);
      const y = targetDate.getFullYear();
      const m = targetDate.getMonth() + 1; // 1-12
      const monthLabel = monthNames[targetDate.getMonth()] || "";

      const match = monthlyPaymentAgg.find(
        (agg) => agg._id.year === y && agg._id.month === m,
      );

      monthlyTrends.push({
        month: monthLabel,
        collected: match?.collected || 0,
        due: match?.due || 0,
      });
    }

    // 14-Day Attendance Time Series
    // Determine the anchor date for attendance (latest recorded attendance date or today)
    const anchorDate = latestAttendanceDoc?.date
      ? new Date(latestAttendanceDoc.date)
      : now;
    const endDate = anchorDate.getTime() > now.getTime() ? anchorDate : now;
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 13);
    startDate.setHours(0, 0, 0, 0);

    const attendanceTrendAgg = await AttendanceModel.aggregate<{
      _id: {
        dateStr: string;
        role: string;
      };
      count: number;
    }>([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            dateStr: {
              $dateToString: { format: "%Y-%m-%d", date: "$date" },
            },
            role: "$role",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const attendanceTrends: AttendanceTrendPoint[] = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0] || "";
      const dayLabel = `${monthNames[d.getMonth()]} ${d.getDate()}`;

      const memberMatch = attendanceTrendAgg.find(
        (a) => a._id.dateStr === dateStr && a._id.role === "member",
      );
      const trainerMatch = attendanceTrendAgg.find(
        (a) => a._id.dateStr === dateStr && a._id.role === "trainer",
      );

      const membersCount = memberMatch?.count || 0;
      const trainersCount = trainerMatch?.count || 0;

      attendanceTrends.push({
        date: dateStr,
        label: dayLabel,
        members: membersCount,
        trainers: trainersCount,
        total: membersCount + trainersCount,
      });
    }

    // Peak Workout Hours (Distribution 6 AM to 10 PM)
    const peakHoursAgg = await AttendanceModel.aggregate<{
      _id: number;
      count: number;
    }>([
      {
        $group: {
          _id: { $hour: "$checkIn" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const peakHours: PeakHourPoint[] = [];
    for (let h = 6; h <= 21; h++) {
      const match = peakHoursAgg.find((p) => p._id === h);
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      const ampm = h < 12 ? "AM" : "PM";
      peakHours.push({
        hour: h,
        label: `${hour12} ${ampm}`,
        count: match?.count || 0,
      });
    }

    // Plan Distribution Calculation
    const totalAssignments = assignmentsByPlan.reduce((acc, curr) => acc + curr.count, 0);
    const planDistribution: PlanDistributionItem[] = membershipPlans.map((plan) => {
      const match = assignmentsByPlan.find(
        (a) => a._id === plan.membershipPlanId,
      );
      const count = match?.count || 0;
      const percentage =
        totalAssignments > 0 ? Math.round((count / totalAssignments) * 100) : 0;
      return {
        planId: plan.membershipPlanId,
        planName: plan.planName,
        count,
        percentage,
        durationMonths: plan.durationMonths,
        price: plan.price,
      };
    });

    // Populate user profile info for recent check-ins
    const recentUserIds = recentAttendanceDocs.map((doc) => doc.userId);
    const recentUsers = await UserModel.find({
      userId: { $in: recentUserIds },
    })
      .select("userId fullName profileImage role")
      .lean();

    const recentCheckIns: DashboardCheckIn[] = recentAttendanceDocs.map((doc) => {
      const matchedUser = recentUsers.find((u) => u.userId === doc.userId);
      return {
        attendanceId: doc.attendanceId,
        userId: doc.userId,
        fullName: matchedUser?.fullName || doc.userId,
        profileImage: matchedUser?.profileImage || "",
        role: (doc.role as "member" | "trainer") || "member",
        checkIn: doc.checkIn ? new Date(doc.checkIn).toISOString() : "",
        checkOut: doc.checkOut ? new Date(doc.checkOut).toISOString() : null,
        status: doc.status || "present",
        entryMethod: doc.entryMethod || "kiosk",
      };
    });

    // Format Upcoming Events
    const upcomingEvents: DashboardEvent[] = upcomingEventsDocs
      .filter((ev) => new Date(ev.date) >= startOfToday)
      .slice(0, 5)
      .map((ev) => ({
        eventId: ev.eventId,
        title: ev.title,
        description: ev.description || "",
        date: new Date(ev.date).toISOString(),
        time: ev.time,
        visibility: ev.visibility || "all",
      }));

    // If no future events, include the latest 5 active events for visibility
    if (upcomingEvents.length === 0 && upcomingEventsDocs.length > 0) {
      upcomingEventsDocs.slice(0, 5).forEach((ev) => {
        upcomingEvents.push({
          eventId: ev.eventId,
          title: ev.title,
          description: ev.description || "",
          date: new Date(ev.date).toISOString(),
          time: ev.time,
          visibility: ev.visibility || "all",
        });
      });
    }

    // Format Birthdays
    const birthdaysThisMonth: DashboardBirthday[] = birthdaysDocs.map((user) => {
      const dobDate = user.dob ? new Date(user.dob) : new Date();
      return {
        userId: user.userId,
        fullName: user.fullName,
        role: user.role as "member" | "trainer",
        dob: user.dob ? new Date(user.dob).toISOString() : "",
        profileImage: user.profileImage || "",
        day: dobDate.getDate(),
      };
    }).sort((a, b) => a.day - b.day);

    // Format Enquiries
    const recentEnquiries: DashboardEnquiry[] = recentEnquiriesDocs.map((enq) => ({
      enquiryId: enq.enquiryId,
      fullName: enq.fullName,
      email: enq.email,
      role: enq.role,
      subject: enq.subject,
      createdAt: (enq as any).createdAt
        ? new Date((enq as any).createdAt).toISOString()
        : new Date().toISOString(),
      replied: enq.replied,
    }));

    return {
      kpis: {
        totalMembers,
        activeMembers,
        inactiveMembers,
        newMembersThisMonth,
        memberGrowthRate,
        totalTrainers,
        activeTrainers,
        todayAttendance: todayAttendanceCount,
        currentlyCheckedIn: currentlyCheckedInCount,
        totalRevenueCollected: financialStats.totalCollected,
        totalPendingDues: financialStats.totalDue,
        totalOverdue,
        pendingEnquiries: pendingEnquiriesCount,
        activeEvents: upcomingEventsDocs.length,
      },
      attendanceTrends,
      peakHours,
      financialOverview: {
        totalBilled: financialStats.totalBilled,
        totalCollected: financialStats.totalCollected,
        totalDue: financialStats.totalDue,
        collectionRate,
        paymentStatusBreakdown,
        monthlyTrends,
      },
      planDistribution,
      demographics,
      plansOverview: {
        totalWorkoutPlans,
        totalDietPlans,
        totalMembershipPlans,
      },
      recentCheckIns,
      upcomingEvents,
      birthdaysThisMonth,
      recentEnquiries,
    };
  }

  // Trainer Customized Dashboard Overview
  public async getTrainerOverview(
    trainerId: string,
  ): Promise<TrainerDashboardResponse> {
    const normalizedTrainerId = trainerId.trim().toUpperCase();

    const [user, details, payment] = await Promise.all([
      UserModel.findOne({ userId: normalizedTrainerId }),
      TrainerDetailsModel.findOne({ userId: normalizedTrainerId }),
      TrainerPaymentModel.findOne({ userId: normalizedTrainerId }),
    ]);

    if (!user) {
      throw new AppError("Trainer profile not found", 404);
    }

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0,
    );
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

    const [trainerTodayAttendance, trainerMonthlyAttendanceCount] =
      await Promise.all([
        AttendanceModel.findOne({
          userId: normalizedTrainerId,
          date: { $gte: startOfToday, $lte: endOfToday },
        }),
        AttendanceModel.countDocuments({
          userId: normalizedTrainerId,
          date: { $gte: startOfMonth },
          status: { $in: ["present", "checked_in", "checked_out"] },
        }),
      ]);

    const assignments = await MemberAssignmentModel.find({
      trainerId: normalizedTrainerId,
    }).sort({ createdAt: -1 });

    const latestAssignmentByMember = new Map<string, any>();
    for (const asgn of assignments) {
      if (!latestAssignmentByMember.has(asgn.userId)) {
        latestAssignmentByMember.set(asgn.userId, asgn);
      }
    }

    const assignedUserIds = Array.from(latestAssignmentByMember.keys());
    const totalAssignedMembers = assignedUserIds.length;

    const activeAssignments = Array.from(
      latestAssignmentByMember.values(),
    ).filter((a) => a.status === "ACTIVE");
    const activeAssignedMembers = activeAssignments.length;

    const memberUsers = await UserModel.find({
      userId: { $in: assignedUserIds },
    });
    const userMap = new Map(memberUsers.map((u) => [u.userId, u]));

    const planIds = new Set<string>();
    const workoutPlanIds = new Set<string>();
    const dietPlanIds = new Set<string>();

    for (const asgn of latestAssignmentByMember.values()) {
      if (asgn.membershipPlanId) planIds.add(asgn.membershipPlanId);
      if (asgn.workoutPlanId) workoutPlanIds.add(asgn.workoutPlanId);
      if (asgn.dietPlanId) dietPlanIds.add(asgn.dietPlanId);
    }

    const [membershipPlans, workoutPlans, dietPlans] = await Promise.all([
      MembershipPlanModel.find({
        membershipPlanId: { $in: Array.from(planIds) },
      }),
      WorkoutPlanModel.find({
        workoutPlanId: { $in: Array.from(workoutPlanIds) },
      }),
      DietPlanModel.find({ dietPlanId: { $in: Array.from(dietPlanIds) } }),
    ]);

    const membershipPlanMap = new Map(
      membershipPlans.map((p) => [p.membershipPlanId, p]),
    );
    const workoutPlanMap = new Map(
      workoutPlans.map((p) => [p.workoutPlanId, p]),
    );
    const dietPlanMap = new Map(dietPlans.map((p) => [p.dietPlanId, p]));

    const todayAttendanceDocs = await AttendanceModel.find({
      userId: { $in: assignedUserIds },
      date: { $gte: startOfToday, $lte: endOfToday },
    }).sort({ checkIn: -1 });

    const todayAttendanceMap = new Map(
      todayAttendanceDocs.map((att) => [att.userId, att]),
    );

    let todayAssignedPresent = 0;
    let currentlyCheckedIn = 0;

    for (const att of todayAttendanceDocs) {
      todayAssignedPresent++;
      if (att.status === "checked_in" || !att.checkOut) {
        currentlyCheckedIn++;
      }
    }

    const attendanceRate =
      activeAssignedMembers > 0
        ? Math.min(
            100,
            Math.round((todayAssignedPresent / activeAssignedMembers) * 100),
          )
        : 0;

    let activeWorkoutPlans = 0;
    let activeDietPlans = 0;
    for (const asgn of activeAssignments) {
      if (asgn.workoutPlanId) activeWorkoutPlans++;
      if (asgn.dietPlanId) activeDietPlans++;
    }

    const assignedMembers = assignedUserIds.map((uid) => {
      const u = userMap.get(uid);
      const asgn = latestAssignmentByMember.get(uid);
      const mPlan = asgn?.membershipPlanId
        ? membershipPlanMap.get(asgn.membershipPlanId)
        : null;
      const wPlan = asgn?.workoutPlanId
        ? workoutPlanMap.get(asgn.workoutPlanId)
        : null;
      const dPlan = asgn?.dietPlanId
        ? dietPlanMap.get(asgn.dietPlanId)
        : null;
      const todayAtt = todayAttendanceMap.get(uid);

      return {
        userId: uid,
        fullName: u?.fullName || uid,
        email: u?.email || "",
        phone: u?.phone || "",
        gender: u?.gender || "other",
        profileImage: u?.profileImage || "",
        assignmentId: asgn?.assignmentId,
        status: asgn?.status || "INACTIVE",
        startDate: asgn?.startDate
          ? new Date(asgn.startDate).toISOString()
          : undefined,
        endDate: asgn?.endDate
          ? new Date(asgn.endDate).toISOString()
          : undefined,
        membershipPlan: mPlan
          ? {
              planId: mPlan.membershipPlanId,
              name: mPlan.planName,
              planName: mPlan.planName,
            }
          : null,
        workoutPlan: wPlan
          ? {
              planId: wPlan.workoutPlanId,
              name: wPlan.planName,
              planName: wPlan.planName,
            }
          : null,
        dietPlan: dPlan
          ? {
              planId: dPlan.dietPlanId,
              name: dPlan.planName,
              planName: dPlan.planName,
            }
          : null,
        todayAttendance: todayAtt
          ? {
              status: todayAtt.status,
              checkIn: new Date(todayAtt.checkIn).toISOString(),
              checkOut: todayAtt.checkOut
                ? new Date(todayAtt.checkOut).toISOString()
                : null,
              durationMinutes: todayAtt.durationMinutes || 0,
            }
          : null,
      };
    });

    const todayAttendanceFeed = todayAttendanceDocs.map((att) => {
      const u = userMap.get(att.userId);
      return {
        attendanceId: att.attendanceId,
        userId: att.userId,
        fullName: u?.fullName || att.userId,
        profileImage: u?.profileImage || "",
        role: "member" as const,
        checkIn: new Date(att.checkIn).toISOString(),
        checkOut: att.checkOut ? new Date(att.checkOut).toISOString() : null,
        status: att.status,
        entryMethod: att.entryMethod,
      };
    });

    const upcomingEventsDocs = await EventModal.find({
      date: { $gte: startOfToday },
    })
      .sort({ date: 1 })
      .limit(5);

    const upcomingEvents = upcomingEventsDocs.map((evt) => ({
      eventId: evt.eventId,
      title: evt.name,
      description: evt.description,
      date: new Date(evt.date).toISOString().split("T")[0],
      time: evt.time,
      visibility: evt.visibility,
    }));

    return {
      trainerProfile: {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || "",
        profileImage: user.profileImage || "",
        specialization: details?.specialization || ["General Fitness"],
        experienceYears: details?.experienceYears || 0,
        qualification: details?.qualification || "Certified Fitness Trainer",
        shiftTime: details?.shiftTime || { start: "06:00", end: "14:00" },
        employmentStatus: details?.employmentStatus || "active",
      },
      kpis: {
        totalAssignedMembers,
        activeAssignedMembers,
        todayAssignedPresent,
        currentlyCheckedIn,
        attendanceRate,
        activeWorkoutPlans,
        activeDietPlans,
      },
      todayAttendanceFeed,
      assignedMembers,
      personalStats: {
        personalAttendanceThisMonth: trainerMonthlyAttendanceCount,
        todayCheckedIn: !!trainerTodayAttendance,
        todayCheckInTime: trainerTodayAttendance?.checkIn
          ? new Date(trainerTodayAttendance.checkIn).toISOString()
          : null,
        salary: payment?.salary || 0,
        paymentStatus: payment?.paymentStatus || "PENDING",
      },
      upcomingEvents,
    };
  }

  // Member Customized Dashboard Overview
  public async getMemberOverview(
    memberId: string,
  ): Promise<MemberDashboardResponse> {
    const normalizedMemberId = memberId.trim().toUpperCase();

    const user = await UserModel.findOne({ userId: normalizedMemberId });
    if (!user) {
      throw new AppError("Member profile not found", 404);
    }

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0,
    );
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

    // Latest or active member assignment
    const assignment = await MemberAssignmentModel.findOne({
      userId: normalizedMemberId,
    }).sort({ createdAt: -1 });

    let activeMembership = null;
    let assignedTrainer = null;
    let assignedWorkoutPlan = null;
    let assignedDietPlan = null;

    if (assignment) {
      const [mPlan, trnUser, trnDetails, wPlan, dPlan] = await Promise.all([
        assignment.membershipPlanId
          ? MembershipPlanModel.findOne({
              membershipPlanId: assignment.membershipPlanId,
            })
          : null,
        assignment.trainerId
          ? UserModel.findOne({ userId: assignment.trainerId })
          : null,
        assignment.trainerId
          ? TrainerDetailsModel.findOne({ userId: assignment.trainerId })
          : null,
        assignment.workoutPlanId
          ? WorkoutPlanModel.findOne({
              workoutPlanId: assignment.workoutPlanId,
            })
          : null,
        assignment.dietPlanId
          ? DietPlanModel.findOne({ dietPlanId: assignment.dietPlanId })
          : null,
      ]);

      const endMs = assignment.endDate
        ? new Date(assignment.endDate).getTime()
        : 0;
      const daysRemaining = Math.max(
        0,
        Math.ceil((endMs - now.getTime()) / (1000 * 60 * 60 * 24)),
      );

      if (mPlan) {
        activeMembership = {
          planId: mPlan.membershipPlanId,
          name: mPlan.planName,
          planName: mPlan.planName,
          price: mPlan.price,
          durationMonths: mPlan.durationMonths,
          startDate: assignment.startDate
            ? new Date(assignment.startDate).toISOString()
            : new Date().toISOString(),
          endDate: assignment.endDate
            ? new Date(assignment.endDate).toISOString()
            : new Date().toISOString(),
          status: assignment.status as "ACTIVE" | "EXPIRED" | "CANCELLED",
          daysRemaining,
        };
      }

      if (trnUser) {
        assignedTrainer = {
          userId: trnUser.userId,
          fullName: trnUser.fullName,
          profileImage: trnUser.profileImage || "",
          phone: trnUser.phone || "",
          email: trnUser.email,
          qualification: trnDetails?.qualification || "Certified Fitness Trainer",
          experienceYears: trnDetails?.experienceYears || 0,
          specialization: trnDetails?.specialization || ["General Fitness"],
          shiftTime: trnDetails?.shiftTime || {
            start: "06:00",
            end: "14:00",
          },
        };
      }

      if (wPlan) {
        assignedWorkoutPlan = {
          planId: wPlan.workoutPlanId,
          name: wPlan.planName,
          planName: wPlan.planName,
          fitnessGoal: wPlan.goal,
          difficulty: "Intermediate",
          durationWeeks: 4,
        };
      }

      if (dPlan) {
        assignedDietPlan = {
          planId: dPlan.dietPlanId,
          name: dPlan.planName,
          planName: dPlan.planName,
          goal: dPlan.goal,
          caloriesPerDay: 2200,
        };
      }
    }

    // Attendance stats
    const [todayAttendance, monthlyAttendances, allRecentAttendances] =
      await Promise.all([
        AttendanceModel.findOne({
          userId: normalizedMemberId,
          date: { $gte: startOfToday, $lte: endOfToday },
        }),
        AttendanceModel.find({
          userId: normalizedMemberId,
          date: { $gte: startOfMonth },
        }),
        AttendanceModel.find({
          userId: normalizedMemberId,
        })
          .sort({ date: -1, checkIn: -1 })
          .limit(30),
      ]);

    const totalVisitsThisMonth = monthlyAttendances.length;

    let totalDuration = 0;
    let completedSessions = 0;
    for (const att of monthlyAttendances) {
      if (att.durationMinutes && att.durationMinutes > 0) {
        totalDuration += att.durationMinutes;
        completedSessions++;
      }
    }
    const averageSessionMinutes =
      completedSessions > 0 ? Math.round(totalDuration / completedSessions) : 0;

    let todayGymStatus: "CHECKED_IN" | "COMPLETED" | "NOT_VISITED" =
      "NOT_VISITED";
    let todayCheckInTime: string | null = null;

    if (todayAttendance) {
      todayCheckInTime = new Date(todayAttendance.checkIn).toISOString();
      if (todayAttendance.checkOut || todayAttendance.status === "checked_out") {
        todayGymStatus = "COMPLETED";
      } else {
        todayGymStatus = "CHECKED_IN";
      }
    }

    // Attendance Streak Calculation
    const uniqueDates = Array.from(
      new Set(
        allRecentAttendances.map(
          (a) => new Date(a.date).toISOString().split("T")[0],
        ),
      ),
    ).sort((a, b) => (a < b ? 1 : -1));

    let attendanceStreak = 0;
    const todayStr = now.toISOString().split("T")[0];
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let checkDate = uniqueDates.includes(todayStr)
      ? todayStr
      : uniqueDates.includes(yesterdayStr)
        ? yesterdayStr
        : null;

    if (checkDate) {
      let cur = new Date(checkDate);
      while (true) {
        const curStr = cur.toISOString().split("T")[0];
        if (uniqueDates.includes(curStr)) {
          attendanceStreak++;
          cur.setDate(cur.getDate() - 1);
        } else {
          break;
        }
      }
    }

    const recentAttendance = allRecentAttendances.map((rec) => ({
      attendanceId: rec.attendanceId,
      date: new Date(rec.date).toISOString().split("T")[0],
      checkIn: new Date(rec.checkIn).toISOString(),
      checkOut: rec.checkOut ? new Date(rec.checkOut).toISOString() : null,
      durationMinutes: rec.durationMinutes || 0,
      status: rec.status,
    }));

    // Payment Summary
    const [paymentRecord, lastReceipt] = await Promise.all([
      MemberPaymentModel.findOne({ userId: normalizedMemberId }).sort({
        createdAt: -1,
      }),
      MemberPaymentReceiptModel.findOne({ userId: normalizedMemberId }).sort({
        paymentDate: -1,
      }),
    ]);

    const paymentSummary = paymentRecord
      ? {
          amountDue: paymentRecord.amountDue || 0,
          paymentStatus: paymentRecord.paymentStatus || "PENDING",
          lastPaymentDate: lastReceipt?.paymentDate
            ? new Date(lastReceipt.paymentDate).toISOString()
            : null,
        }
      : null;

    const upcomingEventsDocs = await EventModal.find({
      date: { $gte: startOfToday },
    })
      .sort({ date: 1 })
      .limit(5);

    const upcomingEvents = upcomingEventsDocs.map((evt) => ({
      eventId: evt.eventId,
      title: evt.name,
      description: evt.description,
      date: new Date(evt.date).toISOString().split("T")[0],
      time: evt.time,
      visibility: evt.visibility,
    }));

    return {
      memberProfile: {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || "",
        profileImage: user.profileImage || "",
        gender: user.gender,
      },
      kpis: {
        totalVisitsThisMonth,
        attendanceStreak,
        averageSessionMinutes,
        todayGymStatus,
        todayCheckInTime,
        daysRemainingInPlan: activeMembership?.daysRemaining ?? 0,
      },
      activeMembership,
      assignedTrainer,
      assignedWorkoutPlan,
      assignedDietPlan,
      recentAttendance,
      paymentSummary,
      upcomingEvents,
    };
  }
}

export default new DashboardService();
