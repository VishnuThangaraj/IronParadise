from fastapi import APIRouter, HTTPException, status, Request
import logging
from src.schemas.fitnessPlanSchemas import FitnessPlanGenerationRequest, FitnessPlanResponse
from src.models.FitnessPlan import FitnessPlan
from src.ai.generators.fitness_generator import FitnessPlanGenerator
from src.controllers.authController import get_loggedin_admin

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/fitness", tags=["Fitness Coach"])

import httpx
from pydantic import ValidationError

@router.post("/generate-plan", response_model=FitnessPlanResponse, status_code=status.HTTP_201_CREATED)
async def generate_plan(request: Request, payload: FitnessPlanGenerationRequest):
    logger.info(f"Received API request to generate fitness plan for member {payload.memberId}")
    await get_loggedin_admin(request)
    try:
        generator = FitnessPlanGenerator()
        plan = await generator.generate_and_save(payload)
        return plan 
    except (ValueError, ValidationError) as e:
        logger.warning(f"Validation or calculation constraint error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except httpx.HTTPError as e:
        logger.error(f"Ollama/HTTP error during plan generation: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="The local AI provider timed out or is currently unavailable. Please verify that Ollama is running."
        )
    except Exception as e:
        logger.error(f"Unexpected error during plan generation: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate fitness plan due to an internal server error."
        )

@router.get("/plan/{memberId}", response_model=FitnessPlanResponse, status_code=status.HTTP_200_OK)
async def get_latest_plan(memberId: str):
    logger.info(f"Retrieving latest fitness plan for member {memberId}")
    try:
        plan = await FitnessPlan.find(FitnessPlan.memberId == memberId, fetch_links=True).sort(-FitnessPlan.createdAt).first_or_none()
        if not plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No fitness plan found for member ID: {memberId}"
            )
        return plan
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching latest plan for member {memberId}: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving the latest fitness plan."
        )

@router.get("/history/{memberId}", response_model=list[FitnessPlanResponse], status_code=status.HTTP_200_OK)
async def get_plan_history(memberId: str):
    logger.info(f"Retrieving fitness plan history for member {memberId}")
    try:
        plans = await FitnessPlan.find(FitnessPlan.memberId == memberId, fetch_links=True).sort(-FitnessPlan.createdAt).to_list()
        return plans
    except Exception as e:
        logger.error(f"Error fetching plan history for member {memberId}: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving the fitness plan history."
        )
