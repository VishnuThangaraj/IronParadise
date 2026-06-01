from fastapi import APIRouter, Request, status

from src.models.Trainer import Trainer
from src.schemas.trainerSchemas import TrainerRequest
from src.controllers.authController import get_loggedin_admin
from src.controllers.trainerController import (
    create_trainer,
    fetch_all_trainers,
    fetch_trainer_by_id,
    update_trainer,
    delete_trainer,
    populate_trainer
)   

router = APIRouter(prefix='/trainer', tags=['Trainer'])

@router.post('/create', status_code=status.HTTP_201_CREATED)
async def register_trainer(request: Request, data: TrainerRequest):
    await get_loggedin_admin(request)
    return await create_trainer(data)

@router.get('/all', status_code=status.HTTP_200_OK)
async def get_all_trainers(request: Request):
    await get_loggedin_admin(request)
    return await fetch_all_trainers()

@router.get('/populate', status_code=status.HTTP_201_CREATED)
async def populate_trainers(request: Request):
    await get_loggedin_admin(request)
    return await populate_trainer()

@router.get('/{id}', status_code=status.HTTP_200_OK)
async def get_trainer_by_id(request: Request, id: str):
    await get_loggedin_admin(request)
    return await fetch_trainer_by_id(id)

@router.put('/update/{id}', status_code=status.HTTP_200_OK)
async def update_trainer_by_id(request: Request, id: str, data: TrainerRequest):
    await get_loggedin_admin(request)
    return await update_trainer(id, data)

@router.delete('/delete/{id}', status_code=status.HTTP_200_OK)
async def delete_trainer_by_id(request: Request, id: str):
    await get_loggedin_admin(request)
    return await delete_trainer(id)
