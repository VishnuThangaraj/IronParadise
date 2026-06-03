from fastapi import HTTPException, status
from src.models.MemberMeasurement import MemberMeasurement, DailyMeasurement
from src.schemas.memberMeasurementSchemas import DailyMeasurementRequest

async def add_measurement(data: DailyMeasurementRequest):
    try:
        measurement_doc = await MemberMeasurement.find_one(
            MemberMeasurement.memberId == data.memberId
        )
        
        daily_record = DailyMeasurement(
            date=data.date,
            height=data.height,
            weight=data.weight,
            bmi=data.bmi,
            bodyFat=data.bodyFat,
            chest=data.chest,
            arms=data.arms,
            waist=data.waist,
            thighs=data.thighs
        )
        
        if not measurement_doc:
            measurement_doc = MemberMeasurement(
                memberId=data.memberId,
                measurements=[daily_record]
            )
            await measurement_doc.insert()
        else:
            existing_idx = next(
                (i for i, m in enumerate(measurement_doc.measurements) if m.date == data.date), 
                None
            )
            
            if existing_idx is not None:
                measurement_doc.measurements[existing_idx] = daily_record
            else:
                measurement_doc.measurements.append(daily_record)
            
            await measurement_doc.save()
            
        return {
            "message": "Daily measurement recorded successfully",
            "measurement": measurement_doc
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add measurement: {str(e)}"
        )

async def fetch_member_measurements(member_id: str):
    measurement_doc = await MemberMeasurement.find_one(
        MemberMeasurement.memberId == member_id
    )
    if not measurement_doc:
        return {"memberId": member_id, "measurements": []}
    
    measurement_doc.measurements.sort(key=lambda x: x.date, reverse=True)
    return measurement_doc

async def delete_daily_measurement(member_id: str, date: str):
    measurement_doc = await MemberMeasurement.find_one(
        MemberMeasurement.memberId == member_id
    )
    if not measurement_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Measurements not found for this member"
        )
        
    initial_len = len(measurement_doc.measurements)
    measurement_doc.measurements = [m for m in measurement_doc.measurements if m.date != date]
    
    if len(measurement_doc.measurements) == initial_len:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Measurement for the specified date not found"
        )
        
    await measurement_doc.save()
    return {
        "message": f"Measurement for {date} deleted successfully"
    }

async def delete_all_measurements(member_id: str):
    measurement_doc = await MemberMeasurement.find_one(
        MemberMeasurement.memberId == member_id
    )
    if measurement_doc:
        await measurement_doc.delete()
    return {"message": "All measurements deleted successfully"}

