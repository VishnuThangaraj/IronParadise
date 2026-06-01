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
    file_path = os.path.join(os.path.dirname(__file__), "..", "data", "trainer.json")
    with open(file_path, "r") as f:
        trainers = json.load(f)

    for trainer in trainers:
        existing_trainer = await Trainer.find_one(Trainer.email == trainer["email"])
        if existing_trainer:
            continue
        newTrainer = Trainer(**trainer)
        await newTrainer.insert()

    return {
        "message": "Trainers populated successfully"
    }