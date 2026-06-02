from h11._abnf import status_code
import os
import json
from fastapi import HTTPException, status
from pymongo.errors import DuplicateKeyError

from src.models.Trainer import Trainer
from src.schemas.trainerSchemas import TrainerRequest

#Create new Trainer
async def create_trainer(data: TrainerRequest):
    existing_trainer = await  Trainer.find_one(
        Trainer.email == data.email,
        Trainer.mobile == data.mobile
    )

    if existing_trainer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Trainer with this email or mobile already exists",
        )

    try:
        newTrainer = Trainer(**data.model_dump())
        await newTrainer.insert()

        return {
            "message": "Trainer created successfully",
            "trainer": newTrainer
        }   

    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Trainer with this email or mobile already exists",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create trainer: {str(e)}",
        )


#Fetch all Trainers
async def fetch_all_trainers():
    try:
        trainers = await Trainer.find().to_list(length=None)
        return trainers
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='Failed to retrieve Trainers'
        )

#Fetch single Trainer
async def fetch_trainer_by_id(id:str):
    trainer = await Trainer.find_one(Trainer.trainerID == id)
    if not trainer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Trainer not found'
        )   

    return trainer

#Update Trainer
async def update_trainer(id: str, data: TrainerRequest):
    trainer = await Trainer.find_one(Trainer.trainerID == id)
    if not trainer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Trainer not found'
        )
    
    if data.email != trainer.email or data.mobile != trainer.mobile:
        existing_trainer = await Trainer.find_one(
            (Trainer.email == data.email) | (Trainer.mobile == data.mobile)
        )
        # Verify it's not the current trainer
        if existing_trainer and existing_trainer.trainerID != id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Trainer with this email or mobile already exists",
            )
            
    update_data = data.model_dump(exclude_unset=False)
    for key, value in update_data.items():
        setattr(trainer, key, value)
        
    try:
        await trainer.save()
        return {
            "message": "Trainer updated successfully",
            "trainer": trainer
        }
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Trainer with this email or mobile already exists",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update trainer: {str(e)}",
        )


#Delete Trainer
async def delete_trainer(id: str):
    trainer = await Trainer.find_one(Trainer.trainerID == id)
    if not trainer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trainer not found",
        )
        
    try:
        await trainer.delete()
        return {
            "message": "Trainer deleted successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete trainer: {str(e)}",
        )


#Populate Trainer
async def populate_trainer():    
    import random
    from datetime import datetime
    from src.models.TrainerSalary import TrainerSalary
    from src.utils.getNextID import getNextID
    
    file_path = os.path.join(os.path.dirname(__file__), "..", "data", "trainer.json")
    with open(file_path, "r") as f:
        trainers = json.load(f)

    salary_file = os.path.join(os.path.dirname(__file__), "..", "data", "trainerSalary.json")
    try:
        with open(salary_file, "r") as f:
            salary_data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        salary_data = {}

    months = [
        "May 2026", "April 2026", "March 2026", "February 2026", "January 2026",
        "December 2025", "November 2025", "October 2025", "September 2025", "August 2025", "July 2025", "June 2025"
    ]

    for trainer in trainers:
        existing_trainer = await Trainer.find_one(Trainer.email == trainer["email"])
        if existing_trainer:
            continue
            
        newTrainer = Trainer(**trainer)
        await newTrainer.insert()
        
        email = trainer["email"]
        salary = trainer.get("salary", 3000.0)
        
        # Generate 12 months history if not present
        if email not in salary_data:
            history = []
            for month in months:
                is_paid = random.random() > 0.15
                paid = salary if is_paid else salary / 2
                pending = 0.0 if is_paid else salary / 2
                
                salary_id = await getNextID("trainer_salary")
                
                history.append({
                    "salaryID": salary_id,
                    "trainerID": newTrainer.trainerID,
                    "month": month,
                    "totalAmount": salary,
                    "paidAmount": paid,
                    "pendingAmount": pending,
                    "paymentDate": datetime.utcnow().isoformat() + "Z",
                    "paymentMethod": random.choice(["Bank Transfer", "Cash"]),
                    "status": "Paid" if is_paid else "Partially Paid",
                    "remarks": "Auto-populated monthly salary"
                })
            salary_data[email] = history
            
            # Attach the salary history to the Trainer document
            trainer_history = [TrainerSalary(**record) for record in history]
            total_pending = sum(record.pendingAmount for record in trainer_history)
            
            newTrainer.salaryHistory = trainer_history
            newTrainer.totalPendingAmount = total_pending
            await newTrainer.save()
            
    # Write back the generated history to the JSON file
    with open(salary_file, "w") as f:
        json.dump(salary_data, f, indent=2)

    return {
        "message": "Trainers and 10+ months salary history populated successfully"
    }

# --- Salary Management ---

def recalculate_pending_amount(trainer: Trainer):
    """Helper to recalculate total pending amount from history grouping by month."""
    from collections import defaultdict
    from datetime import datetime
    
    month_data = defaultdict(lambda: {"total": 0.0, "paid": 0.0})
    
    # Initialize current and previous month defaults with base salary if not before join date
    now = datetime.utcnow()
    current_month = now.strftime("%B %Y")
    if now.month == 1:
        prev_month_date = datetime(now.year - 1, 12, 1)
    else:
        prev_month_date = datetime(now.year, now.month - 1, 1)
    prev_month = prev_month_date.strftime("%B %Y")
    
    join_date = trainer.joinDate
    
    def is_month_before_join(month_label: str, jd: datetime) -> bool:
        if not jd:
            return False
        try:
            m_dt = datetime.strptime(month_label, "%B %Y")
            j_start = datetime(jd.year, jd.month, 1)
            return m_dt < j_start
        except Exception:
            return False
            
    if not is_month_before_join(current_month, join_date):
        month_data[current_month] = {"total": trainer.salary, "paid": 0.0}
    if not is_month_before_join(prev_month, join_date):
        month_data[prev_month] = {"total": trainer.salary, "paid": 0.0}
        
    for salary in trainer.salaryHistory:
        m = salary.month
        # Ensure we accumulate paid amount
        if m not in month_data:
            month_data[m] = {"total": 0.0, "paid": 0.0}
        month_data[m]["paid"] += salary.paidAmount
        month_total = salary.totalAmount if salary.totalAmount > 0 else trainer.salary
        month_data[m]["total"] = max(month_data[m]["total"], month_total)
    
    total_pending = sum(max(0.0, data["total"] - data["paid"]) for data in month_data.values())
    trainer.totalPendingAmount = total_pending

async def add_trainer_salary(id: str, data: dict):
    from src.models.TrainerSalary import TrainerSalary
    from src.utils.getNextID import getNextID
    trainer = await Trainer.find_one(Trainer.trainerID == id)
    if not trainer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trainer not found",
        )
    
    # Check if a salary record for this month already exists
    month = data.get("month")
    if any(s.month == month for s in trainer.salaryHistory):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"A salary record for {month} already exists for this trainer.",
        )
    
    data['salaryID'] = await getNextID("trainer_salary")
    data['trainerID'] = trainer.trainerID
    
    # Auto-calculate pendingAmount and status
    total = float(data.get('totalAmount', 0.0))
    paid = float(data.get('paidAmount', 0.0))
    data['pendingAmount'] = max(0.0, total - paid)
    
    if paid >= total:
        data['status'] = "Paid"
    elif paid == 0.0:
        data['status'] = "Unpaid"
    else:
        data['status'] = "Partially Paid"
    
    new_salary = TrainerSalary(**data)
    trainer.salaryHistory.append(new_salary)
    recalculate_pending_amount(trainer)
    
    try:
        await trainer.save()
        return {
            "message": "Salary record added successfully",
            "trainer": trainer
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add salary record: {str(e)}",
        )

async def update_trainer_salary(id: str, salary_id: str, data: dict):
    trainer = await Trainer.find_one(Trainer.trainerID == id)
    if not trainer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trainer not found",
        )
    
    salary_record = next((s for s in trainer.salaryHistory if s.salaryID == salary_id), None)
    if not salary_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Salary record not found",
        )
    
    for key, value in data.items():
        if hasattr(salary_record, key) and value is not None:
            setattr(salary_record, key, value)
            
    # Auto-calculate pendingAmount and status on the updated record
    salary_record.pendingAmount = max(0.0, salary_record.totalAmount - salary_record.paidAmount)
    if salary_record.paidAmount >= salary_record.totalAmount:
        salary_record.status = "Paid"
    elif salary_record.paidAmount == 0.0:
        salary_record.status = "Unpaid"
    else:
        salary_record.status = "Partially Paid"
            
    # Also update the parent document timestamp
    from datetime import datetime
    trainer.updatedAt = datetime.utcnow()
    recalculate_pending_amount(trainer)

    try:
        await trainer.save()
        return {
            "message": "Salary record updated successfully",
            "trainer": trainer
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update salary record: {str(e)}",
        )

async def remove_trainer_salary(id: str, salary_id: str):
    trainer = await Trainer.find_one(Trainer.trainerID == id)
    if not trainer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trainer not found",
        )
    
    initial_length = len(trainer.salaryHistory)
    trainer.salaryHistory = [s for s in trainer.salaryHistory if s.salaryID != salary_id]
    
    if len(trainer.salaryHistory) == initial_length:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Salary record not found",
        )
        
    recalculate_pending_amount(trainer)

    try:
        await trainer.save()
        return {
            "message": "Salary record removed successfully",
            "trainer": trainer
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to remove salary record: {str(e)}",
        )

async def bulk_pay_trainers(data: dict):
    from src.models.TrainerSalary import TrainerSalary
    from src.utils.getNextID import getNextID
    from datetime import datetime
    
    month = data.get("month")
    payment_date_str = data.get("paymentDate")
    if payment_date_str:
        if isinstance(payment_date_str, str):
            # Parse ISO date string
            payment_date = datetime.fromisoformat(payment_date_str.replace("Z", "+00:00"))
        else:
            payment_date = payment_date_str
    else:
        payment_date = datetime.utcnow()
        
    payment_method = data.get("paymentMethod") or "Bank Transfer"
    remarks = data.get("remarks") or "Bulk monthly payroll"
    
    # Fetch all active trainers
    trainers = await Trainer.find(Trainer.isWorking == True).to_list(length=None)
    
    processed_count = 0
    skipped_count = 0
    
    for trainer in trainers:
        # Check if they already have a record for this month
        if any(s.month == month for s in trainer.salaryHistory):
            skipped_count += 1
            continue
            
        salary_id = await getNextID("trainer_salary")
        salary_record = TrainerSalary(
            salaryID=salary_id,
            trainerID=trainer.trainerID,
            month=month,
            totalAmount=trainer.salary,
            paidAmount=trainer.salary,
            pendingAmount=0.0,
            paymentDate=payment_date,
            paymentMethod=payment_method,
            status="Paid",
            remarks=remarks
        )
        
        trainer.salaryHistory.append(salary_record)
        recalculate_pending_amount(trainer)
        await trainer.save()
        processed_count += 1
        
    return {
        "message": f"Bulk payroll processed. Paid: {processed_count}, Skipped (already has entry): {skipped_count}",
        "processed": processed_count,
        "skipped": skipped_count
    }