def calculate_tdee(bmr: float, activity_level: str) -> float:
    """
    Calculate Total Daily Energy Expenditure (TDEE).
    Activity multipliers:
    - sedentary: 1.2
    - lightly_active: 1.375
    - moderately_active: 1.55
    - very_active: 1.725
    - extra_active: 1.9
    """
    multipliers = {
        "sedentary": 1.2,
        "lightly_active": 1.375,
        "moderately_active": 1.55,
        "very_active": 1.725,
        "extra_active": 1.9
    }
    
    key = activity_level.lower().strip().replace(" ", "_")
    multiplier = multipliers.get(key)
    if not multiplier:
        raise ValueError(
            f"Invalid activity level: '{activity_level}'. "
            f"Must be one of: {list(multipliers.keys())}"
        )
        
    return round(bmr * multiplier, 2)
