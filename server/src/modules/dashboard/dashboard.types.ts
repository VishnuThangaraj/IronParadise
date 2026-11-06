export interface DashboardKPIs {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  newMembersThisMonth: number;
  memberGrowthRate: number;
  totalTrainers: number;
  activeTrainers: number;
  todayAttendance: number;
  currentlyCheckedIn: number;
  totalRevenueCollected: number;
  totalPendingDues: number;
  totalOverdue: number;
  pendingEnquiries: number;
  activeEvents: number;
}

export interface AttendanceTrendPoint {
  date: string;
  label: string;
  members: number;
  trainers: number;
  total: number;
}

export interface PeakHourPoint {
  hour: number;
  label: string;
  count: number;
}

export interface PaymentStatusCount {
  status: "PAID" | "PARTIAL" | "PENDING" | "OVERDUE";
  count: number;
  amount: number;
}

export interface MonthlyFinancialTrend {
  month: string;
  collected: number;
  due: number;
}

export interface FinancialOverview {
  totalBilled: number;
  totalCollected: number;
  totalDue: number;
  collectionRate: number;
  paymentStatusBreakdown: PaymentStatusCount[];
  monthlyTrends: MonthlyFinancialTrend[];
}

export interface PlanDistributionItem {
  planId: string;
  planName: string;
  count: number;
  percentage: number;
  durationMonths: number;
  price: number;
}

export interface Demographics {
  male: number;
  female: number;
  other: number;
  total: number;
}

export interface PlansOverview {
  totalWorkoutPlans: number;
  totalDietPlans: number;
  totalMembershipPlans: number;
}

export interface DashboardCheckIn {
  attendanceId: string;
  userId: string;
  fullName: string;
  profileImage: string;
  role: "member" | "trainer";
  checkIn: string;
  checkOut: string | null;
  status: string;
  entryMethod: string;
}

export interface DashboardEvent {
  eventId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  visibility: string;
}

export interface DashboardBirthday {
  userId: string;
  fullName: string;
  role: "member" | "trainer";
  dob: string;
  profileImage: string;
  day: number;
}

export interface DashboardEnquiry {
  enquiryId: string;
  fullName: string;
  email: string;
  role: string;
  subject: string;
  createdAt: string;
  replied: boolean;
}

export interface DashboardOverviewResponse {
  kpis: DashboardKPIs;
  attendanceTrends: AttendanceTrendPoint[];
  peakHours: PeakHourPoint[];
  financialOverview: FinancialOverview;
  planDistribution: PlanDistributionItem[];
  demographics: Demographics;
  plansOverview: PlansOverview;
  recentCheckIns: DashboardCheckIn[];
  upcomingEvents: DashboardEvent[];
  birthdaysThisMonth: DashboardBirthday[];
  recentEnquiries: DashboardEnquiry[];
}

export interface TrainerKPIs {
  totalAssignedMembers: number;
  activeAssignedMembers: number;
  todayAssignedPresent: number;
  currentlyCheckedIn: number;
  attendanceRate: number;
  activeWorkoutPlans: number;
  activeDietPlans: number;
}

export interface TrainerProfileSummary {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  profileImage: string;
  specialization: string[];
  experienceYears: number;
  qualification: string;
  shiftTime: { start: string; end: string };
  employmentStatus: string;
}

export interface TrainerAssignedMemberItem {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  profileImage: string;
  assignmentId?: string;
  status: string;
  startDate?: string;
  endDate?: string;
  membershipPlan?: {
    planId: string;
    name: string;
  } | null;
  workoutPlan?: {
    planId: string;
    name: string;
  } | null;
  dietPlan?: {
    planId: string;
    name: string;
  } | null;
  todayAttendance?: {
    status: string;
    checkIn: string;
    checkOut: string | null;
    durationMinutes: number;
  } | null;
}

export interface TrainerDashboardResponse {
  trainerProfile: TrainerProfileSummary;
  kpis: TrainerKPIs;
  todayAttendanceFeed: DashboardCheckIn[];
  assignedMembers: TrainerAssignedMemberItem[];
  personalStats: {
    personalAttendanceThisMonth: number;
    todayCheckedIn: boolean;
    todayCheckInTime: string | null;
    salary: number;
    paymentStatus: string;
  };
  upcomingEvents: DashboardEvent[];
}

export interface MemberKPIs {
  totalVisitsThisMonth: number;
  attendanceStreak: number;
  averageSessionMinutes: number;
  todayGymStatus: "CHECKED_IN" | "COMPLETED" | "NOT_VISITED";
  todayCheckInTime: string | null;
  daysRemainingInPlan: number;
}

export interface MemberTrainerDetails {
  userId: string;
  fullName: string;
  profileImage: string;
  phone: string;
  email: string;
  qualification: string;
  experienceYears: number;
  specialization: string[];
  shiftTime: { start: string; end: string };
}

export interface MemberActivePlan {
  planId: string;
  name: string;
  price: number;
  durationMonths: number;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
  daysRemaining: number;
}

export interface MemberDashboardResponse {
  memberProfile: {
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    profileImage: string;
    gender: string;
  };
  kpis: MemberKPIs;
  activeMembership: MemberActivePlan | null;
  assignedTrainer: MemberTrainerDetails | null;
  assignedWorkoutPlan: {
    planId: string;
    name: string;
    fitnessGoal: string;
    difficulty: string;
    durationWeeks: number;
  } | null;
  assignedDietPlan: {
    planId: string;
    name: string;
    goal: string;
    caloriesPerDay: number;
  } | null;
  recentAttendance: {
    attendanceId: string;
    date: string;
    checkIn: string;
    checkOut: string | null;
    durationMinutes: number;
    status: string;
  }[];
  paymentSummary: {
    amountDue: number;
    paymentStatus: string;
    lastPaymentDate: string | null;
  } | null;
  upcomingEvents: DashboardEvent[];
}
