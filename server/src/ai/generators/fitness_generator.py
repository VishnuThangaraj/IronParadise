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
        
        if not diet_plan.dietary_preference or diet_plan.dietary_preference.strip().lower() in ["none", "null"]:
            diet_plan.dietary_preference = request.dietary_preference
            
        # Resolve relationship
        member_doc = await Member.find_one(Member.memberId == request.memberId)

        # 5. Construct or update document model and save to MongoDB via Beanie
        existing_plan = await FitnessPlan.find_one(FitnessPlan.memberId == request.memberId)
        if existing_plan:
            existing_plan.member = member_doc
            existing_plan.fitness_metrics = metrics
            existing_plan.diet_plan = diet_plan
            existing_plan.workout_plan = workout_plan
            existing_plan.age = request.age
            existing_plan.gender = request.gender
            existing_plan.weight = request.weight
            existing_plan.height = request.height
            existing_plan.activity_level = request.activity_level
            existing_plan.goal = request.goal
            existing_plan.dietary_preference = request.dietary_preference
            await existing_plan.save()
            plan = existing_plan
            logger.info(f"Successfully updated and saved fitness plan {plan.planId} for member {request.memberId}")
        else:
            plan = FitnessPlan(
                memberId=request.memberId,
                member=member_doc,
                fitness_metrics=metrics,
                diet_plan=diet_plan,
                workout_plan=workout_plan,
                age=request.age,
                gender=request.gender,
                weight=request.weight,
                height=request.height,
                activity_level=request.activity_level,
                goal=request.goal,
                dietary_preference=request.dietary_preference
            )
            await plan.insert()
            logger.info(f"Successfully generated and created new fitness plan {plan.planId} for member {request.memberId}")
            
        # 6. Set activePlanType to AI in MemberPlans
        from src.models.MemberPlans import MemberPlans
        member_plans = await MemberPlans.find_one(MemberPlans.memberId == request.memberId)
        if member_plans:
            member_plans.activePlanType = "ai"
            await member_plans.save()
        else:
            new_member_plan = MemberPlans(
                memberId=request.memberId,
                member=member_doc,
                activePlanType="ai"
            )
            await new_member_plan.insert()

        return plan
