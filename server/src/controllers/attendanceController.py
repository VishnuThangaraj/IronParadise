import os
import json
from typing import Optional
from datetime import datetime
from fastapi import HTTPException, status

from src.models.Attendance import Attendance, AttendanceRecord
from src.models.Member import Member
from src.models.Trainer import Trainer
from src.schemas.attendanceSchemas import AttendanceActionRequest


async def check_in(data: AttendanceActionRequest):
    user_name = ""
    if data.userType == "member":
        user = await Member.find_one(Member.memberId == data.userId)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Member not found"
            )
        user_name = user.name
    else:  # trainer
        user = await Trainer.find_one(Trainer.trainerID == data.userId)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trainer not found"
            )
        user_name = user.name

    now = datetime.utcnow()
    today = datetime(now.year, now.month, now.day)

    # Find the most recent attendance record for the user
    last_attendance = await Attendance.find(
        Attendance.userId == data.userId
    ).sort(-Attendance.date).first_or_none()

    # Check for open active session
    if last_attendance and len(last_attendance.records) > 0:
        if last_attendance.records[-1].checkOut is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is already checked in. Please check out first."
            )

    # Perform check-in
    if last_attendance and last_attendance.date == today:
        # Append to existing daily document
        last_attendance.records.append(AttendanceRecord(checkIn=now))
        last_attendance.status = "checked-in"
        await last_attendance.save()
        return {
            "message": f"{data.userType.capitalize()} checked in successfully",
            "attendance": last_attendance
        }
    else:
        # Create a new daily document
        new_attendance = Attendance(
            userId=data.userId,
            userType=data.userType,
            userName=user_name,
            date=today,
            status="checked-in",
            records=[AttendanceRecord(checkIn=now)],
            totalMinutes=0.0
        )
        await new_attendance.insert()
        return {
            "message": f"{data.userType.capitalize()} checked in successfully",
            "attendance": new_attendance
        }


async def check_out(data: AttendanceActionRequest):
    now = datetime.utcnow()

    # Find the most recent attendance record for the user
    last_attendance = await Attendance.find(
        Attendance.userId == data.userId
    ).sort(-Attendance.date).first_or_none()

    if not last_attendance or len(last_attendance.records) == 0 or last_attendance.records[-1].checkOut is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active check-in session found for this user."
        )

    last_record = last_attendance.records[-1]
    last_record.checkOut = now

    # Calculate session duration
    duration_mins = (now - last_record.checkIn).total_seconds() / 60.0
    last_attendance.totalMinutes += duration_mins
    last_attendance.status = "checked-out"

    await last_attendance.save()
    return {
        "message": f"{data.userType.capitalize()} checked out successfully",
        "attendance": last_attendance
    }


async def fetch_user_status(userId: str):
    last_attendance = await Attendance.find(
        Attendance.userId == userId
    ).sort(-Attendance.date).first_or_none()

    if not last_attendance:
        return {"status": "absent", "lastRecord": None}
    
    return {
        "status": last_attendance.status,
        "lastRecord": last_attendance
    }


async def fetch_attendance_logs(
    date: Optional[str] = None,
    month: Optional[str] = None,
    userType: Optional[str] = None,
    userId: Optional[str] = None,
    skip: int = 0,
    limit: int = 50
):
    query = {}
    if userId:
        query["userId"] = userId
    if userType:
        query["userType"] = userType
        
    if date:
        try:
            dt = datetime.strptime(date, "%Y-%m-%d")
            query["date"] = datetime(dt.year, dt.month, dt.day)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid date format. Use YYYY-MM-DD."
            )
    elif month:
        try:
            dt = datetime.strptime(month, "%Y-%m")
            start_date = datetime(dt.year, dt.month, 1)
            next_month = dt.month % 12 + 1
            next_month_year = dt.year + (dt.month // 12)
            end_date = datetime(next_month_year, next_month, 1)
            query["date"] = {"$gte": start_date, "$lt": end_date}
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid month format. Use YYYY-MM."
            )

    try:
        if month:
            logs = await Attendance.find(query).sort(-Attendance.date).to_list(length=None)
        else:
            logs = await Attendance.find(query).sort(-Attendance.date).skip(skip).limit(limit).to_list(length=None)
        return logs
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


async def fetch_attendance_summary():
    now = datetime.utcnow()
    today = datetime(now.year, now.month, now.day)

    checked_in_count = await Attendance.find(Attendance.status == "checked-in").count()
    today_records = await Attendance.find(Attendance.date == today).to_list(length=None)

    total_check_ins_today = sum(len(att.records) for att in today_records)

    durations = []
    for att in today_records:
        for rec in att.records:
            if rec.checkOut:
                durations.append((rec.checkOut - rec.checkIn).total_seconds() / 60.0)

    avg_duration = sum(durations) / len(durations) if durations else 0.0

    return {
        "currentlyCheckedIn": checked_in_count,
        "totalCheckInsToday": total_check_ins_today,
        "averageDurationMinutes": round(avg_duration, 1)
    }


async def populate_attendance():
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        json_path = os.path.join(current_dir, "..", "data", "attendance.json")
        with open(json_path, "r") as file:
            data = json.load(file)

        await Attendance.delete_all()

        docs = []
        for d in data:
            date_obj = datetime.strptime(d["date"], "%Y-%m-%dT%H:%M:%SZ")
            records = []
            for r in d.get("records", []):
                cin = datetime.strptime(r["checkIn"], "%Y-%m-%dT%H:%M:%SZ")
                cout = None
                if r.get("checkOut"):
                    cout = datetime.strptime(r["checkOut"], "%Y-%m-%dT%H:%M:%SZ")
                records.append(AttendanceRecord(checkIn=cin, checkOut=cout))
            
            docs.append(Attendance(
                userId=d["userId"],
                userType=d["userType"],
                userName=d["userName"],
                date=date_obj,
                status=d["status"],
                records=records,
                totalMinutes=d.get("totalMinutes", 0.0)
            ))
        
        await Attendance.insert_many(docs)
        return {"message": "Attendance logs populated successfully", "count": len(docs)}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


async def fetch_kiosk_users():
    try:
        members = await Member.find().to_list()
        trainers = await Trainer.find().to_list()

        kiosk_users = []
        for m in members:
            # Mask mobile
            masked_mobile = f"******{m.mobile[-4:]}" if m.mobile and len(m.mobile) >= 4 else "******"
            kiosk_users.append({
                "id": m.memberId,
                "name": m.name,
                "type": "member",
                "mobile": masked_mobile,
                "subtext": f"Member • ID: {m.memberId}"
            })
            
        for t in trainers:
            masked_mobile = f"******{t.mobile[-4:]}" if t.mobile and len(t.mobile) >= 4 else "******"
            kiosk_users.append({
                "id": t.trainerID,
                "name": t.name,
                "type": "trainer",
                "mobile": masked_mobile,
                "subtext": f"Trainer • ID: {t.trainerID}"
            })

        return kiosk_users
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
