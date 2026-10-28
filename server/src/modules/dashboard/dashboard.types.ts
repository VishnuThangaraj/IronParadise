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
