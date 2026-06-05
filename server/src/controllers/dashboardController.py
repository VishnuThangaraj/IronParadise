from datetime import datetime, timedelta
from src.models.Member import Member
from src.models.Trainer import Trainer
from src.models.Enquiry import Enquiry
from src.models.Attendance import Attendance
from src.models.MemberPayment import MemberPayment

async def get_dashboard_metrics():
    # 1. Basic Counts
    total_members = await Member.find(Member.isActive == True).count()
    inactive_members = await Member.find(Member.isActive == False).count()
    total_trainers = await Trainer.find(Trainer.isWorking == True).count()
    pending_enquiries = await Enquiry.find(Enquiry.status == "pending").count()

    # 1.5 Additional Member Demographics & Status
    member_status_dist = [
        {"name": "Active", "value": total_members},
        {"name": "Inactive", "value": inactive_members}
    ]

    male_members = await Member.find(Member.gender == "Male").count()
    female_members = await Member.find(Member.gender == "Female").count()
    other_members = await Member.find({"gender": {"$nin": ["Male", "Female"]}}).count()
    
    member_gender_dist = [
        {"name": "Male", "value": male_members},
        {"name": "Female", "value": female_members},
    ]
    if other_members > 0:
        member_gender_dist.append({"name": "Other", "value": other_members})

    # 1.6 Financials
    start_of_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    pipeline = [
        {"$unwind": "$paymentHistory"},
        {"$match": {"paymentHistory.paymentDate": {"$gte": start_of_month}}},
        {"$group": {"_id": None, "totalRevenue": {"$sum": "$paymentHistory.paidAmount"}}}
    ]
    revenue_result = await Member.aggregate(pipeline).to_list()
    revenue_this_month = revenue_result[0]["totalRevenue"] if revenue_result else 0.0

    # 1.7 Recent Members
    recent_members_docs = await Member.find().sort("-joinDate").limit(5).to_list()
    recent_members = [
        {
            "id": str(m.id),
            "memberId": m.memberId,
            "name": m.name,
            "email": m.email,
            "joinDate": m.joinDate.isoformat() if m.joinDate else None,
            "isActive": m.isActive
        }
        for m in recent_members_docs
    ]

    # 2. Today's Attendance
    now = datetime.utcnow()
    today_dt = datetime(now.year, now.month, now.day)
    today_attendance_records = await Attendance.find(Attendance.date == today_dt).to_list()
    
    # Each document in Attendance is a user's bucket for the day. So the number of documents is the number of unique people who checked in today.
    today_checkins = len(today_attendance_records)

    # 3. Weekly Attendance Trend (Last 7 days)
    weekly_trend = []
    for i in range(6, -1, -1):
        target_date = now - timedelta(days=i)
        target_date_str = target_date.strftime("%Y-%m-%d")
        target_dt = datetime(target_date.year, target_date.month, target_date.day)
        
        # Count documents for that date
        day_count = await Attendance.find(Attendance.date == target_dt).count()
        
        weekly_trend.append({
            "name": target_date.strftime("%a"), # e.g., 'Mon', 'Tue'
            "checkins": day_count,
            "fullDate": target_date_str
        })

    # 4. Member vs Trainer Ratio
    demographics = [
        {"name": "Members", "value": total_members},
        {"name": "Trainers", "value": total_trainers}
    ]

    return {
        "summary": {
            "totalMembers": total_members,
            "totalTrainers": total_trainers,
            "pendingEnquiries": pending_enquiries,
            "todayCheckins": today_checkins,
            "revenueThisMonth": revenue_this_month
        },
        "weeklyTrend": weekly_trend,
        "demographics": demographics,
        "memberStatusDist": member_status_dist,
        "memberGenderDist": member_gender_dist,
        "recentMembers": recent_members
    }
