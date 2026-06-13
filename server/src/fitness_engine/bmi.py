def calculate_bmi(weight_kg: float, height_cm: float) -> float:
    """
    Calculate Body Mass Index (BMI).
    Formula: weight (kg) / (height (m) ** 2)
    """
    if height_cm <= 0 or weight_kg <= 0:
        raise ValueError("Weight and height must be greater than zero.")
    height_m = height_cm / 100.0
    return round(weight_kg / (height_m ** 2), 2)
