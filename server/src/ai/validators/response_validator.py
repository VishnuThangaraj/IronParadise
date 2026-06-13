import json
import re
from typing import Dict, Any, Tuple
from src.schemas.fitnessPlanSchemas import DietPlanSchema, WorkoutPlanSchema

def clean_and_parse_json(response_str: str) -> Dict[str, Any]:
    cleaned = response_str.strip()
    # Strip markdown formatting ticks if they are present
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", cleaned)
    if match:
        cleaned = match.group(1).strip()
    return json.loads(cleaned)

def validate_ai_response(response_str: str) -> Tuple[DietPlanSchema, WorkoutPlanSchema]:
    data = clean_and_parse_json(response_str)
    
    diet_data = data.get("diet_plan")
    workout_data = data.get("workout_plan")
    
    if not diet_data or not workout_data:
        raise ValueError("Missing 'diet_plan' or 'workout_plan' in AI response structure")
        
    diet_plan = DietPlanSchema(**diet_data)
    workout_plan = WorkoutPlanSchema(**workout_data)
    
    return diet_plan, workout_plan
