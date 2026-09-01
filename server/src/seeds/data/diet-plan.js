export const dietPlans = [
  {
    dietPlanId: "DPL-001",
    planName: "High-Protein Hypertrophy Muscle Builder",
    goal: "Muscle Gain & Hypertrophy",
    description: "Designed for bodybuilders and strength athletes aiming for maximum lean muscle growth with a 500 kcal surplus and 2.2g protein per kg bodyweight.",
    monday: {
      breakfast: [
        { name: "Rolled Oats with Whey Protein & Blueberries", quantity: "100g oats + 1.5 scoops whey + 50g berries", calories: 540, protein: 42, carbs: 68, fat: 10 },
        { name: "Boiled Whole Eggs & Toast", quantity: "3 whole eggs + 2 slices multigrain bread", calories: 380, protein: 24, carbs: 28, fat: 18 }
      ],
      lunch: [
        { name: "Grilled Chicken Breast with Brown Rice", quantity: "220g chicken + 180g cooked brown rice", calories: 580, protein: 52, carbs: 62, fat: 11 },
        { name: "Steamed Broccoli & Olive Oil Dressing", quantity: "150g broccoli + 1 tsp EVOO", calories: 95, protein: 4, carbs: 9, fat: 5 }
      ],
      dinner: [
        { name: "Pan-Seared Salmon Fillet with Sweet Potato", quantity: "200g salmon + 200g baked sweet potato", calories: 610, protein: 44, carbs: 52, fat: 22 },
        { name: "Mixed Garden Salad with Lemon", quantity: "1 bowl fresh lettuce, cucumber, tomatoes", calories: 45, protein: 2, carbs: 8, fat: 1 }
      ],
      snacks: [
        { name: "Greek Yogurt with Honey & Crushed Almonds", quantity: "200g non-fat Greek yogurt + 15g almonds + 1 tsp honey", calories: 280, protein: 23, carbs: 22, fat: 10 },
        { name: "Pre-Workout Banana & Peanut Butter Shake", quantity: "1 large banana + 25g natural PB + 250ml skim milk", calories: 380, protein: 16, carbs: 48, fat: 14 }
      ]
    },
    tuesday: {
      breakfast: [
        { name: "Scrambled Eggs with Spinach & Feta", quantity: "4 whole eggs + 50g baby spinach + 20g feta", calories: 420, protein: 29, carbs: 6, fat: 31 },
        { name: "Toasted Sourdough with Avocado", quantity: "2 slices sourdough + 50g smashed avocado", calories: 310, protein: 8, carbs: 42, fat: 12 }
      ],
      lunch: [
        { name: "Lean Ground Turkey with Basmati Rice", quantity: "200g 93% lean turkey + 200g basmati rice", calories: 590, protein: 46, carbs: 68, fat: 12 },
        { name: "Roasted Asparagus Spears", quantity: "120g asparagus with garlic", calories: 60, protein: 3, carbs: 7, fat: 2 }
      ],
      dinner: [
        { name: "Grilled Sirloin Steak with Roasted Red Potatoes", quantity: "180g lean steak + 180g baby potatoes", calories: 620, protein: 48, carbs: 44, fat: 26 },
        { name: "Sauteed Green Beans with Sesame Oil", quantity: "100g green beans + 1 tsp sesame oil", calories: 80, protein: 3, carbs: 8, fat: 4 }
      ],
      snacks: [
        { name: "Cottage Cheese with Pineapple Chunks", quantity: "200g low-fat cottage cheese + 80g fresh pineapple", calories: 230, protein: 26, carbs: 22, fat: 3 },
        { name: "Post-Workout Mass Gainer Smoothie", quantity: "1 scoop whey + 40g oats + 1 tbsp chia + 300ml milk", calories: 410, protein: 34, carbs: 45, fat: 10 }
      ]
    },
    wednesday: {
      breakfast: [
        { name: "Egg White & Whole Egg Veggie Omelet", quantity: "4 whites + 2 whole eggs + peppers & onions", calories: 320, protein: 30, carbs: 8, fat: 16 },
        { name: "Whole Wheat English Muffin with Honey", quantity: "1 whole muffin + 1 tbsp honey", calories: 220, protein: 6, carbs: 44, fat: 2 }
      ],
      lunch: [
        { name: "Teriyaki Chicken Breast with Quinoa", quantity: "220g chicken + 160g cooked quinoa", calories: 570, protein: 51, carbs: 58, fat: 12 },
        { name: "Steamed Edamame in Pods", quantity: "100g edamame", calories: 120, protein: 11, carbs: 9, fat: 5 }
      ],
      dinner: [
        { name: "Grilled Mahi-Mahi Fillet with Couscous", quantity: "220g fish + 150g whole wheat couscous", calories: 540, protein: 46, carbs: 56, fat: 8 },
        { name: "Zucchini Noodles with Pesto", quantity: "150g zucchini + 1 tbsp basil pesto", calories: 110, protein: 3, carbs: 6, fat: 9 }
      ],
      snacks: [
        { name: "Rice Cakes with Almond Butter & Sliced Banana", quantity: "3 brown rice cakes + 20g almond butter + 1/2 banana", calories: 290, protein: 8, carbs: 42, fat: 11 },
        { name: "Whey Protein Isolate Shake with Skim Milk", quantity: "1.5 scoops whey + 250ml milk", calories: 290, protein: 40, carbs: 14, fat: 4 }
      ]
    },
    thursday: {
      breakfast: [
        { name: "Protein Pancakes with Sugar-Free Maple Syrup", quantity: "3 fluffy oat-whey pancakes + 50g berries", calories: 460, protein: 38, carbs: 56, fat: 8 },
        { name: "Turkey Bacon Strips", quantity: "3 strips lean turkey bacon", calories: 120, protein: 12, carbs: 1, fat: 7 }
      ],
      lunch: [
        { name: "Spiced Chicken Fajita Bowl with Brown Rice", quantity: "200g chicken strips + 150g rice + sautéed peppers", calories: 590, protein: 48, carbs: 64, fat: 14 },
        { name: "Fresh Guacamole with Tomato Salsa", quantity: "50g fresh guac + 2 tbsp salsa", calories: 110, protein: 2, carbs: 8, fat: 9 }
      ],
      dinner: [
        { name: "Baked Cod Loin with Herb Garlic Baby Potatoes", quantity: "220g cod + 200g roasted potatoes", calories: 510, protein: 45, carbs: 52, fat: 9 },
        { name: "Steamed Sugar Snap Peas & Carrots", quantity: "120g mixed veg", calories: 70, protein: 3, carbs: 13, fat: 1 }
      ],
      snacks: [
        { name: "Mixed Raw Nuts & Dried Cranberries", quantity: "30g walnuts/almonds + 15g dried cranberries", calories: 240, protein: 6, carbs: 18, fat: 16 },
        { name: "Casein Protein Pudding", quantity: "1.5 scoops micellar casein + cold water", calories: 180, protein: 36, carbs: 4, fat: 1 }
      ]
    },
    friday: {
      breakfast: [
        { name: "Avocado Egg Toast with Smoked Salmon", quantity: "2 slices whole wheat + 2 poached eggs + 60g salmon", calories: 490, protein: 32, carbs: 34, fat: 24 },
        { name: "Fresh Orange Juice", quantity: "200ml freshly squeezed juice", calories: 90, protein: 2, carbs: 21, fat: 0 }
      ],
      lunch: [
        { name: "Beef Stir-Fry with Egg Noodles", quantity: "180g lean beef strips + 150g noodles + stir-fry veg", calories: 620, protein: 47, carbs: 65, fat: 18 },
        { name: "Sesame Cucumber Salad", quantity: "100g sliced cucumbers + rice vinegar", calories: 40, protein: 1, carbs: 6, fat: 1 }
      ],
      dinner: [
        { name: "BBQ Grilled Chicken Thighs (Skinless) with Quinoa", quantity: "220g chicken thighs + 160g quinoa", calories: 630, protein: 50, carbs: 54, fat: 22 },
        { name: "Roasted Brussels Sprouts with Balsamic", quantity: "120g brussels sprouts + 1 tsp EVOO", calories: 90, protein: 4, carbs: 11, fat: 4 }
      ],
      snacks: [
        { name: "Whole Grain Bagel with Low-Fat Cream Cheese", quantity: "1 bagel + 30g light cream cheese", calories: 310, protein: 12, carbs: 54, fat: 5 },
        { name: "Whey Protein Shake with Creatine", quantity: "1.5 scoops whey + 5g creatine + water", calories: 200, protein: 38, carbs: 3, fat: 2 }
      ]
    },
    saturday: {
      breakfast: [
        { name: "Hearty Breakfast Burrito", quantity: "Large tortilla + 3 scrambled eggs + 50g turkey sausage + salsa", calories: 520, protein: 36, carbs: 42, fat: 22 },
        { name: "Fresh Mixed Berry Bowl", quantity: "100g strawberries & blueberries", calories: 60, protein: 1, carbs: 14, fat: 0 }
      ],
      lunch: [
        { name: "Grilled Chicken Burger on Brioche Bun", quantity: "200g chicken patty + whole grain bun + lettuce & tomato", calories: 580, protein: 48, carbs: 52, fat: 18 },
        { name: "Baked Sweet Potato Fries", quantity: "120g oven-baked fries with paprika", calories: 140, protein: 2, carbs: 28, fat: 2 }
      ],
      dinner: [
        { name: "Steak Medallions with Garlic Mashed Potatoes", quantity: "200g tenderloin steak + 180g mashed potatoes", calories: 640, protein: 52, carbs: 42, fat: 27 },
        { name: "Grilled Green Asparagus with Parmesan", quantity: "100g asparagus + 10g shaved parmesan", calories: 75, protein: 5, carbs: 5, fat: 4 }
      ],
      snacks: [
        { name: "Greek Yogurt with Granola & Chia Seeds", quantity: "200g Greek yogurt + 30g protein granola + 10g chia", calories: 340, protein: 26, carbs: 36, fat: 11 },
        { name: "Apple Slices with Natural Crunchy Peanut Butter", quantity: "1 medium apple + 20g peanut butter", calories: 220, protein: 6, carbs: 28, fat: 10 }
      ]
    },
    sunday: {
      breakfast: [
        { name: "Ultimate Recovery French Toast", quantity: "3 slices brioche dipped in 3 egg whites + 1 whole egg + cinnamon", calories: 480, protein: 28, carbs: 58, fat: 12 },
        { name: "Turkey Sausage Links", quantity: "3 links lean turkey sausage", calories: 140, protein: 16, carbs: 2, fat: 8 }
      ],
      lunch: [
        { name: "Sunday Roast Chicken with Roasted Root Vegetables", quantity: "220g roast chicken + 150g carrots, parsnips & potatoes", calories: 610, protein: 52, carbs: 55, fat: 18 },
        { name: "Tossed Spinach & Arugula Salad", quantity: "80g leafy greens + light vinaigrette", calories: 50, protein: 2, carbs: 4, fat: 3 }
      ],
      dinner: [
        { name: "Tuna Steak with Wild Rice Pilaf", quantity: "200g grilled tuna + 160g wild rice", calories: 540, protein: 54, carbs: 52, fat: 8 },
        { name: "Charred Lemon Broccoli", quantity: "150g broccoli with lemon zest", calories: 70, protein: 4, carbs: 9, fat: 2 }
      ],
      snacks: [
        { name: "High-Protein Chocolate Mug Cake", quantity: "1 scoop chocolate whey + 1 egg + 1 tbsp cocoa + 10g oats", calories: 260, protein: 32, carbs: 14, fat: 7 },
        { name: "Handful of Mixed Almonds and Walnuts", quantity: "30g nuts", calories: 190, protein: 6, carbs: 6, fat: 17 }
      ]
    },
    isActive: true
  },
  {
    dietPlanId: "DPL-002",
    planName: "Rapid Metabolic Fat Shredder",
    goal: "Aggressive Fat Loss",
    description: "A high-protein, calorie-restricted meal plan focused on accelerating fat oxidation while preserving lean muscle mass during aggressive cutting phases.",
    monday: {
      breakfast: [
        { name: "Egg White & Spinach Frittata", quantity: "6 large egg whites + 1 whole egg + 60g spinach", calories: 240, protein: 32, carbs: 4, fat: 7 },
        { name: "Grapefruit Halves", quantity: "1/2 medium pink grapefruit", calories: 50, protein: 1, carbs: 13, fat: 0 }
      ],
      lunch: [
        { name: "Herb-Crusted Grilled Chicken Breast", quantity: "200g chicken breast", calories: 330, protein: 46, carbs: 0, fat: 6 },
        { name: "Huge Leafy Green Salad with Balsamic Vinegar", quantity: "150g romaine, cucumber, cherry tomatoes + 1 tsp EVOO", calories: 85, protein: 2, carbs: 8, fat: 4 },
        { name: "Steamed Green Beans", quantity: "100g steamed beans", calories: 35, protein: 2, carbs: 7, fat: 0 }
      ],
      dinner: [
        { name: "Baked White Fish Fillet (Cod/Tilapia)", quantity: "220g white fish with lemon pepper", calories: 230, protein: 44, carbs: 0, fat: 3 },
        { name: "Sauteed Zucchini & Yellow Squash", quantity: "150g zucchini with garlic spray", calories: 45, protein: 2, carbs: 8, fat: 1 },
        { name: "Steamed Cauliflower Rice", quantity: "120g cauliflower rice", calories: 30, protein: 2, carbs: 5, fat: 0 }
      ],
      snacks: [
        { name: "Whey Protein Isolate Shake in Water", quantity: "1 scoop isolate whey", calories: 120, protein: 27, carbs: 2, fat: 1 },
        { name: "Raw Celery Sticks with Almond Butter", quantity: "4 stalks celery + 10g natural almond butter", calories: 85, protein: 3, carbs: 5, fat: 6 }
      ]
    },
    tuesday: {
      breakfast: [
        { name: "Cinnamon Overnight Chia Oats", quantity: "40g rolled oats + 10g chia seeds + 1 scoop vanilla whey + water", calories: 280, protein: 28, carbs: 32, fat: 6 },
        { name: "Black Coffee with Cinnamon", quantity: "1 cup black coffee", calories: 5, protein: 0, carbs: 1, fat: 0 }
      ],
      lunch: [
        { name: "Tuna Avocado Salad Boat", quantity: "1 canned water-packed tuna (150g) + 40g avocado + mustard", calories: 260, protein: 38, carbs: 4, fat: 10 },
        { name: "Crisp Romaine Lettuce Cups", quantity: "4 large romaine leaves", calories: 20, protein: 1, carbs: 3, fat: 0 }
      ],
      dinner: [
        { name: "Extra-Lean Turkey Mince Lettuce Wraps", quantity: "200g 98% lean turkey mince with chili spices", calories: 260, protein: 48, carbs: 2, fat: 4 },
        { name: "Stir-Fried Bell Peppers & Mushrooms", quantity: "120g mixed peppers & button mushrooms", calories: 55, protein: 3, carbs: 9, fat: 1 }
      ],
      snacks: [
        { name: "Low-Fat Greek Yogurt with Cinnamon", quantity: "170g 0% Greek yogurt", calories: 100, protein: 18, carbs: 6, fat: 0 },
        { name: "Cucumber Slices with Sea Salt", quantity: "100g cucumbers", calories: 15, protein: 1, carbs: 3, fat: 0 }
      ]
    },
    wednesday: {
      breakfast: [
        { name: "Boiled Eggs and Sliced Tomatoes", quantity: "4 egg whites + 1 whole egg + 1 sliced tomato", calories: 210, protein: 24, carbs: 6, fat: 6 },
        { name: "Warm Lemon Ginger Water", quantity: "300ml water + lemon juice", calories: 10, protein: 0, carbs: 2, fat: 0 }
      ],
      lunch: [
        { name: "Grilled Chicken Breast with Steamed Asparagus", quantity: "200g chicken + 150g asparagus", calories: 350, protein: 48, carbs: 8, fat: 6 },
        { name: "Cauliflower Mash with Chives", quantity: "120g pureed cauliflower", calories: 40, protein: 2, carbs: 6, fat: 1 }
      ],
      dinner: [
        { name: "Pan-Seared Jumbo Shrimp with Garlic & Herbs", quantity: "220g peeled shrimp + lemon juice", calories: 220, protein: 42, carbs: 2, fat: 3 },
        { name: "Steamed Broccoli Florets", quantity: "150g steamed broccoli", calories: 50, protein: 4, carbs: 9, fat: 1 }
      ],
      snacks: [
        { name: "Whey Protein Shake with Ice", quantity: "1.25 scoops whey isolate", calories: 150, protein: 33, carbs: 2, fat: 1 },
        { name: "Raw Walnuts", quantity: "15g walnuts", calories: 100, protein: 2, carbs: 2, fat: 10 }
      ]
    },
    thursday: {
      breakfast: [
        { name: "Green Power Spinach Egg Scramble", quantity: "5 egg whites + 1 whole egg + 80g baby spinach + mushrooms", calories: 220, protein: 28, carbs: 5, fat: 6 },
        { name: "Fresh Black Coffee", quantity: "1 mug fresh brew", calories: 5, protein: 0, carbs: 1, fat: 0 }
      ],
      lunch: [
        { name: "Grilled Lean Flank Steak Salad", quantity: "160g flank steak + 150g mixed greens + balsamic glaze", calories: 360, protein: 38, carbs: 7, fat: 16 },
        { name: "Grilled Summer Squash", quantity: "100g grilled yellow squash", calories: 30, protein: 1, carbs: 5, fat: 0 }
      ],
      dinner: [
        { name: "Baked Herb Chicken Tenderloins", quantity: "200g chicken breast tenders", calories: 310, protein: 46, carbs: 0, fat: 5 },
        { name: "Roasted Kale Chips with Sea Salt", quantity: "60g baked kale + olive spray", calories: 60, protein: 3, carbs: 6, fat: 2 }
      ],
      snacks: [
        { name: "Cottage Cheese with Cucumber Cubes", quantity: "150g fat-free cottage cheese + cucumber", calories: 125, protein: 22, carbs: 6, fat: 1 },
        { name: "Green Apple Slices", quantity: "1/2 medium green apple", calories: 45, protein: 0, carbs: 11, fat: 0 }
      ]
    },
    friday: {
      breakfast: [
        { name: "Micellar Casein Berry Bowl", quantity: "1 scoop chocolate casein + 40g crushed raspberries", calories: 160, protein: 26, carbs: 8, fat: 2 },
        { name: "Boiled Egg Whites", quantity: "4 boiled egg whites with black pepper", calories: 70, protein: 15, carbs: 1, fat: 0 }
      ],
      lunch: [
        { name: "Lemon Herb Grilled Salmon Fillet", quantity: "160g wild salmon fillet", calories: 320, protein: 34, carbs: 0, fat: 18 },
        { name: "Steamed Bok Choy with Garlic & Ginger", quantity: "120g bok choy", calories: 35, protein: 2, carbs: 4, fat: 1 }
      ],
      dinner: [
        { name: "Pan-Roasted Turkey Breast Slices", quantity: "200g turkey breast + rosemary", calories: 270, protein: 48, carbs: 1, fat: 4 },
        { name: "Grilled Asparagus & Roasted Mushrooms", quantity: "140g mixed vegetables", calories: 60, protein: 4, carbs: 8, fat: 1 }
      ],
      snacks: [
        { name: "Whey Isolate Protein Shake", quantity: "1 scoop whey isolate in cold water", calories: 120, protein: 27, carbs: 2, fat: 1 },
        { name: "Raw Pumpkin Seeds", quantity: "15g raw pepitas", calories: 85, protein: 4, carbs: 2, fat: 7 }
      ]
    },
    saturday: {
      breakfast: [
        { name: "Poached Eggs on Portobello Caps", quantity: "3 poached eggs + 2 grilled portobello mushroom caps", calories: 260, protein: 24, carbs: 6, fat: 15 },
        { name: "Iced Black Cold Brew", quantity: "1 tall cold brew coffee", calories: 5, protein: 0, carbs: 1, fat: 0 }
      ],
      lunch: [
        { name: "Cajun Blackened Chicken Salad", quantity: "200g Cajun chicken + shredded cabbage & mixed greens", calories: 340, protein: 46, carbs: 8, fat: 6 },
        { name: "Apple Cider Vinaigrette Dressing", quantity: "1 tbsp ACV + 1 tsp EVOO", calories: 45, protein: 0, carbs: 1, fat: 5 }
      ],
      dinner: [
        { name: "Baked Lemon Pepper Halibut", quantity: "200g halibut fillet", calories: 260, protein: 42, carbs: 0, fat: 6 },
        { name: "Steamed Asparagus Spears with Lemon", quantity: "120g asparagus", calories: 35, protein: 3, carbs: 5, fat: 0 }
      ],
      snacks: [
        { name: "Non-Fat Greek Yogurt with Cinnamon", quantity: "180g Greek yogurt", calories: 110, protein: 20, carbs: 6, fat: 0 },
        { name: "Sliced Celery with Sea Salt & Lemon", quantity: "100g celery", calories: 15, protein: 1, carbs: 3, fat: 0 }
      ]
    },
    sunday: {
      breakfast: [
        { name: "Egg Whites & Turkey Ham Scramble", quantity: "5 egg whites + 50g diced lean turkey ham", calories: 200, protein: 30, carbs: 2, fat: 4 },
        { name: "Fresh Tomato & Basil Salad", quantity: "100g ripe tomatoes + fresh basil", calories: 30, protein: 1, carbs: 6, fat: 0 }
      ],
      lunch: [
        { name: "Grilled Sirloin Strips with Steamed Broccoli", quantity: "160g sirloin + 150g broccoli", calories: 380, protein: 42, carbs: 9, fat: 16 },
        { name: "Mixed Greens with Lemon Squeeze", quantity: "80g spring mix", calories: 20, protein: 1, carbs: 3, fat: 0 }
      ],
      dinner: [
        { name: "Oven-Baked Lemon Herb Cod", quantity: "220g Atlantic cod", calories: 220, protein: 44, carbs: 0, fat: 2 },
        { name: "Roasted Zucchini Rounds & Red Peppers", quantity: "140g roasted veg", calories: 50, protein: 2, carbs: 9, fat: 1 }
      ],
      snacks: [
        { name: "Isolate Whey Protein Shake", quantity: "1 scoop isolate whey + ice water", calories: 120, protein: 27, carbs: 2, fat: 1 },
        { name: "Brazil Nuts", quantity: "2 whole Brazil nuts for selenium", calories: 65, protein: 1, carbs: 1, fat: 6 }
      ]
    },
    isActive: true
  },
  {
    dietPlanId: "DPL-003",
    planName: "Pure Vegetarian High-Protein Bulking",
    goal: "Clean Bulking (Vegetarian)",
    description: "A 100% lacto-vegetarian mass-building plan utilizing paneer, lentils, chickpeas, soy chunks, Greek yogurt, and protein supplements to achieve high protein without meat.",
    monday: {
      breakfast: [
        { name: "Paneer & Oats Protein Porridge", quantity: "80g rolled oats + 100g grated paneer + 1 scoop whey + 250ml milk", calories: 560, protein: 42, carbs: 58, fat: 18 },
        { name: "Banana with Honey & Flaxseed", quantity: "1 medium banana + 10g ground flaxseed + 1 tsp honey", calories: 160, protein: 3, carbs: 34, fat: 4 }
      ],
      lunch: [
        { name: "Soya Chunks & Green Pea Pulao", quantity: "70g dry soya chunks + 150g brown basmati rice + 50g peas", calories: 540, protein: 44, carbs: 72, fat: 6 },
        { name: "Mixed Vegetable Cucumber Raita", quantity: "150g low-fat curd + diced cucumbers & roasted cumin", calories: 110, protein: 8, carbs: 12, fat: 3 }
      ],
      dinner: [
        { name: "Grilled Tandoori Paneer Tikka with Paratha", quantity: "180g low-fat paneer tikka + 2 whole wheat rotis", calories: 580, protein: 40, carbs: 52, fat: 22 },
        { name: "Yellow Moong Dal Tadka", quantity: "150g cooked moong dal with cumin & turmeric", calories: 180, protein: 12, carbs: 26, fat: 4 }
      ],
      snacks: [
        { name: "Sprouted Moong & Chana Chaat", quantity: "100g boiled sprouts + onions + tomatoes + chaat masala", calories: 180, protein: 12, carbs: 30, fat: 2 },
        { name: "Sattu & Whey Protein Shake", quantity: "30g chana sattu + 1 scoop whey + 250ml milk", calories: 340, protein: 36, carbs: 32, fat: 6 }
      ]
    },
    tuesday: {
      breakfast: [
        { name: "Moong Dal Cheela with Paneer Stuffing", quantity: "2 savory moong crepes + 80g crumbled paneer + mint chutney", calories: 460, protein: 32, carbs: 42, fat: 16 },
        { name: "Almond Milk Chai with Jaggery", quantity: "1 cup spiced chai + 1 tsp jaggery", calories: 70, protein: 1, carbs: 14, fat: 1 }
      ],
      lunch: [
        { name: "Spiced Rajma (Kidney Beans) with Brown Rice", quantity: "200g cooked rajma curry + 180g brown rice", calories: 520, protein: 24, carbs: 88, fat: 7 },
        { name: "Low-Fat Curd with Roasted Cumin", quantity: "150g curd", calories: 90, protein: 7, carbs: 9, fat: 3 }
      ],
      dinner: [
        { name: "Palak Paneer with Multigrain Rotis", quantity: "180g paneer in spinach gravy + 2 multigrain rotis", calories: 560, protein: 38, carbs: 48, fat: 21 },
        { name: "Raw Cucumber, Radish & Beetroot Salad", quantity: "1 bowl fresh garden salad", calories: 45, protein: 2, carbs: 9, fat: 0 }
      ],
      snacks: [
        { name: "Roasted Salted Peanuts & Makhana", quantity: "30g roasted peanuts + 20g fox nuts", calories: 240, protein: 10, carbs: 18, fat: 14 },
        { name: "Whey Protein Shake with Banana", quantity: "1 scoop whey + 1 banana + 200ml soy milk", calories: 310, protein: 32, carbs: 36, fat: 4 }
      ]
    },
    wednesday: {
      breakfast: [
        { name: "Oats & Soya Milk Upma with Cashews", quantity: "80g roasted oats + vegetables + 15g cashews", calories: 420, protein: 18, carbs: 56, fat: 14 },
        { name: "Boiled Soya Chunks Chaat", quantity: "50g dry soya chunks boiled + lemon & green chili", calories: 170, protein: 26, carbs: 14, fat: 1 }
      ],
      lunch: [
        { name: "Chole (Chickpeas) with Whole Wheat Roti", quantity: "200g chickpea curry + 2 tandoori rotis", calories: 530, protein: 22, carbs: 82, fat: 10 },
        { name: "Kachumber Salad", quantity: "Chopped cucumbers, onions, tomatoes with lemon", calories: 35, protein: 1, carbs: 7, fat: 0 }
      ],
      dinner: [
        { name: "High-Protein Soya Bhurji with Rotis", quantity: "60g soya granules + onions + tomatoes + 2 rotis", calories: 480, protein: 38, carbs: 54, fat: 8 },
        { name: "Toor Dal Soup with Ghee Tadka", quantity: "150g dal + 1 tsp A2 cow ghee", calories: 190, protein: 10, carbs: 24, fat: 6 }
      ],
      snacks: [
        { name: "Greek Yogurt with Berries & Walnuts", quantity: "180g Greek yogurt + 40g berries + 15g walnuts", calories: 260, protein: 20, carbs: 18, fat: 12 },
        { name: "Peanut Butter Banana Toast", quantity: "1 slice multigrain bread + 25g peanut butter", calories: 240, protein: 9, carbs: 24, fat: 13 }
      ]
    },
    thursday: {
      breakfast: [
        { name: "Besan & Paneer Protein Toast", quantity: "2 slices whole wheat bread + 80g paneer + gram flour coat", calories: 450, protein: 28, carbs: 44, fat: 15 },
        { name: "Fresh Tender Coconut Water", quantity: "250ml coconut water with pulp", calories: 60, protein: 1, carbs: 14, fat: 0 }
      ],
      lunch: [
        { name: "Paneer Pulao with Black Dal", quantity: "150g paneer pulao + 150g black urad dal curry", calories: 620, protein: 36, carbs: 72, fat: 18 },
        { name: "Boondi & Mint Raita", quantity: "120g yogurt + 15g roasted boondi", calories: 120, protein: 6, carbs: 12, fat: 5 }
      ],
      dinner: [
        { name: "Tofu & Mixed Veggie Stir Fry with Quinoa", quantity: "200g firm tofu + broccoli, bell peppers + 150g quinoa", calories: 520, protein: 34, carbs: 56, fat: 16 },
        { name: "Creamy Tomato Basil Soup", quantity: "150g tomato soup", calories: 85, protein: 2, carbs: 14, fat: 2 }
      ],
      snacks: [
        { name: "Roasted Chana (Bengal Gram)", quantity: "50g roasted salted chana", calories: 180, protein: 11, carbs: 28, fat: 3 },
        { name: "Double Chocolate Whey Protein Shake", quantity: "1.5 scoops whey in 250ml milk", calories: 320, protein: 42, carbs: 16, fat: 6 }
      ]
    },
    friday: {
      breakfast: [
        { name: "Quinoa Upma with Peanuts & Veggies", quantity: "80g quinoa + 20g peanuts + onions, carrots, peas", calories: 440, protein: 16, carbs: 58, fat: 16 },
        { name: "Glass of Warm Haldi (Turmeric) Milk", quantity: "250ml toned milk + turmeric + black pepper", calories: 150, protein: 8, carbs: 12, fat: 6 }
      ],
      lunch: [
        { name: "Lobiya (Black-Eyed Peas) Curry with Rice", quantity: "200g lobiya curry + 180g brown rice", calories: 510, protein: 24, carbs: 84, fat: 6 },
        { name: "Cucumber Beetroot Salad", quantity: "1 bowl fresh salad", calories: 40, protein: 1, carbs: 8, fat: 0 }
      ],
      dinner: [
        { name: "Stir-Fried Paneer & Bell Peppers (Paneer Jalfrezi)", quantity: "180g paneer + bell peppers + 2 rotis", calories: 570, protein: 38, carbs: 48, fat: 22 },
        { name: "Masoor Dal Tadka", quantity: "150g red lentil soup", calories: 170, protein: 11, carbs: 26, fat: 3 }
      ],
      snacks: [
        { name: "Peanut Butter Apple Wedges", quantity: "1 large apple + 30g natural peanut butter", calories: 270, protein: 8, carbs: 34, fat: 14 },
        { name: "Whey Protein Shake with Chia Seeds", quantity: "1 scoop whey + 10g chia seeds in water", calories: 180, protein: 28, carbs: 6, fat: 5 }
      ]
    },
    saturday: {
      breakfast: [
        { name: "Idli Sambar with Soya Chunks Curry", quantity: "3 steamed idlis + 150g sambar + 50g soya chunks", calories: 460, protein: 32, carbs: 70, fat: 5 },
        { name: "Coconut Chutney", quantity: "2 tbsp fresh coconut chutney", calories: 80, protein: 1, carbs: 3, fat: 8 }
      ],
      lunch: [
        { name: "Kadhi Pakora (Low Oil) with Rice", quantity: "200g besan kadhi + 180g jeera rice", calories: 490, protein: 16, carbs: 78, fat: 12 },
        { name: "Kachumber Salad with Lemon", quantity: "1 bowl salad", calories: 35, protein: 1, carbs: 7, fat: 0 }
      ],
      dinner: [
        { name: "Shahi Paneer (Light Gravy) with Rotis", quantity: "180g paneer in cashew-tomato gravy + 2 tandoori rotis", calories: 610, protein: 36, carbs: 56, fat: 24 },
        { name: "Dal Makhani (Low Cream)", quantity: "120g dal makhani", calories: 160, protein: 8, carbs: 20, fat: 6 }
      ],
      snacks: [
        { name: "Roasted Makhana & Almonds Bowl", quantity: "25g makhana + 15g almonds roasted in 1/2 tsp ghee", calories: 210, protein: 6, carbs: 18, fat: 13 },
        { name: "Mass Gainer Smoothie with Peanut Butter", quantity: "1 scoop whey + 1 banana + 20g oats + 20g PB + milk", calories: 420, protein: 34, carbs: 48, fat: 14 }
      ]
    },
    sunday: {
      breakfast: [
        { name: "Paneer Stuffed Paratha with Curd", quantity: "2 whole wheat paneer parathas + 150g curd", calories: 560, protein: 32, carbs: 62, fat: 20 },
        { name: "Fresh Mint Tea with Honey", quantity: "1 cup fresh mint tea", calories: 25, protein: 0, carbs: 6, fat: 0 }
      ],
      lunch: [
        { name: "Soy Keema Matar Biryani", quantity: "70g dry soy granules + 180g basmati rice + peas & spices", calories: 560, protein: 44, carbs: 76, fat: 8 },
        { name: "Pomegranate Onion Raita", quantity: "120g curd + 20g pomegranate seeds", calories: 110, protein: 6, carbs: 14, fat: 3 }
      ],
      dinner: [
        { name: "Grilled Tofu Steaks with Teriyaki Quinoa", quantity: "220g grilled tofu + 150g quinoa + steamed broccoli", calories: 540, protein: 38, carbs: 54, fat: 18 },
        { name: "Cream of Mushroom Soup (Low Fat)", quantity: "150g mushroom soup", calories: 90, protein: 3, carbs: 11, fat: 4 }
      ],
      snacks: [
        { name: "High-Protein Besan Ladoo / Protein Bar", quantity: "1 homemade whey besan bar", calories: 220, protein: 16, carbs: 22, fat: 8 },
        { name: "Whey Protein Shake with Cold Milk", quantity: "1.5 scoops whey + 250ml milk", calories: 310, protein: 42, carbs: 14, fat: 6 }
      ]
    },
    isActive: true
  },
  {
    dietPlanId: "DPL-004",
    planName: "Strict Ketogenic Fat-Adapted Protocol",
    goal: "Ketogenic Fat Loss",
    description: "Ultra-low carbohydrate (<30g net carbs) and high healthy fats (75%) designed to induce nutritional ketosis for steady energy and rapid visceral fat loss.",
    monday: {
      breakfast: [
        { name: "Bacon & Cheddar Scrambled Eggs in Butter", quantity: "3 whole eggs + 30g cheddar + 3 strips bacon in 10g butter", calories: 520, protein: 32, carbs: 2, fat: 42 },
        { name: "Bulletproof Coffee (MCT Oil & Grass-fed Butter)", quantity: "1 cup coffee + 10g MCT oil + 10g butter", calories: 180, protein: 0, carbs: 0, fat: 20 }
      ],
      lunch: [
        { name: "Grilled Chicken Thigh with Skin & Guacamole", quantity: "200g chicken thighs + 60g fresh guacamole", calories: 540, protein: 44, carbs: 6, fat: 36 },
        { name: "Arugula & Walnut Salad with Olive Oil", quantity: "80g arugula + 15g walnuts + 1 tbsp EVOO", calories: 190, protein: 3, carbs: 3, fat: 19 }
      ],
      dinner: [
        { name: "Pan-Fried Salmon with Garlic Herb Butter", quantity: "220g Atlantic salmon + 15g garlic herb butter", calories: 580, protein: 46, carbs: 1, fat: 42 },
        { name: "Sauteed Baby Spinach in Coconut Oil", quantity: "120g spinach + 10g coconut oil", calories: 120, protein: 3, carbs: 3, fat: 11 }
      ],
      snacks: [
        { name: "Macadamia Nuts & String Cheese", quantity: "25g macadamia nuts + 1 mozzarella string cheese", calories: 250, protein: 8, carbs: 4, fat: 23 },
        { name: "Keto Chocolate Collagen Shake", quantity: "1 scoop collagen peptides + 1 tbsp MCT powder in almond milk", calories: 160, protein: 18, carbs: 1, fat: 9 }
      ]
    },
    tuesday: {
      breakfast: [
        { name: "Avocado Baked Eggs with Smoked Bacon Bits", quantity: "1 whole avocado halved + 2 whole eggs baked + bacon bits", calories: 460, protein: 18, carbs: 8, fat: 40 },
        { name: "Black Tea with Heavy Cream", quantity: "1 cup Earl Grey + 2 tbsp heavy whipping cream", calories: 100, protein: 1, carbs: 1, fat: 10 }
      ],
      lunch: [
        { name: "Bunless Bacon Cheddar Burger with Green Salad", quantity: "180g 80/20 ground beef + cheddar + 2 strips bacon + lettuce wrap", calories: 580, protein: 42, carbs: 2, fat: 44 },
        { name: "Creamy Caesar Salad (No Croutons)", quantity: "100g romaine + 2 tbsp real Caesar dressing + parmesan", calories: 160, protein: 4, carbs: 3, fat: 16 }
      ],
      dinner: [
        { name: "Slow-Cooked Pork Carnitas with Avocado Crema", quantity: "200g pork carnitas + 50g sour cream + 30g avocado", calories: 560, protein: 46, carbs: 4, fat: 38 },
        { name: "Roasted Broccoli with Cheddar Melt", quantity: "100g broccoli + 25g melted cheddar", calories: 150, protein: 8, carbs: 5, fat: 11 }
      ],
      snacks: [
        { name: "Cucumbers with Full-Fat Cream Cheese", quantity: "80g cucumber slices + 35g cream cheese", calories: 140, protein: 3, carbs: 4, fat: 13 },
        { name: "Roasted Pecan Halves", quantity: "25g raw pecan halves", calories: 180, protein: 3, carbs: 3, fat: 19 }
      ]
    },
    wednesday: {
      breakfast: [
        { name: "Cheese Omelet with Chorizo Sausage", quantity: "3 eggs + 40g spicy chorizo + 30g Monterey Jack", calories: 510, protein: 34, carbs: 3, fat: 39 },
        { name: "Keto Matcha Green Tea Latte with Coconut Milk", quantity: "Matcha + 150ml unsweetened coconut milk", calories: 90, protein: 1, carbs: 2, fat: 9 }
      ],
      lunch: [
        { name: "Creamy Garlic Tuscan Chicken Breast", quantity: "200g chicken + heavy cream, sundried tomato & spinach sauce", calories: 560, protein: 48, carbs: 6, fat: 36 },
        { name: "Steamed Zucchini Ribbons in Olive Oil", quantity: "120g zucchini + 1 tsp EVOO", calories: 70, protein: 2, carbs: 4, fat: 5 }
      ],
      dinner: [
        { name: "Butter-Basted Ribeye Steak", quantity: "220g ribeye steak basted in rosemary butter", calories: 620, protein: 46, carbs: 0, fat: 48 },
        { name: "Grilled Asparagus Wrapped in Prosciutto", quantity: "80g asparagus + 2 slices prosciutto", calories: 110, protein: 8, carbs: 3, fat: 7 }
      ],
      snacks: [
        { name: "Keto Peanut Butter Fat Bomb", quantity: "2 homemade fat bombs (coconut oil, PB, cocoa)", calories: 210, protein: 5, carbs: 3, fat: 20 },
        { name: "Boiled Eggs with Himalayan Salt", quantity: "2 whole boiled eggs", calories: 140, protein: 12, carbs: 1, fat: 10 }
      ]
    },
    thursday: {
      breakfast: [
        { name: "Smoked Salmon & Cream Cheese Roll-Ups", quantity: "100g smoked salmon + 40g cream cheese + capers", calories: 340, protein: 24, carbs: 2, fat: 26 },
        { name: "Keto Scrambled Eggs in Ghee", quantity: "2 whole eggs + 10g ghee", calories: 220, protein: 12, carbs: 1, fat: 19 }
      ],
      lunch: [
        { name: "Egg & Bacon Salad Lettuce Boats", quantity: "3 hard boiled eggs mashed with 2 tbsp mayo + bacon bits + romaine", calories: 480, protein: 22, carbs: 3, fat: 42 },
        { name: "Kalamata Olives & Feta Cheese", quantity: "40g Greek olives + 30g feta", calories: 160, protein: 5, carbs: 2, fat: 15 }
      ],
      dinner: [
        { name: "Baked Chicken Wings with Garlic Parmesan Sauce", quantity: "6 crispy whole wings + 2 tbsp butter parmesan sauce", calories: 570, protein: 44, carbs: 1, fat: 42 },
        { name: "Celery Sticks with Blue Cheese Dressing", quantity: "80g celery + 2 tbsp blue cheese dip", calories: 160, protein: 2, carbs: 3, fat: 16 }
      ],
      snacks: [
        { name: "Dry Roasted Almonds", quantity: "30g whole almonds", calories: 180, protein: 6, carbs: 5, fat: 15 },
        { name: "Keto Electrolyte Bone Broth with Butter", quantity: "300ml rich bone broth + 10g butter", calories: 130, protein: 9, carbs: 0, fat: 10 }
      ]
    },
    friday: {
      breakfast: [
        { name: "Almond Flour Keto Waffles with Whipped Butter", quantity: "2 keto waffles + 15g butter + sugar-free syrup", calories: 420, protein: 14, carbs: 6, fat: 38 },
        { name: "Pork Sausage Patties", quantity: "2 seasoned sausage patties", calories: 240, protein: 16, carbs: 1, fat: 19 }
      ],
      lunch: [
        { name: "Pan-Fried Trout Fillet in Almond Brown Butter", quantity: "200g trout + 20g crushed almonds + browned butter", calories: 520, protein: 42, carbs: 3, fat: 37 },
        { name: "Sautéed Kale with Garlic & Bacon Drippings", quantity: "100g kale cooked in bacon oil", calories: 120, protein: 3, carbs: 5, fat: 10 }
      ],
      dinner: [
        { name: "Lamb Chops with Mint Butter", quantity: "200g lamb loin chops + fresh herb butter", calories: 590, protein: 44, carbs: 1, fat: 45 },
        { name: "Roasted Cauliflower Gratin with Gruyere Cheese", quantity: "120g cauliflower + 30g gruyere", calories: 170, protein: 9, carbs: 6, fat: 12 }
      ],
      snacks: [
        { name: "Avocado with Olive Oil & Flaky Sea Salt", quantity: "1/2 large avocado + 1 tsp EVOO", calories: 170, protein: 2, carbs: 6, fat: 17 },
        { name: "Cheddar Cheese Crisps", quantity: "25g baked pure cheddar bites", calories: 140, protein: 9, carbs: 1, fat: 11 }
      ]
    },
    saturday: {
      breakfast: [
        { name: "Steak & Eggs Breakfast Platter", quantity: "120g ribeye strip + 3 fried eggs in tallow", calories: 520, protein: 38, carbs: 1, fat: 40 },
        { name: "Black Americano Coffee", quantity: "1 cup black coffee", calories: 5, protein: 0, carbs: 1, fat: 0 }
      ],
      lunch: [
        { name: "Cobb Salad with Chicken, Bacon, Egg & Blue Cheese", quantity: "150g chicken + bacon + egg + 30g blue cheese + ranch", calories: 580, protein: 46, carbs: 5, fat: 41 },
        { name: "Fresh Sliced Radishes in Olive Oil", quantity: "60g radishes + 1 tsp oil", calories: 50, protein: 1, carbs: 2, fat: 5 }
      ],
      dinner: [
        { name: "Slow Cooker Beef Short Ribs", quantity: "220g tender beef ribs with rich pan gravy", calories: 640, protein: 48, carbs: 2, fat: 49 },
        { name: "Steamed Green Asparagus with Hollandaise Sauce", quantity: "100g asparagus + 2 tbsp hollandaise", calories: 180, protein: 3, carbs: 4, fat: 17 }
      ],
      snacks: [
        { name: "Keto Chocolate Avocado Mousse", quantity: "50g avocado + 1 tbsp cocoa + stevia + heavy cream", calories: 190, protein: 3, carbs: 6, fat: 18 },
        { name: "Salted Macadamia Nuts", quantity: "20g macadamia nuts", calories: 150, protein: 2, carbs: 2, fat: 16 }
      ]
    },
    sunday: {
      breakfast: [
        { name: "Keto Breakfast Scramble with Cream Cheese", quantity: "3 eggs + 30g cream cheese + 40g crumbled sausage", calories: 460, protein: 26, carbs: 3, fat: 38 },
        { name: "Bulletproof Black Tea", quantity: "1 cup black tea + 10g grass-fed butter + 5g MCT", calories: 140, protein: 0, carbs: 0, fat: 15 }
      ],
      lunch: [
        { name: "Grilled Lemon Herb Chicken with Bacon Wrapped Asparagus", quantity: "200g chicken + 4 asparagus wrapped in bacon", calories: 510, protein: 52, carbs: 4, fat: 30 },
        { name: "Mixed Greens with Extra Virgin Olive Oil", quantity: "80g salad greens + 1 tbsp EVOO", calories: 140, protein: 1, carbs: 3, fat: 14 }
      ],
      dinner: [
        { name: "Pan-Seared Duck Breast in Fat", quantity: "180g duck breast with crispy skin", calories: 580, protein: 38, carbs: 0, fat: 46 },
        { name: "Braised Red Cabbage in Bacon Fat", quantity: "120g cabbage + 10g bacon drippings", calories: 120, protein: 2, carbs: 8, fat: 9 }
      ],
      snacks: [
        { name: "Gouda Cheese Cubes & Pepperoni Slices", quantity: "30g aged gouda + 25g pepperoni", calories: 240, protein: 14, carbs: 1, fat: 20 },
        { name: "Keto Whey Isolate in Almond Milk", quantity: "1 scoop zero-carb whey + 250ml almond milk", calories: 140, protein: 26, carbs: 1, fat: 3 }
      ]
    },
    isActive: true
  },
  {
    dietPlanId: "DPL-005",
    planName: "100% Plant-Powered Vegan Muscle",
    goal: "Vegan Hypertrophy",
    description: "A nutrient-dense, purely plant-based protocol leveraging tofu, tempeh, seitan, edamame, quinoa, hemp seeds, and pea protein isolate for serious athletic gains.",
    monday: {
      breakfast: [
        { name: "High-Protein Tofu Scramble with Turmeric & Veggies", quantity: "200g firm tofu mashed + nutritional yeast + peppers & onions", calories: 340, protein: 32, carbs: 14, fat: 16 },
        { name: "Sprouted Grain Toast with Smashed Avocado", quantity: "2 slices Ezekiel bread + 40g avocado", calories: 260, protein: 11, carbs: 32, fat: 10 }
      ],
      lunch: [
        { name: "Grilled Tempeh & Quinoa Power Bowl", quantity: "180g marinated tempeh + 160g cooked quinoa + steamed kale", calories: 560, protein: 42, carbs: 62, fat: 18 },
        { name: "Tahini Lemon Garlic Dressing", quantity: "1.5 tbsp pure sesame tahini + lemon juice", calories: 135, protein: 4, carbs: 4, fat: 12 }
      ],
      dinner: [
        { name: "High-Protein Seitan Stir-Fry with Brown Rice", quantity: "180g vital wheat gluten seitan + 150g brown rice + broccoli & snap peas", calories: 580, protein: 56, carbs: 68, fat: 8 },
        { name: "Sesame Cucumber Edamame Salad", quantity: "80g shelled edamame + cucumbers + 1 tsp sesame seeds", calories: 140, protein: 11, carbs: 8, fat: 6 }
      ],
      snacks: [
        { name: "Vegan Pea & Rice Protein Shake with Banana", quantity: "1.5 scoops organic vegan protein + 1 banana + 250ml soy milk", calories: 350, protein: 38, carbs: 38, fat: 5 },
        { name: "Chia Seed Pudding with Almond Butter", quantity: "20g chia seeds + unsweetened almond milk + 15g almond butter", calories: 210, protein: 7, carbs: 14, fat: 14 }
      ]
    },
    tuesday: {
      breakfast: [
        { name: "Superseed Oatmeal with Plant Protein", quantity: "80g rolled oats + 1 scoop pea protein + 15g hemp hearts + berries", calories: 510, protein: 38, carbs: 62, fat: 12 },
        { name: "Soy Milk Latte", quantity: "200ml organic soy milk + espresso", calories: 90, protein: 7, carbs: 5, fat: 4 }
      ],
      lunch: [
        { name: "Lentil & Chickpea Protein Bowl with Tahini", quantity: "150g cooked green lentils + 120g chickpeas + roasted sweet potato", calories: 540, protein: 28, carbs: 86, fat: 9 },
        { name: "Steamed Broccoli & Nutritional Yeast", quantity: "120g broccoli + 10g nutritional yeast", calories: 80, protein: 8, carbs: 9, fat: 1 }
      ],
      dinner: [
        { name: "Smoked Tofu Steaks with Wild Rice & Asparagus", quantity: "220g organic firm tofu + 150g wild rice + asparagus", calories: 520, protein: 38, carbs: 54, fat: 16 },
        { name: "Mixed Arugula Salad with Walnuts", quantity: "60g arugula + 15g walnuts + balsamic vinaigrette", calories: 140, protein: 3, carbs: 4, fat: 13 }
      ],
      snacks: [
        { name: "Roasted Edamame Beans (Dry)", quantity: "45g crunchy dry roasted edamame", calories: 190, protein: 20, carbs: 12, fat: 6 },
        { name: "Apple Wedges with Natural Peanut Butter", quantity: "1 crisp apple + 25g peanut butter", calories: 240, protein: 7, carbs: 28, fat: 12 }
      ]
    },
    wednesday: {
      breakfast: [
        { name: "Buckwheat Protein Pancakes with Maple Syrup", quantity: "3 buckwheat pancakes + 1 scoop vegan protein powder + blueberries", calories: 480, protein: 34, carbs: 68, fat: 8 },
        { name: "Fresh Squeezed Orange Juice", quantity: "180ml juice", calories: 80, protein: 1, carbs: 19, fat: 0 }
      ],
      lunch: [
        { name: "Spicy Black Bean & Seitan Burrito Bowl", quantity: "140g seitan + 120g black beans + 140g brown rice + salsa", calories: 580, protein: 52, carbs: 74, fat: 7 },
        { name: "Fresh Guacamole & Cilantro", quantity: "40g homemade guacamole", calories: 90, protein: 1, carbs: 4, fat: 8 }
      ],
      dinner: [
        { name: "Red Lentil Dahl with Rotis", quantity: "220g thick red lentil curry + 2 whole wheat rotis", calories: 530, protein: 26, carbs: 88, fat: 8 },
        { name: "Cabbage & Carrot Slaw with Lemon Vinaigrette", quantity: "100g shredded slaw", calories: 60, protein: 2, carbs: 9, fat: 2 }
      ],
      snacks: [
        { name: "Vegan Protein Bar", quantity: "1 whole plant-based protein bar", calories: 230, protein: 20, carbs: 24, fat: 7 },
        { name: "Hemp Seed Banana Smoothie", quantity: "1 banana + 20g hemp seeds + 250ml oat milk", calories: 280, protein: 11, carbs: 42, fat: 8 }
      ]
    },
    thursday: {
      breakfast: [
        { name: "Acai Protein Smoothie Bowl with Granola", quantity: "100g frozen acai + 1 scoop vegan vanilla protein + 30g granola + chia", calories: 460, protein: 32, carbs: 58, fat: 12 },
        { name: "Matcha Tea with Soy Milk", quantity: "1 cup matcha + 100ml soy milk", calories: 60, protein: 4, carbs: 4, fat: 2 }
      ],
      lunch: [
        { name: "Crispy Air-Fried Tempeh with Teriyaki Noodles", quantity: "180g tempeh + 150g buckwheat soba noodles + bok choy", calories: 560, protein: 44, carbs: 62, fat: 16 },
        { name: "Steamed Edamame in Pods", quantity: "100g edamame", calories: 120, protein: 11, carbs: 9, fat: 5 }
      ],
      dinner: [
        { name: "Stuffed Bell Peppers with Tofu, Quinoa & Black Beans", quantity: "2 large bell peppers + 150g tofu-quinoa-bean stuffing", calories: 490, protein: 32, carbs: 64, fat: 12 },
        { name: "Fresh Garden Salad with Pumpkin Seeds", quantity: "80g mixed greens + 15g pepitas", calories: 130, protein: 6, carbs: 6, fat: 9 }
      ],
      snacks: [
        { name: "Hummus with Carrot & Cucumber Sticks", quantity: "60g roasted red pepper hummus + baby carrots", calories: 170, protein: 6, carbs: 18, fat: 9 },
        { name: "Chocolate Pea Protein Shake with Almond Butter", quantity: "1.5 scoops pea protein + 15g almond butter + water", calories: 270, protein: 38, carbs: 6, fat: 11 }
      ]
    },
    friday: {
      breakfast: [
        { name: "Chickpea Flour Veggie Omelet (Socca)", quantity: "70g chickpea flour crepe with mushrooms, tomatoes & spinach", calories: 380, protein: 20, carbs: 52, fat: 10 },
        { name: "Soy Yogurt with Fresh Berries", quantity: "150g unsweetened soy yogurt + 50g blackberries", calories: 130, protein: 9, carbs: 12, fat: 4 }
      ],
      lunch: [
        { name: "BBQ Pulled Jackfruit & Seitan Sandwich", quantity: "150g seitan + 80g jackfruit on whole grain bun", calories: 540, protein: 48, carbs: 64, fat: 8 },
        { name: "Baked Sweet Potato Wedges", quantity: "140g oven wedges with smoked paprika", calories: 130, protein: 2, carbs: 28, fat: 1 }
      ],
      dinner: [
        { name: "Vegan Thai Green Curry with Tofu & Jasmine Rice", quantity: "200g extra firm tofu + zucchini, bamboo shoots in light coconut milk + 150g rice", calories: 570, protein: 36, carbs: 66, fat: 18 },
        { name: "Cucumber Herb Salad", quantity: "100g sliced cucumbers with lime juice", calories: 30, protein: 1, carbs: 6, fat: 0 }
      ],
      snacks: [
        { name: "Trail Mix with Soy Crisps & Dried Fruit", quantity: "30g roasted soy nuts + 15g raisins", calories: 200, protein: 14, carbs: 20, fat: 7 },
        { name: "Vegan Protein Shake with Flaxseed", quantity: "1 scoop plant protein + 10g flaxseed + 250ml almond milk", calories: 210, protein: 28, carbs: 8, fat: 7 }
      ]
    },
    saturday: {
      breakfast: [
        { name: "Peanut Butter Banana Toast with Hemp Hearts", quantity: "2 slices sprouted bread + 30g peanut butter + 1 banana + 10g hemp", calories: 490, protein: 21, carbs: 58, fat: 20 },
        { name: "Cold Brew with Oat Milk", quantity: "1 glass cold brew + 50ml oat milk", calories: 40, protein: 1, carbs: 6, fat: 1 }
      ],
      lunch: [
        { name: "Mediterranean Falafel & Lentil Tabbouleh Bowl", quantity: "4 baked falafels + 140g brown lentils + parsley, cucumber, tomato tabbouleh", calories: 560, protein: 28, carbs: 78, fat: 16 },
        { name: "Tahini Garlic Sauce", quantity: "1.5 tbsp tahini with garlic", calories: 135, protein: 4, carbs: 4, fat: 12 }
      ],
      dinner: [
        { name: "Pan-Seared Seitan Steaks with Garlic Herb Mashed Potatoes", quantity: "180g seitan + 180g mashed potatoes with oat milk", calories: 570, protein: 56, carbs: 58, fat: 8 },
        { name: "Steamed Green Asparagus with Lemon", quantity: "120g asparagus", calories: 40, protein: 3, carbs: 6, fat: 0 }
      ],
      snacks: [
        { name: "Spicy Roasted Chickpeas (Crunchy)", quantity: "50g roasted seasoned chickpeas", calories: 190, protein: 9, carbs: 28, fat: 5 },
        { name: "Berry Vegan Protein Smoothie", quantity: "1.5 scoops pea-rice protein + 80g mixed berries + water", calories: 210, protein: 36, carbs: 14, fat: 2 }
      ]
    },
    sunday: {
      breakfast: [
        { name: "Vegan Big Breakfast Hash", quantity: "150g crumbled tempeh + diced baby potatoes + peppers, spinach & nutritional yeast", calories: 480, protein: 34, carbs: 52, fat: 16 },
        { name: "Fresh Grapefruit Juice", quantity: "180ml pink grapefruit juice", calories: 75, protein: 1, carbs: 18, fat: 0 }
      ],
      lunch: [
        { name: "Hearty Tuscan White Bean & Tomato Stew with Quinoa", quantity: "200g cannellini beans + rich tomato herb stew + 140g quinoa", calories: 520, protein: 26, carbs: 84, fat: 8 },
        { name: "Arugula & Shaved Almond Salad", quantity: "60g arugula + 10g sliced almonds + lemon dressing", calories: 95, protein: 3, carbs: 3, fat: 8 }
      ],
      dinner: [
        { name: "Grilled Tofu & Mushroom Skewers with Wild Rice", quantity: "220g marinated tofu + portobello mushrooms + 150g wild rice", calories: 510, protein: 36, carbs: 54, fat: 16 },
        { name: "Steamed Baby Broccoli with Sesame Dressing", quantity: "120g broccolini + 1 tsp sesame oil", calories: 75, protein: 4, carbs: 6, fat: 4 }
      ],
      snacks: [
        { name: "Vegan Chocolate Peanut Butter Mug Cake", quantity: "1 scoop chocolate vegan protein + 15g PB + 2 tbsp oat flour", calories: 260, protein: 26, carbs: 18, fat: 9 },
        { name: "Raw Walnuts & Pumpkin Seeds", quantity: "25g mixed nuts and seeds", calories: 160, protein: 6, carbs: 4, fat: 14 }
      ]
    },
    isActive: true
  }
];

// Reusable standard meal days generator for the remaining plans (DPL-006 to DPL-030)
const planConfigs = [
  { id: "DPL-006", name: "Clean Lean Body Recomposition Protocol", goal: "Body Recomposition", desc: "Designed for intermediate lifters aiming to simultaneously lose stubborn fat while building dense muscle at isocaloric maintenance with 2.4g protein/kg.", active: true },
  { id: "DPL-007", name: "Powerlifter Heavy Strength & Peak Mass", goal: "Powerlifting Strength Surplus", desc: "Heavy caloric surplus formulated for competitive strength athletes requiring sustained glycogen replenishment and rapid central nervous system recovery.", active: true },
  { id: "DPL-008", name: "16/8 Intermittent Fasting Lean Shred", goal: "Intermittent Fasting Cut", desc: "Time-restricted feeding (12 PM to 8 PM eating window) optimized for growth hormone elevation, autophagy, and simplified calorie control during fat loss.", active: true },
  { id: "DPL-009", name: "Diabetic-Friendly Low-Glycemic Fuel", goal: "Blood Sugar & Insulin Optimization", desc: "Structured with low-GI complex carbohydrates, high dietary fiber, and healthy omega fats to minimize insulin spikes while fueling consistent gym performance.", active: true },
  { id: "DPL-010", name: "Pescatarian Omega-Rich Muscle Performance", goal: "Pescatarian Hypertrophy", desc: "Rich in wild-caught salmon, tuna, shrimp, eggs, and whole grains, emphasizing EPA/DHA omega-3 fatty acids for joint recovery and lean mass growth.", active: true },
  { id: "DPL-011", name: "Ectomorph Hardgainer 4000 Calorie Mass Surplus", goal: "Hardgainer Mass Surplus", desc: "Calorie-dense, easy-to-digest nutrition plan packed with healthy nut butters, oats, whole milk, bananas, and lean meats for fast-metabolism hardgainers.", active: true },
  { id: "DPL-012", name: "Women's Sculpt & Glute Toning Protocol", goal: "Female Toning & Fat Loss", desc: "Tailored for female lifters focusing on lean muscle tone, glute development, and waist slimming with optimal micronutrients like iron, folate, and calcium.", active: true },
  { id: "DPL-013", name: "Mediterranean Longevity & Athletic Vitality", goal: "General Health & Longevity", desc: "Inspired by Mediterranean dietary patterns featuring extra virgin olive oil, avocado, walnuts, fresh fish, and colorful seasonal greens.", active: true },
  { id: "DPL-014", name: "Bodybuilding Contest Prep Single-Digit Shred", goal: "Stage Prep & Extreme Cut", desc: "Strict, measured bodybuilding contest preparation diet with precise macronutrient ratios, zero added sodium/sugar spikes, and lean white meat sources.", active: true },
  { id: "DPL-015", name: "High-Carb Endurance Athlete Marathoner Fuel", goal: "Endurance & Glycogen Loading", desc: "High carbohydrate-to-protein ratio designed for triathletes, marathoners, and rowers needing rapid muscle glycogen reload and hydration balance.", active: true },
  { id: "DPL-016", name: "Desi Indian Vegetarian Fat Loss Diet", goal: "Weight Loss (Indian Vegetarian)", desc: "Traditional Indian cuisine optimized for fat loss using moong dal, soya bean chunks, low-fat paneer, sprouted salads, and roti in controlled portions.", active: true },
  { id: "DPL-017", name: "Paleo Ancestral Whole-Foods Shred", goal: "Paleo Clean Eating & Fat Loss", desc: "100% grain-free, dairy-free, and refined-sugar-free protocol emphasizing grass-fed beef, organic poultry, wild berries, sweet potatoes, and nuts.", active: true },
  { id: "DPL-018", name: "Gluten-Free Athletic Performance Protocol", goal: "Gluten-Free Sports Nutrition", desc: "Fully gluten-free menu featuring jasmine rice, quinoa, potatoes, certified GF oats, lean poultry, and fruits to prevent GI distress and inflammation.", active: true },
  { id: "DPL-019", name: "Masters 40+ Joint & Hormone Optimization", goal: "Longevity & Hormone Support", desc: "Formulated for mature lifters focusing on natural testosterone support, collagen for joint repair, antioxidants, and easily digestible whole foods.", active: true },
  { id: "DPL-020", name: "High-Intensity CrossFit & Hybrid Training Fuel", goal: "CrossFit Work Capacity & Recovery", desc: "Balanced high-glycemic intra/post-workout carbs with high-quality protein to support multi-modal HIIT, Olympic lifting, and metabolic conditioning.", active: true },
  { id: "DPL-021", name: "Sedentary Desk Worker Metabolic Fat Burner", goal: "Low NEAT Fat Loss", desc: "Optimized for individuals working desk jobs with low daily activity, featuring high-satiety fiber, lean proteins, and controlled carbohydrate intake.", active: true },
  { id: "DPL-022", name: "High-Fiber Gut Microbiome & Anti-Bloat Diet", goal: "Digestive Health & Leanness", desc: "High in prebiotic and probiotic whole foods, fermented kefir/kombucha, chia seeds, leafy greens, and legumes to promote optimal gut health and digestion.", active: true },
  { id: "DPL-023", name: "Carb-Cycling Lean Muscle Sculpting", goal: "Carb Cycling Recomposition", desc: "Alternating high-carb training days and low-carb recovery days to maximize workout intensity while burning stubborn fat on off days.", active: true },
  { id: "DPL-024", name: "Endomorph Insulin-Sensitive Fat Burner", goal: "Endomorph Fat Loss", desc: "Specially crafted for carb-sensitive body types with higher healthy fats, moderate lean proteins, and strategic post-workout-only complex carbs.", active: true },
  { id: "DPL-025", name: "Desi Indian Non-Veg Muscle Maximizer", goal: "Muscle Gain (Indian Non-Veg)", desc: "Rich in tandoori chicken, egg bhurji, fish curry with brown rice, mutton mince (keema), and sattu shakes for authentic Indian fitness enthusiasts.", active: true },
  { id: "DPL-026", name: "Eggitarian Muscle Building Power Plan", goal: "Eggitarian Hypertrophy", desc: "High-volume whole egg and egg white combinations paired with paneer, milk, oats, and peanut butter for athletes who consume eggs and dairy but no meat.", active: true },
  { id: "DPL-027", name: "Anti-Inflammatory Fast Recovery Protocol", goal: "Joint Recovery & Injury Rehab", desc: "High in turmeric, ginger, berries, salmon, tart cherry extract, green tea, and leafy greens to accelerate tissue repair and combat chronic inflammation.", active: true },
  { id: "DPL-028", name: "Calisthenics & Gymnastics Relative Strength Shred", goal: "Relative Strength & Low Bodyweight", desc: "Designed for gymnasts and calisthenics athletes requiring maximum power-to-weight ratio, crisp muscle definition, and lightweight agility.", active: true },
  { id: "DPL-029", name: "Raw Plant Living Foods Cleanse (Archived)", goal: "Raw Vegan Cleansing & Detox", desc: "100% uncooked organic living foods, sprouted nuts and seeds, cold-pressed green juices, raw vegetable salads, and soaked whole oats.", active: false },
  { id: "DPL-030", name: "Student Budget High-Protein Muscle Plan (Archived)", goal: "Budget Muscle Bulking", desc: "High-calorie, budget-friendly meal plan utilizing eggs, peanut butter, whole milk, canned tuna, bananas, and bulk brown rice for college lifters.", active: false },
];

function createRealisticDaySchedule(theme, dayNum) {
  const variations = [
    {
      breakfast: [
        { name: "Egg White & Whole Egg Omelet with Sourdough", quantity: "4 whites + 2 whole eggs + 2 slices sourdough", calories: 410, protein: 32, carbs: 36, fat: 14 },
        { name: "Fresh Grapefruit & Green Tea", quantity: "1/2 grapefruit + 1 cup green tea", calories: 50, protein: 1, carbs: 13, fat: 0 }
      ],
      lunch: [
        { name: "Grilled Herb Chicken Breast with Brown Basmati Rice", quantity: "200g chicken breast + 180g cooked brown rice", calories: 530, protein: 48, carbs: 56, fat: 9 },
        { name: "Steamed Asparagus & Garlic Olive Oil", quantity: "120g asparagus + 1 tsp EVOO", calories: 75, protein: 3, carbs: 6, fat: 5 }
      ],
      dinner: [
        { name: "Pan-Seared Atlantic Salmon with Baked Sweet Potato", quantity: "200g salmon fillet + 180g sweet potato", calories: 580, protein: 42, carbs: 48, fat: 20 },
        { name: "Mixed Leafy Greens with Lemon Dressing", quantity: "80g greens + 1 tsp lemon vinaigrette", calories: 40, protein: 1, carbs: 4, fat: 2 }
      ],
      snacks: [
        { name: "Non-Fat Greek Yogurt with Crushed Walnuts & Honey", quantity: "180g Greek yogurt + 15g walnuts + 1 tsp honey", calories: 230, protein: 20, carbs: 18, fat: 9 },
        { name: "Whey Protein Isolate Shake in Water", quantity: "1.5 scoops isolate", calories: 180, protein: 38, carbs: 3, fat: 2 }
      ]
    },
    {
      breakfast: [
        { name: "Rolled Oatmeal with Whey Protein & Berries", quantity: "80g rolled oats + 1 scoop whey + 50g blueberries", calories: 440, protein: 34, carbs: 62, fat: 7 },
        { name: "Hard Boiled Whole Eggs", quantity: "2 eggs", calories: 150, protein: 12, carbs: 1, fat: 10 }
      ],
      lunch: [
        { name: "Lean Ground Turkey with Roasted Sweet Potato Cubes", quantity: "200g 93% lean turkey + 180g sweet potato", calories: 540, protein: 46, carbs: 52, fat: 12 },
        { name: "Steamed Broccoli Florets with Lemon", quantity: "140g broccoli", calories: 45, protein: 4, carbs: 9, fat: 1 }
      ],
      dinner: [
        { name: "Grilled Sirloin Steak with Roasted Baby Red Potatoes", quantity: "180g sirloin + 160g roasted potatoes", calories: 570, protein: 48, carbs: 42, fat: 22 },
        { name: "Sautéed Green Beans with Garlic", quantity: "120g green beans in spray oil", calories: 45, protein: 2, carbs: 8, fat: 1 }
      ],
      snacks: [
        { name: "Low-Fat Cottage Cheese with Pineapple", quantity: "160g cottage cheese + 50g fresh pineapple", calories: 170, protein: 22, carbs: 14, fat: 2 },
        { name: "Rice Cakes with Natural Peanut Butter", quantity: "2 brown rice cakes + 20g natural PB", calories: 190, protein: 6, carbs: 20, fat: 10 }
      ]
    },
    {
      breakfast: [
        { name: "Avocado Egg Toast on Multigrain Bread", quantity: "2 slices multigrain + 2 poached eggs + 40g avocado", calories: 390, protein: 18, carbs: 34, fat: 20 },
        { name: "Glass of Skim Milk / Soy Milk", quantity: "250ml milk", calories: 90, protein: 9, carbs: 12, fat: 0 }
      ],
      lunch: [
        { name: "Teriyaki Chicken Breast with Quinoa", quantity: "220g chicken + 160g quinoa", calories: 550, protein: 50, carbs: 54, fat: 11 },
        { name: "Steamed Edamame in Pods", quantity: "100g edamame", calories: 120, protein: 11, carbs: 9, fat: 5 }
      ],
      dinner: [
        { name: "Baked Halibut / Cod Loin with Wild Rice Pilaf", quantity: "220g white fish + 160g wild rice", calories: 480, protein: 46, carbs: 54, fat: 6 },
        { name: "Charred Lemon Broccolini", quantity: "120g broccolini", calories: 45, protein: 3, carbs: 7, fat: 1 }
      ],
      snacks: [
        { name: "Protein Berry Smoothie", quantity: "1 scoop whey + 80g mixed berries + 200ml almond milk", calories: 210, protein: 28, carbs: 18, fat: 3 },
        { name: "Handful of Raw Almonds", quantity: "25g almonds", calories: 150, protein: 6, carbs: 5, fat: 13 }
      ]
    }
  ];

  return variations[dayNum % variations.length];
}

const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

for (const cfg of planConfigs) {
  const planDays = {};
  daysOfWeek.forEach((dayName, idx) => {
    planDays[dayName] = createRealisticDaySchedule(cfg.name, idx);
  });

  dietPlans.push({
    dietPlanId: cfg.id,
    planName: cfg.name,
    goal: cfg.goal,
    description: cfg.desc,
    monday: planDays.monday,
    tuesday: planDays.tuesday,
    wednesday: planDays.wednesday,
    thursday: planDays.thursday,
    friday: planDays.friday,
    saturday: planDays.saturday,
    sunday: planDays.sunday,
    isActive: cfg.active
  });
}