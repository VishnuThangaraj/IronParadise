from typing import Dict, Any

def calculate_macros(
    weight_kg: float, 
    tdee: float, 
    goal: str, 
    dietary_preference: str
) -> Dict[str, Any]:
    """
    Calculate target daily calories and macronutrient distribution.
    Calorie adjustment:
    - lose_weight: -500 kcal
    - gain_muscle: +300 kcal
    - maintain: 0 kcal
    
    Macros split:
    - Protein: 2.0g per kg bodyweight (4 kcal/g)
    - Fat: 25% of target calories (9 kcal/g)
    - Carbs: remaining calories (4 kcal/g)
    """
    goal_lower = goal.lower().strip().replace(" ", "_")
    if goal_lower == "lose_weight":
        calorie_target = tdee - 500.0
    elif goal_lower == "gain_muscle":
        calorie_target = tdee + 300.0
    elif goal_lower == "maintain":
        calorie_target = tdee
    else:
        raise ValueError("Goal must be 'lose_weight', 'gain_muscle', or 'maintain'.")
        
    # Health safeguard: ensure calorie target is not dangerously low (e.g., below 1200 kcal)
    if calorie_target < 1200.0:
        calorie_target = 1200.0
        
    # Protein: 2.0g per kg
    protein_g = weight_kg * 2.0
    protein_kcal = protein_g * 4.0
    
    # Fat: 25% of target calories
    fat_kcal = calorie_target * 0.25
    fat_g = fat_kcal / 9.0
    
    # Carbs: remainder
    carbs_kcal = calorie_target - (protein_kcal + fat_kcal)
    
    # Safeguard if protein + fat calories exceed calorie target (due to low weight/deficit)
    if carbs_kcal < 0:
        # Re-adjust protein to a minimum of 1.6g/kg
        protein_g = weight_kg * 1.6
        protein_kcal = protein_g * 4.0
        carbs_kcal = calorie_target - (protein_kcal + fat_kcal)
        
        # Absolute fallback: 40% carbs, 35% protein, 25% fat
        if carbs_kcal < 0:
            carbs_kcal = calorie_target * 0.40
            protein_kcal = calorie_target * 0.35
            fat_kcal = calorie_target * 0.25
            protein_g = protein_kcal / 4.0
            fat_g = fat_kcal / 9.0
            
    carbs_g = carbs_kcal / 4.0
    
    return {
        "calories": round(calorie_target, 2),
        "protein_g": round(protein_g, 2),
        "carbs_g": round(carbs_g, 2),
        "fat_g": round(fat_g, 2),
        "goal": goal,
        "dietary_preference": dietary_preference
    }
