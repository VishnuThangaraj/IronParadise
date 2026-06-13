def calculate_bmr(weight_kg: float, height_cm: float, age: int, gender: str) -> float:
    """
    Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor equation.
    Male: 10 * weight (kg) + 6.25 * height (cm) - 5 * age (y) + 5
    Female: 10 * weight (kg) + 6.25 * height (cm) - 5 * age (y) - 161
    """
    if weight_kg <= 0 or height_cm <= 0 or age <= 0:
        raise ValueError("Weight, height, and age must be greater than zero.")
        
    gender_lower = gender.lower().strip()
    if gender_lower in ["male", "m"]:
        gender_offset = 5
    elif gender_lower in ["female", "f"]:
        gender_offset = -161
    else:
        raise ValueError("Gender must be 'male' or 'female'.")
        
    bmr = (10.0 * weight_kg) + (6.25 * height_cm) - (5.0 * age) + gender_offset
    return round(bmr, 2)
