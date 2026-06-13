import logging
from src.fitness_engine import calculate_bmi, calculate_bmr, calculate_tdee, calculate_macros
from src.ai.providers.ollama_provider import OllamaProvider
from src.ai.prompts.fitness_prompts import SYSTEM_PROMPT, USER_PROMPT_TEMPLATE
from src.ai.validators.response_validator import validate_ai_response
from src.schemas.fitnessPlanSchemas import (
    FitnessPlanGenerationRequest,
    FitnessMetricsSchema
)
from src.models.FitnessPlan import FitnessPlan
from src.models.Member import Member

logger = logging.getLogger(__name__)

class FitnessPlanGenerator:
    def __init__(self, provider=None):
        self.provider = provider or OllamaProvider()

    async def generate_and_save(self, request: FitnessPlanGenerationRequest) -> FitnessPlan:
        logger.info(f"Generating fitness plan for member: {request.memberId}")
        
        # 1. Deterministic calculations
        bmi = calculate_bmi(request.weight, request.height)
        bmr = calculate_bmr(request.weight, request.height, request.age, request.gender)
        tdee = calculate_tdee(bmr, request.activity_level)
        macros = calculate_macros(request.weight, tdee, request.goal, request.dietary_preference)
        
        metrics = FitnessMetricsSchema(
            bmi=bmi,
            bmr=bmr,
            tdee=tdee,
            calories=macros["calories"],
            protein_g=macros["protein_g"],
            carbs_g=macros["carbs_g"],
            fat_g=macros["fat_g"]
        )
        
        # 2. Prepare user prompt
        prompt = USER_PROMPT_TEMPLATE.format(
            goal=request.goal,
            dietary_preference=request.dietary_preference,
            age=request.age,
            gender=request.gender,
            weight=request.weight,
            height=request.height,
            bmi=bmi,
            calories=metrics.calories,
            protein_g=metrics.protein_g,
            carbs_g=metrics.carbs_g,
            fat_g=metrics.fat_g
        )
        
        # 3. Generate response from provider
        raw_response = await self.provider.generate_plan(prompt, SYSTEM_PROMPT)
        
        # 4. Clean & Validate response
        diet_plan, workout_plan = validate_ai_response(raw_response)
        
        # Resolve relationship
        member_doc = await Member.find_one(Member.memberId == request.memberId)

        # 5. Construct document model and insert in MongoDB via Beanie
        plan = FitnessPlan(
            memberId=request.memberId,
            member=member_doc,
            fitness_metrics=metrics,
            diet_plan=diet_plan,
            workout_plan=workout_plan
        )
        await plan.insert()
        
        logger.info(f"Successfully generated and saved fitness plan {plan.planId} for member {request.memberId}")
        return plan
