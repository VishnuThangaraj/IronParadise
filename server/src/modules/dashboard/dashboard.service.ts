import UserModel from "../user/user.model.js";
import AttendanceModel from "../attendance/attendance.model.js";
import MemberPaymentModel from "../member/member-payment/member-payment.model.js";
import MemberAssignmentModel from "../member/member-assignment/member-assignment.model.js";
import MembershipPlanModel from "../membership-plan/membership-plan.model.js";
import WorkoutPlanModel from "../workout-plan/workout-plan.model.js";
import DietPlanModel from "../diet-plan/diet-plan.model.js";
import EventModal from "../event/event.modal.js";
import EnquiryModel from "../enquiry/enquiry.model.js";
import type {
  DashboardOverviewResponse,
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
}

export default new DashboardService();
