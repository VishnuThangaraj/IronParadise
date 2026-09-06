/**
 * Workout Plans Seed Data
 * Contains 35 realistic, comprehensive workout plans covering diverse fitness goals,
 * splits, disciplines, and experience levels.
 *
 * Generated adhering to workoutPlanSchema and WorkoutPlan model.
 */

export const workoutPlans = [
  {
    "workoutPlanId": "WPL-001",
    "planName": "Classic 6-Day Push / Pull / Legs (PPL) Hypertrophy",
    "goal": "Hypertrophy & Lean Muscle Mass",
    "description": "The gold standard 6-day Push/Pull/Legs routine targeting maximum muscular development with alternating strength (A) and hypertrophy (B) days. Ideal for intermediate to advanced lifters.",
    "isActive": true,
    "monday": {
      "focus": "Push A - Heavy Chest, Shoulders & Triceps",
      "exercises": [
        {
          "name": "Barbell Flat Bench Press",
          "sets": 4,
          "reps": "6-8 reps",
          "rest": "2-3 min",
          "notes": "Retract scapulae, touch lower sternum, control the descent."
        },
        {
          "name": "Incline Dumbbell Bench Press",
          "sets": 3,
          "reps": "8-10 reps",
          "rest": "90 sec",
          "notes": "Set bench at 30 degrees, achieve full stretch at the bottom."
        },
        {
          "name": "Standing Overhead Barbell Press",
          "sets": 4,
          "reps": "6-8 reps",
          "rest": "2 min",
          "notes": "Brace glutes and core, press directly overhead in a straight bar path."
        },
        {
          "name": "Dumbbell Lateral Raise",
          "sets": 4,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Slight forward torso lean, lead with elbows, control negative."
        },
        {
          "name": "Dips (Weighted if applicable)",
          "sets": 3,
          "reps": "8-12 reps",
          "rest": "90 sec",
          "notes": "Forward torso lean for chest bias, descend until upper arms are parallel."
        },
        {
          "name": "Overhead Rope Tricep Extension",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Flare ropes outwards at full extension, lock elbows in place."
        }
      ]
    },
    "tuesday": {
      "focus": "Pull A - Heavy Back, Rear Delts & Biceps",
      "exercises": [
        {
          "name": "Conventional Barbell Deadlift",
          "sets": 3,
          "reps": "5 reps",
          "rest": "3 min",
          "notes": "Reset breath at the bottom, drive through heels, lock hips out firmly."
        },
        {
          "name": "Weighted Pull-Ups",
          "sets": 4,
          "reps": "6-8 reps",
          "rest": "2 min",
          "notes": "Full dead hang at bottom, drive chest to bar, squeeze lats."
        },
        {
          "name": "Chest-Supported T-Bar Row",
          "sets": 3,
          "reps": "8-10 reps",
          "rest": "90 sec",
          "notes": "Pull towards lower ribcage, pause for 1 second at peak contraction."
        },
        {
          "name": "Face Pulls with External Rotation",
          "sets": 4,
          "reps": "15-20 reps",
          "rest": "60 sec",
          "notes": "Pull to eye level, pull thumbs back to activate rotator cuff."
        },
        {
          "name": "Standing Barbell Bicep Curl",
          "sets": 3,
          "reps": "8-10 reps",
          "rest": "90 sec",
          "notes": "Strict form, avoid swinging torso, squeeze biceps at top."
        },
        {
          "name": "Incline Dumbbell Hammer Curl",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Target brachialis and forearms, keep palms facing inward."
        }
      ]
    },
    "wednesday": {
      "focus": "Legs A - Quad Dominant, Calves & Abdominals",
      "exercises": [
        {
          "name": "Barbell Back Squat",
          "sets": 4,
          "reps": "6-8 reps",
          "rest": "3 min",
          "notes": "Deep breath into belt, break at hips and knees, hit depth below parallel."
        },
        {
          "name": "Leg Press (Foot Placement Mid-Platform)",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "2 min",
          "notes": "Do not lock knees at the top, control eccentric for 3 seconds."
        },
        {
          "name": "Bulgarian Split Squats",
          "sets": 3,
          "reps": "10-12 reps/leg",
          "rest": "90 sec",
          "notes": "Upright posture for quad emphasis, sink front thigh parallel to floor."
        },
        {
          "name": "Leg Extensions",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Hold peak contraction for 1 second, control the weight down."
        },
        {
          "name": "Standing Calf Raise",
          "sets": 4,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Full dorsiflexion stretch at bottom, rise onto big toes."
        },
        {
          "name": "Hanging Leg Raises",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Curl pelvis upward towards ribs, minimize swinging."
        }
      ]
    },
    "thursday": {
      "focus": "Push B - Hypertrophy Chest, Shoulders & Triceps",
      "exercises": [
        {
          "name": "Incline Barbell Bench Press",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "2 min",
          "notes": "Focus on upper clavicular head contraction, strict control."
        },
        {
          "name": "Flat Dumbbell Press",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Deep stretch at bottom, press dumbbells together at apex."
        },
        {
          "name": "Seated Dumbbell Shoulder Press",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "90 sec",
          "notes": "Elbows slightly tucked in scapular plane, press overhead smoothly."
        },
        {
          "name": "Cable Lateral Raises",
          "sets": 4,
          "reps": "12-15 reps/arm",
          "rest": "45 sec",
          "notes": "Constant tension across the entire range of motion."
        },
        {
          "name": "Cable Pec Flyes",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Slight bend in elbows, hug a large barrel motion."
        },
        {
          "name": "EZ-Bar Skull Crushers",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Lower bar behind head to maximize stretch on tricep long head."
        }
      ]
    },
    "friday": {
      "focus": "Pull B - Hypertrophy Back, Traps & Biceps",
      "exercises": [
        {
          "name": "Neutral Grip Lat Pulldown",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Depress scapulae first, drive elbows into back pockets."
        },
        {
          "name": "One-Arm Dumbbell Row",
          "sets": 3,
          "reps": "10-12 reps/arm",
          "rest": "90 sec",
          "notes": "Pull dumbbell in an arc towards hip, stretch forward at bottom."
        },
        {
          "name": "Seated Cable Row (Wide Grip)",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Retract shoulder blades, target rhomboids and middle trapezius."
        },
        {
          "name": "Reverse Pec Deck Fly",
          "sets": 4,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Keep arms relatively straight, focus purely on rear deltoid squeeze."
        },
        {
          "name": "Incline Dumbbell Curl",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Supinate wrists hard at top, keep upper arm perpendicular to floor."
        },
        {
          "name": "Cable Bayesian Bicep Curl",
          "sets": 3,
          "reps": "12-15 reps/arm",
          "rest": "45 sec",
          "notes": "Face away from cable pulley for extreme stretch under tension."
        }
      ]
    },
    "saturday": {
      "focus": "Legs B - Hamstrings, Glutes, Calves & Core",
      "exercises": [
        {
          "name": "Romanian Deadlift (Barbell)",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "2 min",
          "notes": "Hinge backwards at hips, keep bar skimming shins, soft knee bend."
        },
        {
          "name": "Lying Leg Curls",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Dorsiflex ankles, squeeze hamstrings to butt, 2-second negative."
        },
        {
          "name": "Barbell Hip Thrust",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "2 min",
          "notes": "Chin tucked, lock out hips at horizontal, squeeze glutes hard."
        },
        {
          "name": "Walking Dumbbell Lunges",
          "sets": 3,
          "reps": "12 steps/leg",
          "rest": "90 sec",
          "notes": "Take moderate stride length, tap back knee gently to floor."
        },
        {
          "name": "Seated Calf Raise",
          "sets": 4,
          "reps": "15-20 reps",
          "rest": "60 sec",
          "notes": "Isolates the soleus muscle, pause at peak stretch."
        },
        {
          "name": "Abdominal Cable Crunch",
          "sets": 3,
          "reps": "15-20 reps",
          "rest": "60 sec",
          "notes": "Round spine to pull elbows down to thighs, isolate rectus abdominis."
        }
      ]
    },
    "sunday": {
      "focus": "Active Recovery & Joint Decompression",
      "exercises": [
        {
          "name": "Foam Rolling Full Body Sweep",
          "sets": 1,
          "reps": "10-15 mins",
          "rest": "None",
          "notes": "Roll quads, IT bands, lats, and glutes to alleviate trigger points."
        },
        {
          "name": "World's Greatest Stretch & Dynamic Flow",
          "sets": 3,
          "reps": "6 reps/side",
          "rest": "30 sec",
          "notes": "Open hips, thoracic spine, and hamstrings with controlled breathing."
        },
        {
          "name": "Zone 2 Incline Treadmill Walk",
          "sets": 1,
          "reps": "25-30 mins",
          "rest": "None",
          "notes": "Maintain conversational heart rate around 120-130 bpm."
        }
      ]
    }
  },
  {
    "workoutPlanId": "WPL-002",
    "planName": "4-Day Upper / Lower Strength & Hypertrophy (PHUL)",
    "goal": "Strength & Hypertrophy Hybrid",
    "description": "Combines Power (heavy low-rep compounds) and Hypertrophy (moderate high-volume work) in a balanced 4-day split, providing ample recovery for consistent progress.",
    "isActive": true,
    "monday": {
      "focus": "Upper Body Power",
      "exercises": [
        {
          "name": "Barbell Flat Bench Press",
          "sets": 4,
          "reps": "3-5 reps",
          "rest": "3 min",
          "notes": "Power style: arch back slightly, plant feet firmly, explode off chest."
        },
        {
          "name": "Bent-Over Barbell Row",
          "sets": 4,
          "reps": "4-6 reps",
          "rest": "2-3 min",
          "notes": "Torso at 45 degrees, pull bar to navel, maintain strict spine."
        },
        {
          "name": "Standing Barbell Overhead Press",
          "sets": 3,
          "reps": "5-6 reps",
          "rest": "2-3 min",
          "notes": "Lock out overhead with head through the window."
        },
        {
          "name": "Weighted Pull-Ups",
          "sets": 3,
          "reps": "5-6 reps",
          "rest": "2 min",
          "notes": "Controlled dead-hang to chin over bar."
        },
        {
          "name": "Heavy Barbell Bicep Curl",
          "sets": 3,
          "reps": "6-8 reps",
          "rest": "90 sec",
          "notes": "Strict form, avoid lower back sway."
        },
        {
          "name": "Close-Grip Barbell Bench Press",
          "sets": 3,
          "reps": "6-8 reps",
          "rest": "90 sec",
          "notes": "Hands shoulder-width apart, elbows tucked to ribs."
        }
      ]
    },
    "tuesday": {
      "focus": "Lower Body Power",
      "exercises": [
        {
          "name": "Barbell Back Squat",
          "sets": 4,
          "reps": "3-5 reps",
          "rest": "3 min",
          "notes": "Brace hard with Valsalva maneuver, drive knees out, hit depth."
        },
        {
          "name": "Conventional Barbell Deadlift",
          "sets": 3,
          "reps": "3-5 reps",
          "rest": "3-4 min",
          "notes": "Pull slack out of the bar before driving floor away."
        },
        {
          "name": "Leg Press",
          "sets": 3,
          "reps": "8-10 reps",
          "rest": "2 min",
          "notes": "Solid foot plant, deep range without pelvic tilting."
        },
        {
          "name": "Standing Calf Overload",
          "sets": 4,
          "reps": "6-8 reps",
          "rest": "90 sec",
          "notes": "Heavy load, 2 second pause at bottom stretch."
        },
        {
          "name": "Hanging Knee-to-Elbows",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Engage core and hip flexors dynamically."
        }
      ]
    },
    "wednesday": {
      "focus": "Active Recovery & Joint Care",
      "exercises": [
        {
          "name": "Dynamic Hip Flexor & Hamstring Stretch",
          "sets": 3,
          "reps": "10 per side",
          "rest": "30 sec",
          "notes": "Deep lunges with torso rotation, active hamstring sweep."
        },
        {
          "name": "Band Pull-Aparts & Dislocates",
          "sets": 3,
          "reps": "20 reps",
          "rest": "30 sec",
          "notes": "Promote shoulder capsule health and thoracic mobility."
        },
        {
          "name": "Light Stationary Cycle Flush",
          "sets": 1,
          "reps": "20 mins",
          "rest": "None",
          "notes": "Flush lactic acid with low resistance cadence."
        }
      ]
    },
    "thursday": {
      "focus": "Upper Body Hypertrophy",
      "exercises": [
        {
          "name": "Incline Dumbbell Press",
          "sets": 4,
          "reps": "8-12 reps",
          "rest": "90 sec",
          "notes": "Tuck elbows at 45 degrees, stretch pecs at bottom."
        },
        {
          "name": "Flat Dumbbell Flyes",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Deep expansion across chest, squeeze gently at top."
        },
        {
          "name": "Seated Cable Row (Close Grip V-Bar)",
          "sets": 4,
          "reps": "8-12 reps",
          "rest": "90 sec",
          "notes": "Pull into lower belly, squeeze scapulae together."
        },
        {
          "name": "Dumbbell Lateral Raises",
          "sets": 4,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Lead with pinkies slightly elevated, strict tempo."
        },
        {
          "name": "Incline Dumbbell Bicep Curl",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Emphasize the long head stretch at the bottom."
        },
        {
          "name": "Tricep Cable Pushdown (V-Bar)",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Pin elbows at sides, full lockout at bottom."
        }
      ]
    },
    "friday": {
      "focus": "Lower Body Hypertrophy",
      "exercises": [
        {
          "name": "Front Squats or Goblet Squats",
          "sets": 3,
          "reps": "8-10 reps",
          "rest": "2 min",
          "notes": "Torso completely upright, elbows high, quad focus."
        },
        {
          "name": "Romanian Deadlift with Dumbbells",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Push hips to wall behind you, feel deep hamstring stretch."
        },
        {
          "name": "Walking Barbell Lunges",
          "sets": 3,
          "reps": "12 steps/leg",
          "rest": "90 sec",
          "notes": "Continuous motion, knee almost touching floor."
        },
        {
          "name": "Seated Leg Curl Machine",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Keep butt anchored to seat, continuous hamstring tension."
        },
        {
          "name": "Seated Calf Raise",
          "sets": 4,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Slow 3 second eccentric on every repetition."
        },
        {
          "name": "Plank with Shoulder Taps",
          "sets": 3,
          "reps": "45 sec",
          "rest": "45 sec",
          "notes": "Maintain neutral pelvis without rocking hips."
        }
      ]
    },
    "saturday": {
      "focus": "Core Stability & Aerobic Conditioning",
      "exercises": [
        {
          "name": "Kettlebell Farmer's Walk",
          "sets": 4,
          "reps": "50 meters",
          "rest": "90 sec",
          "notes": "Heavy kettlebells, tall posture, anti-lateral flexion."
        },
        {
          "name": "Abdominal Wheel Rollouts",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Posterior pelvic tilt, roll out only as far as core holds flat."
        },
        {
          "name": "Rowing Machine Intervals (500m x 4)",
          "sets": 4,
          "reps": "500m",
          "rest": "90 sec",
          "notes": "High intensity cardiovascular and work capacity booster."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Rest & Muscle Recovery",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-003",
    "planName": "3-Day Full Body Novice Strength Foundation",
    "goal": "Foundational Strength & Muscle Building",
    "description": "Built for beginners and novices to master the five fundamental compound barbell lifts with progressive overload 3 days per week, leaving plenty of recovery time.",
    "isActive": true,
    "monday": {
      "focus": "Full Body Workout A (Squat, Bench, Row)",
      "exercises": [
        {
          "name": "Barbell Back Squat",
          "sets": 3,
          "reps": "5 reps",
          "rest": "3 min",
          "notes": "Focus on form: feet shoulder-width, knees track toes, chest upright."
        },
        {
          "name": "Barbell Flat Bench Press",
          "sets": 3,
          "reps": "5 reps",
          "rest": "3 min",
          "notes": "Drive with legs, touch mid-chest, lock out over shoulders."
        },
        {
          "name": "Barbell Pendlay Row",
          "sets": 3,
          "reps": "5 reps",
          "rest": "2 min",
          "notes": "Start from dead-stop on floor each rep, pull explosively to sternum."
        },
        {
          "name": "Dumbbell Overhead Tricep Extension",
          "sets": 2,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Support lower back on bench, deep elbow flexion."
        },
        {
          "name": "Plank Hold",
          "sets": 3,
          "reps": "45-60 sec",
          "rest": "60 sec",
          "notes": "Squeeze glutes, tuck chin, drive elbows into ground."
        }
      ]
    },
    "tuesday": {
      "focus": "Active Recovery & Mobility",
      "exercises": [
        {
          "name": "Brisk Outdoor Walk",
          "sets": 1,
          "reps": "30-40 mins",
          "rest": "None",
          "notes": "Breathe deeply through nose, stimulate circulation and recovery."
        },
        {
          "name": "Couch Stretch for Hip Flexors",
          "sets": 2,
          "reps": "60 sec/side",
          "rest": "30 sec",
          "notes": "Relieve tight hip flexors from squatting and sitting."
        }
      ]
    },
    "wednesday": {
      "focus": "Full Body Workout B (Deadlift, Press, Pull-Up)",
      "exercises": [
        {
          "name": "Conventional Barbell Deadlift",
          "sets": 2,
          "reps": "5 reps",
          "rest": "3-4 min",
          "notes": "Focus on hip hinge, brace lats against the bar, lock knees and hips together."
        },
        {
          "name": "Standing Barbell Overhead Press",
          "sets": 3,
          "reps": "5 reps",
          "rest": "3 min",
          "notes": "Squeeze quads and glutes, push head forward once bar clears forehead."
        },
        {
          "name": "Bodyweight Pull-Ups (or Lat Pulldowns)",
          "sets": 3,
          "reps": "6-8 reps",
          "rest": "2 min",
          "notes": "Full range of motion, avoid kicking or kipping with legs."
        },
        {
          "name": "Barbell Bicep Curl",
          "sets": 2,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Keep elbows pinned to ribcage, squeeze at peak."
        },
        {
          "name": "Hanging Knee Tucks",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Slow descent to avoid swinging motion."
        }
      ]
    },
    "thursday": {
      "focus": "Mobility & Thoracic Flow",
      "exercises": [
        {
          "name": "Cat-Cow & Thoracic Rotations",
          "sets": 3,
          "reps": "10 reps",
          "rest": "30 sec",
          "notes": "Restore spinal articulation and ribcage expansion."
        },
        {
          "name": "Deep Bodyweight Squat Sit",
          "sets": 3,
          "reps": "60 sec",
          "rest": "45 sec",
          "notes": "Pry hips open with elbows inside knees, chest elevated."
        }
      ]
    },
    "friday": {
      "focus": "Full Body Workout C (Squat Volume, Incline Press, RDL)",
      "exercises": [
        {
          "name": "Barbell Back Squat (Light/Technique)",
          "sets": 3,
          "reps": "8 reps",
          "rest": "2 min",
          "notes": "Use 80% of Monday weight, practice crisp acceleration out of the hole."
        },
        {
          "name": "Incline Barbell Bench Press",
          "sets": 3,
          "reps": "8 reps",
          "rest": "2 min",
          "notes": "Focus on upper chest contraction and solid shoulder blade retraction."
        },
        {
          "name": "Romanian Deadlift (Barbell)",
          "sets": 3,
          "reps": "8-10 reps",
          "rest": "2 min",
          "notes": "Feel strong stretch across hamstrings, squeeze glutes at top."
        },
        {
          "name": "Chest-Supported Dumbbell Row",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Eliminates lower back fatigue, maximizes lat activation."
        },
        {
          "name": "Cable Face Pulls",
          "sets": 3,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Rear delt and postural stabilizer work for longevity."
        }
      ]
    },
    "saturday": {
      "focus": "Low-Intensity Cardio & Recovery",
      "exercises": [
        {
          "name": "Light Cycling or Swimming",
          "sets": 1,
          "reps": "25 mins",
          "rest": "None",
          "notes": "Gentle aerobic cross-training to support active recovery."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Rest Day",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-004",
    "planName": "Arnold Golden Era Antagonistic Split (6-Day)",
    "goal": "Maximum Hypertrophy & Aesthetic Proportions",
    "description": "Arnold's legendary antagonist paired split (Chest/Back, Shoulders/Arms, Legs) repeated twice a week. Creates immense blood volume, muscle pumps, and sculpted upper body aesthetics.",
    "isActive": true,
    "monday": {
      "focus": "Chest & Back (Antagonistic Supersets)",
      "exercises": [
        {
          "name": "Barbell Bench Press (Superset 1A)",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "45 sec",
          "notes": "Explode off chest, move directly to wide grip chin-ups."
        },
        {
          "name": "Wide-Grip Chin-Ups (Superset 1B)",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "90 sec",
          "notes": "Pull to upper chest, full lat stretch at bottom."
        },
        {
          "name": "Incline Dumbbell Bench Press (Superset 2A)",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "45 sec",
          "notes": "Palms semi-pronated, deep stretch at clavicle."
        },
        {
          "name": "One-Arm Dumbbell Row (Superset 2B)",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Pull dumbbell toward hip crease, squeeze lats."
        },
        {
          "name": "Dumbbell Flyes (Superset 3A)",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "45 sec",
          "notes": "Arnold style: expand ribcage fully with deep inhalation."
        },
        {
          "name": "Seated Cable Row (Superset 3B)",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "90 sec",
          "notes": "Pull to sternum, squeeze shoulder blades together."
        },
        {
          "name": "Dumbbell Pullover",
          "sets": 3,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Expand serratus and ribcage, hips lowered below bench level."
        }
      ]
    },
    "tuesday": {
      "focus": "Shoulders & Arms (Antagonistic Pump)",
      "exercises": [
        {
          "name": "Standing Barbell Overhead Clean and Press",
          "sets": 4,
          "reps": "6-8 reps",
          "rest": "2 min",
          "notes": "Classic old-school overhead mass builder."
        },
        {
          "name": "Arnold Dumbbell Press",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Rotate wrists from chin level outward as you press overhead."
        },
        {
          "name": "Dumbbell Lateral Raise",
          "sets": 4,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Raise to parallel, pause briefly, control descent."
        },
        {
          "name": "Incline Dumbbell Curl (Superset 1A)",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "45 sec",
          "notes": "Supinate wrists, stretch biceps at bottom."
        },
        {
          "name": "Lying EZ-Bar Skull Crusher (Superset 1B)",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Lower bar toward crown of head, extend through triceps."
        },
        {
          "name": "Concentration Curls (Superset 2A)",
          "sets": 3,
          "reps": "12 reps",
          "rest": "45 sec",
          "notes": "Elbow braced against inner thigh, peak bicep contraction."
        },
        {
          "name": "Rope Tricep Pushdown (Superset 2B)",
          "sets": 3,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Spread ropes wide at bottom lockout."
        }
      ]
    },
    "wednesday": {
      "focus": "Legs, Calves & Abdominals",
      "exercises": [
        {
          "name": "Barbell Back Squat",
          "sets": 5,
          "reps": "8-10 reps",
          "rest": "2-3 min",
          "notes": "High volume leg work, parallel or below on every rep."
        },
        {
          "name": "Straight-Leg Barbell Deadlift",
          "sets": 4,
          "reps": "10 reps",
          "rest": "2 min",
          "notes": "Elevate toes slightly on plates for extreme hamstring stretch."
        },
        {
          "name": "Walking Barbell Lunges",
          "sets": 3,
          "reps": "15 steps/leg",
          "rest": "90 sec",
          "notes": "Continuous stride, builds glutes and quad tear-drops."
        },
        {
          "name": "Leg Curls",
          "sets": 4,
          "reps": "12 reps",
          "rest": "60 sec",
          "notes": "Toes pointed up, full contraction."
        },
        {
          "name": "Donkey Calf Raises or Standing Calf Machine",
          "sets": 5,
          "reps": "15-20 reps",
          "rest": "45 sec",
          "notes": "Deep stretch, rise all the way up onto balls of feet."
        },
        {
          "name": "Roman Chair Hanging Leg Raises",
          "sets": 4,
          "reps": "20 reps",
          "rest": "45 sec",
          "notes": "Bring knees to chest, curl pelvis."
        }
      ]
    },
    "thursday": {
      "focus": "Chest & Back (Hypertrophy & Detail)",
      "exercises": [
        {
          "name": "Incline Barbell Bench Press",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Target upper chest, smooth controlled cadence."
        },
        {
          "name": "Wide-Grip Lat Pulldown Behind Neck / to Chest",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Pull to collarbone, drive elbows down into lats."
        },
        {
          "name": "Dumbbell Bench Press",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Rotate wrists slightly inward at peak contraction."
        },
        {
          "name": "Bent-Over Barbell Row (Underhand Grip)",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "90 sec",
          "notes": "Underhand grip activates lower lats intensely."
        },
        {
          "name": "Cable Crossover Flyes",
          "sets": 3,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Cross hands over at midline for maximum inner chest squeeze."
        },
        {
          "name": "Straight-Arm Cable Pullover",
          "sets": 3,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Isolate lats and teres major without bicep assistance."
        }
      ]
    },
    "friday": {
      "focus": "Shoulders & Arms (High Volume Finish)",
      "exercises": [
        {
          "name": "Seated Behind-the-Neck Barbell Press",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "2 min",
          "notes": "Lower only to ear level, strict shoulder mobility required."
        },
        {
          "name": "Bent-Over Rear Delt Dumbbell Flyes",
          "sets": 4,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Torso parallel to floor, squeeze rear delts at peak."
        },
        {
          "name": "Cable Lateral Raises",
          "sets": 4,
          "reps": "15 reps/arm",
          "rest": "45 sec",
          "notes": "Continuous tension, slight elbow bend."
        },
        {
          "name": "Preacher Curls with EZ-Bar",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Lock armpits over the pad, strict isolation."
        },
        {
          "name": "Parallel Bar Dips (Tricep Focus)",
          "sets": 4,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Keep torso upright to emphasize tricep heads."
        },
        {
          "name": "Barbell Wrist Curls & Reverse Wrist Curls",
          "sets": 3,
          "reps": "20 reps",
          "rest": "45 sec",
          "notes": "Build forearm mass and grip vascularity."
        }
      ]
    },
    "saturday": {
      "focus": "Legs, Hamstrings & Calves Overload",
      "exercises": [
        {
          "name": "Front Squat",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "2 min",
          "notes": "Quads overload, keep chest proud and elbows up."
        },
        {
          "name": "Leg Press (High & Wide Foot Placement)",
          "sets": 4,
          "reps": "12-15 reps",
          "rest": "90 sec",
          "notes": "Hamstring and glute emphasis."
        },
        {
          "name": "Lying Leg Curl",
          "sets": 4,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Continuous tension, no resting at bottom."
        },
        {
          "name": "Seated Calf Raise",
          "sets": 5,
          "reps": "20 reps",
          "rest": "45 sec",
          "notes": "Burn out the soleus muscle."
        },
        {
          "name": "Bicycle Crunches & Incline Sit-Ups",
          "sets": 4,
          "reps": "25 reps",
          "rest": "45 sec",
          "notes": "Tighten midsection and build abdominal density."
        }
      ]
    },
    "sunday": {
      "focus": "Rest, Hydration & Tissue Repair",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-005",
    "planName": "5-Day Classic Bodybuilding Bro Split",
    "goal": "Pure Hypertrophy & Muscle Isolation",
    "description": "The traditional single-bodypart daily breakdown dedicating maximum volume and intensity to one muscle group per session (Chest, Back, Shoulders, Legs, Arms).",
    "isActive": true,
    "monday": {
      "focus": "Chest Annihilation",
      "exercises": [
        {
          "name": "Barbell Flat Bench Press",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "2 min",
          "notes": "Pyramid weight up each set, finish with a 1-set drop set."
        },
        {
          "name": "Incline Dumbbell Bench Press",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Full stretch at bottom, squeeze clavicular fibers at top."
        },
        {
          "name": "Decline Barbell Bench Press",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Target lower sternal pectoralis fibers."
        },
        {
          "name": "Cable Crossovers (High to Low)",
          "sets": 3,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Bring hands together in front of hips, pause for 1 second."
        },
        {
          "name": "Dips to Failure",
          "sets": 3,
          "reps": "Bodyweight AMRAP",
          "rest": "60 sec",
          "notes": "Forward lean, pump blood into pecs until failure."
        }
      ]
    },
    "tuesday": {
      "focus": "Back Thickness & Lat Width",
      "exercises": [
        {
          "name": "Wide-Grip Lat Pulldown",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Drive elbows down and back, feel lats engage."
        },
        {
          "name": "Barbell Bent-Over Row",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "2 min",
          "notes": "Overhand grip, pull to belly button."
        },
        {
          "name": "Seated Close-Grip Cable Row",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Full forward stretch allowing scapulae to protract, then squeeze."
        },
        {
          "name": "One-Arm Dumbbell Row",
          "sets": 3,
          "reps": "12 reps/arm",
          "rest": "60 sec",
          "notes": "Rest non-working knee on bench, pull with elbow."
        },
        {
          "name": "Hyperextensions with Plate Hold",
          "sets": 3,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Strengthen lower back erectors, squeeze glutes at top."
        }
      ]
    },
    "wednesday": {
      "focus": "Shoulders & Trapezius",
      "exercises": [
        {
          "name": "Seated Dumbbell Overhead Press",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "2 min",
          "notes": "Lower dumbbells until level with ear lobes, press overhead."
        },
        {
          "name": "Standing Dumbbell Lateral Raise",
          "sets": 4,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Triple drop set on the final set to torch lateral delts."
        },
        {
          "name": "Barbell Upright Row",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Grip shoulder width apart, lift elbows high, pull to chest level."
        },
        {
          "name": "Face Pulls with Cable Rope",
          "sets": 4,
          "reps": "15-20 reps",
          "rest": "60 sec",
          "notes": "Focus on rear delts and external rotators."
        },
        {
          "name": "Barbell Shrugs",
          "sets": 4,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Straight elevation of shoulders to ears, 2 second squeeze, no rolling."
        }
      ]
    },
    "thursday": {
      "focus": "Legs (Quads, Hamstrings & Calves)",
      "exercises": [
        {
          "name": "Barbell Back Squats",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "2-3 min",
          "notes": "Work up to heavy work sets, explode up out of hole."
        },
        {
          "name": "Leg Press Machine",
          "sets": 4,
          "reps": "12-15 reps",
          "rest": "90 sec",
          "notes": "Continuous tension, feet hip-width apart."
        },
        {
          "name": "Leg Extensions",
          "sets": 4,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Hold peak contraction on each rep for 1 count."
        },
        {
          "name": "Lying Leg Curls",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Controlled negative, keep hips flat against bench."
        },
        {
          "name": "Standing Calf Raises",
          "sets": 5,
          "reps": "15-20 reps",
          "rest": "45 sec",
          "notes": "Deep stretch at bottom, squeeze hard at top."
        }
      ]
    },
    "friday": {
      "focus": "Arms (Biceps & Triceps Super-Pump)",
      "exercises": [
        {
          "name": "Barbell EZ-Curl",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Pyramid up, strict curls with zero body swing."
        },
        {
          "name": "Tricep Skull Crushers",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Keep upper arms perpendicular to torso."
        },
        {
          "name": "Hammer Dumbbell Curls",
          "sets": 3,
          "reps": "12 reps",
          "rest": "60 sec",
          "notes": "Alternate arms, focus on brachioradialis and outer bicep head."
        },
        {
          "name": "Cable Rope Pushdowns",
          "sets": 3,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Lock elbows at sides, pull rope outward at bottom."
        },
        {
          "name": "Preacher Curl Machine",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "45 sec",
          "notes": "Isolate short head of bicep, strict slow negative."
        },
        {
          "name": "Overhead Dumbbell Tricep Extension",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Hold one heavy dumbbell with both hands overhead."
        }
      ]
    },
    "saturday": {
      "focus": "Core, Obliques & Steady Cardio",
      "exercises": [
        {
          "name": "Hanging Leg Raises",
          "sets": 4,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Control the eccentric, avoid using momentum."
        },
        {
          "name": "Cable Woodchoppers",
          "sets": 3,
          "reps": "12 reps/side",
          "rest": "45 sec",
          "notes": "Engage obliques and rotational core strength."
        },
        {
          "name": "Incline Treadmill Walk",
          "sets": 1,
          "reps": "30 mins",
          "rest": "None",
          "notes": "Speed 3.5 mph, 10% incline for cardiovascular endurance."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Rest & Recovery",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-006",
    "planName": "4-Day 5/3/1 Boring But Big (BBB) Powerlifting",
    "goal": "Maximal Strength & Progressive Overload",
    "description": "Jim Wendler's iconic 5/3/1 program paired with the Boring But Big hypertrophy protocol (5 sets of 10 reps at 50-60% of Training Max) for building brute strength and armor-like muscle.",
    "isActive": true,
    "monday": {
      "focus": "Overhead Press 5/3/1 + BBB Volume",
      "exercises": [
        {
          "name": "Standing Military Press 5/3/1 Work Sets",
          "sets": 3,
          "reps": "5, 5, 5+ reps",
          "rest": "3 min",
          "notes": "Final set is AMRAP (As Many Reps As Possible) with technical perfection."
        },
        {
          "name": "Standing Military Press BBB Volume",
          "sets": 5,
          "reps": "10 reps",
          "rest": "90 sec",
          "notes": "Use 50-60% of Training Max. Crisp bar speed and rhythm."
        },
        {
          "name": "Chin-Ups / Lat Pulldowns",
          "sets": 5,
          "reps": "10 reps",
          "rest": "60 sec",
          "notes": "Balance shoulder pressing with vertical lat pulling."
        },
        {
          "name": "Dumbbell Lateral Raises",
          "sets": 4,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Deltoid health and accessory hypertrophy."
        },
        {
          "name": "Ab Wheel Rollout",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Brace anterior core against spinal extension."
        }
      ]
    },
    "tuesday": {
      "focus": "Deadlift 5/3/1 + BBB Volume",
      "exercises": [
        {
          "name": "Conventional Deadlift 5/3/1 Work Sets",
          "sets": 3,
          "reps": "5, 5, 5+ reps",
          "rest": "3-4 min",
          "notes": "Hit the prescription: final set is AMRAP leaving 1-2 reps in tank."
        },
        {
          "name": "Conventional Deadlift BBB Volume",
          "sets": 5,
          "reps": "10 reps",
          "rest": "2 min",
          "notes": "Focus on flawless hinge mechanics and grip endurance."
        },
        {
          "name": "Hanging Leg Raises",
          "sets": 5,
          "reps": "12 reps",
          "rest": "60 sec",
          "notes": "Decompress spine after heavy pulling, strengthen hip flexors and abs."
        },
        {
          "name": "Dumbbell Shrugs",
          "sets": 3,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Upper trap overload, 2-second hold at peak elevation."
        },
        {
          "name": "Back Extensions",
          "sets": 3,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Glute and lower back muscular endurance."
        }
      ]
    },
    "wednesday": {
      "focus": "Active Recovery & Mobility Work",
      "exercises": [
        {
          "name": "Foam Roll Lower Back & Thoracic Spine",
          "sets": 1,
          "reps": "10 mins",
          "rest": "None",
          "notes": "Decompress posterior chain and ease muscular tension."
        },
        {
          "name": "Hip 90/90 Internal & External Rotations",
          "sets": 3,
          "reps": "8 per side",
          "rest": "30 sec",
          "notes": "Improve hip capsule mobility for squat depth."
        },
        {
          "name": "Easy Stationary Bike Spin",
          "sets": 1,
          "reps": "20 mins",
          "rest": "None",
          "notes": "Promote blood flow to legs without fatigue."
        }
      ]
    },
    "thursday": {
      "focus": "Bench Press 5/3/1 + BBB Volume",
      "exercises": [
        {
          "name": "Barbell Bench Press 5/3/1 Work Sets",
          "sets": 3,
          "reps": "5, 5, 5+ reps",
          "rest": "3 min",
          "notes": "Tuck shoulder blades, tight arch, drive with legs, AMRAP final set."
        },
        {
          "name": "Barbell Bench Press BBB Volume",
          "sets": 5,
          "reps": "10 reps",
          "rest": "90 sec",
          "notes": "Controlled 5x10 at 50-60% Training Max."
        },
        {
          "name": "Dumbbell Kroc Rows",
          "sets": 5,
          "reps": "10-12 reps/arm",
          "rest": "90 sec",
          "notes": "Heavy rowing to support scapular stability on bench."
        },
        {
          "name": "Dips",
          "sets": 3,
          "reps": "10-15 reps",
          "rest": "60 sec",
          "notes": "Tricep lockout strength assistance."
        },
        {
          "name": "Face Pulls",
          "sets": 4,
          "reps": "20 reps",
          "rest": "60 sec",
          "notes": "Upper back and external rotator balance."
        }
      ]
    },
    "friday": {
      "focus": "Squat 5/3/1 + BBB Volume",
      "exercises": [
        {
          "name": "Barbell Back Squat 5/3/1 Work Sets",
          "sets": 3,
          "reps": "5, 5, 5+ reps",
          "rest": "3-4 min",
          "notes": "Crush the AMRAP set with aggressive hip drive and solid core brace."
        },
        {
          "name": "Barbell Back Squat BBB Volume",
          "sets": 5,
          "reps": "10 reps",
          "rest": "2 min",
          "notes": "Grueling 5x10 volume for quad and leg hypertrophy."
        },
        {
          "name": "Leg Curls",
          "sets": 5,
          "reps": "12 reps",
          "rest": "60 sec",
          "notes": "Knee flexion balance for hamstring health."
        },
        {
          "name": "Standing Calf Raises",
          "sets": 4,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Full range calf pump."
        },
        {
          "name": "Barbell Rollouts or Heavy Planks",
          "sets": 3,
          "reps": "60 sec",
          "rest": "60 sec",
          "notes": "Core bracing endurance under tension."
        }
      ]
    },
    "saturday": {
      "focus": "Conditioning & Loaded Carries",
      "exercises": [
        {
          "name": "Farmer's Walk (Heavy Trap Bar or Dumbbells)",
          "sets": 5,
          "reps": "40 meters",
          "rest": "90 sec",
          "notes": "Grip, upper back, and core conditioning under heavy load."
        },
        {
          "name": "Prowler Sled Push",
          "sets": 6,
          "reps": "25 meters",
          "rest": "60 sec",
          "notes": "Concentric leg drive and anaerobic conditioning."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Rest Day",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-007",
    "planName": "5-Day Power Hypertrophy Adaptive Training (PHAT)",
    "goal": "Powerlifting & Bodybuilding Dual Adaptation",
    "description": "Dr. Layne Norton's renowned PHAT split. Features 2 power days for building heavy compound strength followed by 3 speed/hypertrophy days targeting maximal muscular size.",
    "isActive": true,
    "monday": {
      "focus": "Upper Body Power",
      "exercises": [
        {
          "name": "Bent-Over Barbell Row",
          "sets": 3,
          "reps": "3-5 reps",
          "rest": "3 min",
          "notes": "Explosive pull off the floor, keep lower back locked."
        },
        {
          "name": "Weighted Pull-Ups",
          "sets": 2,
          "reps": "6-8 reps",
          "rest": "2 min",
          "notes": "Dead hang to sternum over bar."
        },
        {
          "name": "Flat Dumbbell Bench Press",
          "sets": 3,
          "reps": "3-5 reps",
          "rest": "3 min",
          "notes": "Heavy power pressing, strong leg drive."
        },
        {
          "name": "Weighted Dips",
          "sets": 2,
          "reps": "6-8 reps",
          "rest": "2 min",
          "notes": "Controlled descent, powerful tricep/chest lockout."
        },
        {
          "name": "Seated Dumbbell Shoulder Press",
          "sets": 3,
          "reps": "6-8 reps",
          "rest": "2 min",
          "notes": "Strict vertical press, solid base."
        },
        {
          "name": "Cambered Bar Bicep Curl",
          "sets": 3,
          "reps": "6-8 reps",
          "rest": "90 sec",
          "notes": "Heavy bicep overload."
        },
        {
          "name": "Skull Crushers (EZ-Bar)",
          "sets": 3,
          "reps": "6-8 reps",
          "rest": "90 sec",
          "notes": "Heavy tricep extension."
        }
      ]
    },
    "tuesday": {
      "focus": "Lower Body Power",
      "exercises": [
        {
          "name": "Barbell Back Squats",
          "sets": 3,
          "reps": "3-5 reps",
          "rest": "3-4 min",
          "notes": "Heavy technical squats, hit full depth."
        },
        {
          "name": "Hack Squat Machine",
          "sets": 2,
          "reps": "6-8 reps",
          "rest": "2 min",
          "notes": "Quad focused, smooth deceleration."
        },
        {
          "name": "Stiff-Legged Deadlift",
          "sets": 3,
          "reps": "5-8 reps",
          "rest": "2-3 min",
          "notes": "Hamstring and lower back power."
        },
        {
          "name": "Lying Leg Curls",
          "sets": 2,
          "reps": "6-8 reps",
          "rest": "90 sec",
          "notes": "Heavy knee flexion work."
        },
        {
          "name": "Standing Calf Raise",
          "sets": 3,
          "reps": "6-8 reps",
          "rest": "90 sec",
          "notes": "Heavy calf loading, pause at bottom."
        }
      ]
    },
    "wednesday": {
      "focus": "Active Recovery & Mobility",
      "exercises": [
        {
          "name": "Full Body Dynamic Mobility Flow",
          "sets": 1,
          "reps": "15 mins",
          "rest": "None",
          "notes": "Ankle dorsiflexion, hip opening, thoracic rotations."
        },
        {
          "name": "Light Elliptical Aerobic Flush",
          "sets": 1,
          "reps": "25 mins",
          "rest": "None",
          "notes": "Keep HR below 130 bpm to assist recovery."
        }
      ]
    },
    "thursday": {
      "focus": "Back & Shoulders Hypertrophy",
      "exercises": [
        {
          "name": "Speed Barbell Bent-Over Row",
          "sets": 6,
          "reps": "3 reps (at 65-70%)",
          "rest": "60 sec",
          "notes": "Explosive speed reps, move bar as fast as possible."
        },
        {
          "name": "Rack Chins / Wide Lat Pulldowns",
          "sets": 3,
          "reps": "8-12 reps",
          "rest": "90 sec",
          "notes": "High volume lat stretch and squeeze."
        },
        {
          "name": "Seated Cable Row",
          "sets": 3,
          "reps": "8-12 reps",
          "rest": "90 sec",
          "notes": "Retract scapulae firmly."
        },
        {
          "name": "Dumbbell Shrugs",
          "sets": 2,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Pause at top for 2 counts."
        },
        {
          "name": "Seated Dumbbell Lateral Raises",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Strict form, eliminate momentum."
        },
        {
          "name": "Rear Delt Cable Flyes",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Keep thumbs pointing forward, isolate posterior head."
        }
      ]
    },
    "friday": {
      "focus": "Lower Body Hypertrophy",
      "exercises": [
        {
          "name": "Speed Barbell Squats",
          "sets": 6,
          "reps": "3 reps (at 65-70%)",
          "rest": "60 sec",
          "notes": "Dynamic effort speed squats with max acceleration."
        },
        {
          "name": "Leg Press",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "90 sec",
          "notes": "Deep knee bend, constant tension."
        },
        {
          "name": "Leg Extensions",
          "sets": 3,
          "reps": "15-20 reps",
          "rest": "60 sec",
          "notes": "Quadriceps pump and burn."
        },
        {
          "name": "Romanian Deadlift",
          "sets": 3,
          "reps": "8-12 reps",
          "rest": "90 sec",
          "notes": "Slow 3 second eccentric on each rep."
        },
        {
          "name": "Seated Leg Curls",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Full flexion, squeeze at bottom."
        },
        {
          "name": "Seated Calf Raise",
          "sets": 4,
          "reps": "15-20 reps",
          "rest": "45 sec",
          "notes": "Pump blood into the soleus muscle."
        }
      ]
    },
    "saturday": {
      "focus": "Chest & Arms Hypertrophy",
      "exercises": [
        {
          "name": "Speed Flat Barbell Bench Press",
          "sets": 6,
          "reps": "3 reps (at 65-70%)",
          "rest": "60 sec",
          "notes": "Speed work: drive bar off chest with violent acceleration."
        },
        {
          "name": "Incline Dumbbell Bench Press",
          "sets": 3,
          "reps": "8-12 reps",
          "rest": "90 sec",
          "notes": "Upper chest focus, deep stretch."
        },
        {
          "name": "Hammer Strength Chest Press",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Lockout squeeze without disengaging pecs."
        },
        {
          "name": "Cable Crossover",
          "sets": 2,
          "reps": "15-20 reps",
          "rest": "45 sec",
          "notes": "Maximum blood flow to pectoral fibers."
        },
        {
          "name": "Incline Dumbbell Curl",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Long head stretch."
        },
        {
          "name": "Cable Tricep Pushdowns",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Strict elbows, full extension."
        },
        {
          "name": "Spider Curls",
          "sets": 2,
          "reps": "12-15 reps",
          "rest": "45 sec",
          "notes": "Chest supported on incline, bicep peak isolation."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Rest Day",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-008",
    "planName": "4-Day GZCL Method Linear Progression",
    "goal": "Powerbuilding & Work Capacity",
    "description": "Cody Lefever's structured tiered framework: Tier 1 (Heavy strength compounds), Tier 2 (Volume lift variations), Tier 3 (Hypertrophy isolation). Excellent for steady strength gains.",
    "isActive": true,
    "monday": {
      "focus": "T1 Squat & T2 Bench Press",
      "exercises": [
        {
          "name": "T1: Barbell Back Squat",
          "sets": 5,
          "reps": "3 reps",
          "rest": "3-4 min",
          "notes": "Tier 1: Heavy technical sets at 85% 1RM. Final set is AMRAP."
        },
        {
          "name": "T2: Flat Barbell Bench Press",
          "sets": 3,
          "reps": "10 reps",
          "rest": "2 min",
          "notes": "Tier 2: Volume work at 65-70% 1RM to build pressing capacity."
        },
        {
          "name": "T3: Lat Pulldown",
          "sets": 3,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Tier 3: Strict form, 15+ AMRAP on last set."
        },
        {
          "name": "T3: Dumbbell Split Squat",
          "sets": 3,
          "reps": "12 reps/leg",
          "rest": "60 sec",
          "notes": "Unilateral leg stability and hypertrophy."
        },
        {
          "name": "T3: Cable Face Pull",
          "sets": 3,
          "reps": "15-20 reps",
          "rest": "45 sec",
          "notes": "Scapular health and rear delt volume."
        }
      ]
    },
    "tuesday": {
      "focus": "T1 Overhead Press & T2 Deadlift",
      "exercises": [
        {
          "name": "T1: Standing Overhead Press",
          "sets": 5,
          "reps": "3 reps",
          "rest": "3 min",
          "notes": "Tier 1: Strict press, AMRAP on 5th set."
        },
        {
          "name": "T2: Conventional Barbell Deadlift",
          "sets": 3,
          "reps": "10 reps",
          "rest": "2-3 min",
          "notes": "Tier 2: Reset on floor every rep, volume hinge."
        },
        {
          "name": "T3: Barbell Pendlay Row",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Tier 3: Upper back density, explosive off floor."
        },
        {
          "name": "T3: Dumbbell Lateral Raise",
          "sets": 3,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Strict form, lead with elbows."
        },
        {
          "name": "T3: Hanging Knee Raises",
          "sets": 3,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Core compression and lumbar health."
        }
      ]
    },
    "wednesday": {
      "focus": "Rest & Active Mobility",
      "exercises": [
        {
          "name": "Thoracic Foam Rolling & Cat-Cow",
          "sets": 3,
          "reps": "10 reps",
          "rest": "30 sec",
          "notes": "Restore upper back articulation."
        },
        {
          "name": "Band Dislocates & Pull-Aparts",
          "sets": 3,
          "reps": "15 reps",
          "rest": "30 sec",
          "notes": "Keep shoulder capsules mobile."
        },
        {
          "name": "Brisk Incline Treadmill Walk",
          "sets": 1,
          "reps": "25 mins",
          "rest": "None",
          "notes": "Stimulate systemic circulation."
        }
      ]
    },
    "thursday": {
      "focus": "T1 Bench Press & T2 Squat",
      "exercises": [
        {
          "name": "T1: Flat Barbell Bench Press",
          "sets": 5,
          "reps": "3 reps",
          "rest": "3 min",
          "notes": "Tier 1: Heavy power work, pause on chest, AMRAP on last set."
        },
        {
          "name": "T2: Barbell Back Squat",
          "sets": 3,
          "reps": "10 reps",
          "rest": "2 min",
          "notes": "Tier 2: Moderate load, crisp rhythm and deep depth."
        },
        {
          "name": "T3: Dumbbell One-Arm Row",
          "sets": 3,
          "reps": "15 reps/arm",
          "rest": "60 sec",
          "notes": "Tier 3: Lat and rhomboid volume."
        },
        {
          "name": "T3: Incline Dumbbell Pec Flyes",
          "sets": 3,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Deep stretch for pectoral fibers."
        },
        {
          "name": "T3: Tricep Rope Pushdown",
          "sets": 3,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Isolate lateral and medial tricep heads."
        }
      ]
    },
    "friday": {
      "focus": "T1 Deadlift & T2 Overhead Press",
      "exercises": [
        {
          "name": "T1: Conventional Barbell Deadlift",
          "sets": 5,
          "reps": "3 reps",
          "rest": "3-4 min",
          "notes": "Tier 1: Peak pulling power, AMRAP on 5th set."
        },
        {
          "name": "T2: Standing Overhead Press",
          "sets": 3,
          "reps": "10 reps",
          "rest": "2 min",
          "notes": "Tier 2: High volume deltoid stimulus."
        },
        {
          "name": "T3: Neutral Grip Pull-Ups",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Smooth pull to upper chest."
        },
        {
          "name": "T3: Romanian Deadlift with Dumbbells",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Hamstring and glute isolation."
        },
        {
          "name": "T3: Barbell Bicep Curls",
          "sets": 3,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Bicep pump to finish."
        }
      ]
    },
    "saturday": {
      "focus": "General Physical Preparedness & Core",
      "exercises": [
        {
          "name": "Heavy Sandbag or Kettlebell Carry",
          "sets": 4,
          "reps": "40 meters",
          "rest": "90 sec",
          "notes": "Build functional torso armor and grip tenacity."
        },
        {
          "name": "Plank with Alternating Arm Lift",
          "sets": 3,
          "reps": "45 sec",
          "rest": "45 sec",
          "notes": "Anti-rotation core stability."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Rest Day",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-009",
    "planName": "5-Day German Volume Training (GVT 10x10 Protocol)",
    "goal": "High-Volume Muscle Shock & Rapid Mass Gain",
    "description": "The classic German Volume Training 10 sets of 10 reps protocol at 60% 1RM with strictly timed rest. Creates an extraordinary hypertrophic stimulus to smash through stubborn plateaus.",
    "isActive": true,
    "monday": {
      "focus": "Chest & Upper Back 10x10 Protocol",
      "exercises": [
        {
          "name": "Barbell Bench Press (10x10)",
          "sets": 10,
          "reps": "10 reps",
          "rest": "90 sec",
          "notes": "Use exactly 60% 1RM. Maintain a 4-second eccentric on every repetition."
        },
        {
          "name": "Bent-Over Barbell Row (10x10)",
          "sets": 10,
          "reps": "10 reps",
          "rest": "90 sec",
          "notes": "Strict overhand row, superset or alternate with bench after 90s rest."
        },
        {
          "name": "Incline Dumbbell Flyes",
          "sets": 3,
          "reps": "12 reps",
          "rest": "60 sec",
          "notes": "Pec stretch finisher."
        },
        {
          "name": "One-Arm Cable Lat Pullover",
          "sets": 3,
          "reps": "12 reps/arm",
          "rest": "60 sec",
          "notes": "Lat pump finisher."
        }
      ]
    },
    "tuesday": {
      "focus": "Legs & Abdominals 10x10 Protocol",
      "exercises": [
        {
          "name": "Barbell Back Squat (10x10)",
          "sets": 10,
          "reps": "10 reps",
          "rest": "90 sec",
          "notes": "The ultimate test of mental and physical grit. Keep depth consistent across all 10 sets."
        },
        {
          "name": "Lying Leg Curls (10x10)",
          "sets": 10,
          "reps": "10 reps",
          "rest": "90 sec",
          "notes": "Dorsiflex ankles, squeeze hamstrings for 100 total reps."
        },
        {
          "name": "Standing Calf Raises",
          "sets": 4,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Full stretch and peak contraction."
        },
        {
          "name": "Hanging Leg Raises",
          "sets": 4,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Slow abdominal curl."
        }
      ]
    },
    "wednesday": {
      "focus": "Neuromuscular Rest & Deep Tissue Care",
      "exercises": [
        {
          "name": "Full Body Foam Rolling",
          "sets": 1,
          "reps": "20 mins",
          "rest": "None",
          "notes": "Release tension in quads, glutes, lats, and pectorals."
        },
        {
          "name": "Low-Intensity Recumbent Bike",
          "sets": 1,
          "reps": "20 mins",
          "rest": "None",
          "notes": "Gentle flush to alleviate severe delayed onset muscle soreness (DOMS)."
        }
      ]
    },
    "thursday": {
      "focus": "Arms & Shoulders 10x10 Protocol",
      "exercises": [
        {
          "name": "Standing Barbell Overhead Press (10x10)",
          "sets": 10,
          "reps": "10 reps",
          "rest": "90 sec",
          "notes": "Strict form, squeeze glutes to support lumbar spine."
        },
        {
          "name": "Barbell Bicep Curl (10x10)",
          "sets": 10,
          "reps": "10 reps",
          "rest": "60 sec",
          "notes": "Pyramid of blood into the biceps, zero swinging."
        },
        {
          "name": "Close-Grip Bench Press (10x10)",
          "sets": 10,
          "reps": "10 reps",
          "rest": "60 sec",
          "notes": "Tricep mass overload with strict tuck."
        },
        {
          "name": "Seated Dumbbell Lateral Raises",
          "sets": 4,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Lateral delt burn finisher."
        }
      ]
    },
    "friday": {
      "focus": "Posterior Chain & Calves Volume",
      "exercises": [
        {
          "name": "Romanian Deadlift (Barbell)",
          "sets": 5,
          "reps": "10 reps",
          "rest": "2 min",
          "notes": "Hinge deep into hamstrings, keep bar glued to thighs."
        },
        {
          "name": "Bulgarian Split Squats",
          "sets": 3,
          "reps": "10 reps/leg",
          "rest": "90 sec",
          "notes": "Deep hip stretch and glute hypertrophy."
        },
        {
          "name": "Seated Calf Raise",
          "sets": 5,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Soleus isolation."
        },
        {
          "name": "Cable Woodchoppers",
          "sets": 3,
          "reps": "15 reps/side",
          "rest": "45 sec",
          "notes": "Rotational core stability."
        }
      ]
    },
    "saturday": {
      "focus": "Low-Impact Cardio & Core",
      "exercises": [
        {
          "name": "Incline Treadmill Walking",
          "sets": 1,
          "reps": "30 mins",
          "rest": "None",
          "notes": "Zone 2 aerobic recovery."
        },
        {
          "name": "Side Plank Holds",
          "sets": 3,
          "reps": "45 sec/side",
          "rest": "45 sec",
          "notes": "Lateral core and quadratus lumborum stability."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Rest Day",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-010",
    "planName": "4-Day High-Intensity Training (HIT Heavy Duty)",
    "goal": "High-Intensity Single Set to Failure",
    "description": "Mike Mentzer and Dorian Yates inspired Heavy Duty protocol. 1-2 warmup sets followed by a single all-out work set taken beyond momentary muscular failure with rest-pause and forced reps.",
    "isActive": true,
    "monday": {
      "focus": "Chest & Biceps (Pre-Exhaustion & Max Effort)",
      "exercises": [
        {
          "name": "Pec Deck Machine Fly (Pre-Exhaust)",
          "sets": 1,
          "reps": "8-10 reps to failure",
          "rest": "None",
          "notes": "Pre-exhaustion: 4-second negative, 2-second squeeze, immediately jump to incline press."
        },
        {
          "name": "Incline Smith Machine Bench Press",
          "sets": 1,
          "reps": "6-8 reps + 2 rest-pause",
          "rest": "3 min",
          "notes": "Lower to upper chest smoothly. After failure, rack for 10 seconds, then perform 2 more reps."
        },
        {
          "name": "Dips (Bodyweight or Weighted)",
          "sets": 1,
          "reps": "8-10 reps + 5s static hold",
          "rest": "3 min",
          "notes": "Deep stretch, press to lockout, hold final rep at bottom for 5 seconds."
        },
        {
          "name": "Concentration Curl (Pre-Exhaust)",
          "sets": 1,
          "reps": "8-10 reps/arm",
          "rest": "60 sec",
          "notes": "Strict peak contraction, 4-second descent."
        },
        {
          "name": "Barbell Bicep Curl",
          "sets": 1,
          "reps": "6-8 reps to failure",
          "rest": "2 min",
          "notes": "Heavy all-out set with strict form until absolute muscle failure."
        }
      ]
    },
    "tuesday": {
      "focus": "Rest & Neurological Recovery",
      "exercises": [
        {
          "name": "Casual Outdoor Walk",
          "sets": 1,
          "reps": "30 mins",
          "rest": "None",
          "notes": "Parasympathetic nervous system recovery, fresh air."
        }
      ]
    },
    "wednesday": {
      "focus": "Legs & Calves (Maximum Intensity)",
      "exercises": [
        {
          "name": "Leg Extension (Pre-Exhaust)",
          "sets": 1,
          "reps": "10-12 reps to failure",
          "rest": "None",
          "notes": "Hold peak contraction for 2 seconds on every rep, move directly to leg press."
        },
        {
          "name": "Leg Press",
          "sets": 1,
          "reps": "8-10 reps + 3 rest-pause",
          "rest": "3 min",
          "notes": "Brutal quad loading, do not lock knees, 4-second negatives."
        },
        {
          "name": "Lying Leg Curl",
          "sets": 1,
          "reps": "8-10 reps to failure",
          "rest": "2 min",
          "notes": "Keep pelvis pinned, squeeze hamstrings to glutes."
        },
        {
          "name": "Stiff-Legged Barbell Deadlift",
          "sets": 1,
          "reps": "8-10 reps",
          "rest": "3 min",
          "notes": "Massive stretch on hamstrings, slow and deliberate cadence."
        },
        {
          "name": "Standing Calf Machine",
          "sets": 1,
          "reps": "12-15 reps + drop set",
          "rest": "90 sec",
          "notes": "Full range of motion, drop weight 30% after failure for 6 extra reps."
        }
      ]
    },
    "thursday": {
      "focus": "Active Recovery & Deep Stretch",
      "exercises": [
        {
          "name": "Full Body Static Stretching",
          "sets": 1,
          "reps": "20 mins",
          "rest": "None",
          "notes": "Focus on pectorals, lats, quads, and hamstrings."
        }
      ]
    },
    "friday": {
      "focus": "Back & Shoulders (Beyond Failure)",
      "exercises": [
        {
          "name": "Nautilus/Cable Lat Pullover (Pre-Exhaust)",
          "sets": 1,
          "reps": "8-10 reps",
          "rest": "None",
          "notes": "Isolate lats completely, transition immediately to underhand pulldowns."
        },
        {
          "name": "Underhand Close-Grip Lat Pulldown",
          "sets": 1,
          "reps": "6-8 reps + 2 forced reps",
          "rest": "3 min",
          "notes": "Drive elbows deep into sides, hold contraction for 1 second."
        },
        {
          "name": "One-Arm Dumbbell Row",
          "sets": 1,
          "reps": "6-8 reps/arm to failure",
          "rest": "2 min",
          "notes": "Heavy dumbbell, pull smoothly into hip."
        },
        {
          "name": "Machine Rear Delt Fly",
          "sets": 1,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Isolate posterior delts."
        },
        {
          "name": "Seated Dumbbell Overhead Press",
          "sets": 1,
          "reps": "6-8 reps to failure",
          "rest": "3 min",
          "notes": "Strict vertical drive, explode up, 3-second eccentric."
        }
      ]
    },
    "saturday": {
      "focus": "Triceps, Forearms & Abdominals",
      "exercises": [
        {
          "name": "Cable Tricep Pushdown (Pre-Exhaust)",
          "sets": 1,
          "reps": "10-12 reps",
          "rest": "None",
          "notes": "Burn out triceps before close grip benching."
        },
        {
          "name": "Close-Grip Bench Press",
          "sets": 1,
          "reps": "6-8 reps to failure",
          "rest": "3 min",
          "notes": "Elbows tucked, drive through palms."
        },
        {
          "name": "Standing Wrist Curls",
          "sets": 2,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Forearm burn and grip density."
        },
        {
          "name": "Weighted Decline Sit-Ups",
          "sets": 1,
          "reps": "12-15 reps to failure",
          "rest": "60 sec",
          "notes": "Hold plate against chest, slow spinal roll."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Neurological Rest",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-011",
    "planName": "5-Day V-Taper Aesthetic Protocol",
    "goal": "Aesthetic Proportions & V-Taper Definition",
    "description": "Engineered to maximize the golden ratio: sweeping lateral delts, wide flared lats, high upper chest shelf, and a tight, vacuum-ready narrow waistline.",
    "isActive": true,
    "monday": {
      "focus": "Lat Width & Scapular Depression",
      "exercises": [
        {
          "name": "Wide-Grip Lat Pulldown",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Lean back 10 degrees, pull bar to collarbones, flared lats."
        },
        {
          "name": "Straight-Arm Cable Pullover",
          "sets": 4,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Arms extended, drive straight down to thighs with lats."
        },
        {
          "name": "Single-Arm High Cable Row",
          "sets": 3,
          "reps": "12 reps/arm",
          "rest": "60 sec",
          "notes": "Pull from high to low into hip pocket, stretch overhead."
        },
        {
          "name": "Chest-Supported Neutral Row",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Squeeze middle back without flaring waist."
        },
        {
          "name": "Stomach Vacuum Holds",
          "sets": 4,
          "reps": "20-30 sec hold",
          "rest": "45 sec",
          "notes": "Exhale all air, pull belly button back to spine, hold tight."
        }
      ]
    },
    "tuesday": {
      "focus": "Lateral Deltoids & Upper Chest",
      "exercises": [
        {
          "name": "Incline Barbell Bench Press",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "2 min",
          "notes": "Set bench to 30 degrees, build the upper pectoral shelf."
        },
        {
          "name": "Dumbbell Lateral Raise (Lean-Away)",
          "sets": 5,
          "reps": "12-15 reps/arm",
          "rest": "45 sec",
          "notes": "Hold onto a pillar, lean away to place max tension at bottom."
        },
        {
          "name": "Low-to-High Cable Chest Fly",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Scoop cables upward and forward to target clavicular head."
        },
        {
          "name": "Cable Egyptian Lateral Raise",
          "sets": 4,
          "reps": "15 reps/arm",
          "rest": "45 sec",
          "notes": "Continuous tension on the side delts."
        },
        {
          "name": "Overhead Rope Tricep Extension",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Broaden tricep lateral profile."
        }
      ]
    },
    "wednesday": {
      "focus": "Lower Body Hypertrophy & Waist Thinning",
      "exercises": [
        {
          "name": "Barbell Front Squat",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "2 min",
          "notes": "Quad dominant, keeps torso upright, minimizes waist thickening."
        },
        {
          "name": "Leg Press (Feet Low on Platform)",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "90 sec",
          "notes": "Target teardrop vastus medialis."
        },
        {
          "name": "Romanian Deadlift with Dumbbells",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Isolate hamstrings and glute tie-in."
        },
        {
          "name": "Standing Calf Raise",
          "sets": 5,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Diamond-shaped calves balance lower leg aesthetic."
        },
        {
          "name": "Hanging Leg Raises (No Swing)",
          "sets": 4,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Strict pelvic tuck, no heavy weighted oblique crunches."
        }
      ]
    },
    "thursday": {
      "focus": "Back Thickness & Rear Deltoid Tie-ins",
      "exercises": [
        {
          "name": "Bent-Over Barbell Row (Underhand)",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "2 min",
          "notes": "Builds dense lat thickness and lower lat origin."
        },
        {
          "name": "Reverse Pec Deck Fly",
          "sets": 4,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Rear delt capped 3D look."
        },
        {
          "name": "Seated Cable Row (Wide Neutral Grip)",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Retract scapulae fully, squeeze rhomboids."
        },
        {
          "name": "Face Pulls with External Rotation",
          "sets": 4,
          "reps": "15-20 reps",
          "rest": "45 sec",
          "notes": "Posterior shoulder stability and 3D deltoid appearance."
        },
        {
          "name": "Stomach Vacuums on All Fours",
          "sets": 4,
          "reps": "20 sec hold",
          "rest": "30 sec",
          "notes": "Strengthen transverse abdominis to draw in waist."
        }
      ]
    },
    "friday": {
      "focus": "Upper Chest, Bicep Peak & Tricep Sweep",
      "exercises": [
        {
          "name": "Incline Dumbbell Bench Press",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Deep pectoral stretch, drive up into slight arc."
        },
        {
          "name": "Incline Dumbbell Bicep Curl",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Full elbow extension to maximize bicep peak length."
        },
        {
          "name": "Cable Skull Crushers on Decline Bench",
          "sets": 4,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Huge stretch on long head of triceps."
        },
        {
          "name": "Cable Bayesian Curls",
          "sets": 3,
          "reps": "12-15 reps/arm",
          "rest": "45 sec",
          "notes": "Peak bicep contraction."
        },
        {
          "name": "Diamond Push-Ups to Failure",
          "sets": 2,
          "reps": "AMRAP",
          "rest": "60 sec",
          "notes": "Finishing tricep and inner pec pump."
        }
      ]
    },
    "saturday": {
      "focus": "HIIT Sprints & Core Tightening",
      "exercises": [
        {
          "name": "Treadmill Sprint Intervals (30s on / 60s off)",
          "sets": 8,
          "reps": "30 sec sprint",
          "rest": "60 sec",
          "notes": "Burn visceral body fat while preserving lean leg mass."
        },
        {
          "name": "Plank to Dolphin Pose Flow",
          "sets": 3,
          "reps": "12 reps",
          "rest": "45 sec",
          "notes": "Dynamic core stabilizer and serratus engagement."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Rest & Recovery",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-012",
    "planName": "4-Day Women's Glute & Lower Body Specialization",
    "goal": "Glute Hypertrophy & Lower Body Sculpting",
    "description": "Evidence-based glute-centric program emphasizing hip thrusts, squats, hinges, and abduction with calibrated upper body balance for athletic, sculpted feminine curves.",
    "isActive": true,
    "monday": {
      "focus": "Glute Maximum & Heavy Hip Thrust Overload",
      "exercises": [
        {
          "name": "Barbell Hip Thrust",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "2-3 min",
          "notes": "Place pad across hips, chin tucked, 2-second hard squeeze at top lockout."
        },
        {
          "name": "Romanian Deadlift (Dumbbell or Barbell)",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "2 min",
          "notes": "Hinge backwards, feel tension in glute-hamstring tie-in."
        },
        {
          "name": "Bulgarian Split Squats (Glute-Biased Lean)",
          "sets": 3,
          "reps": "10-12 reps/leg",
          "rest": "90 sec",
          "notes": "Lean torso 30 degrees forward to shift load into the gluteus maximus."
        },
        {
          "name": "Cable Glute Kickbacks",
          "sets": 3,
          "reps": "15 reps/leg",
          "rest": "45 sec",
          "notes": "Kick back at a 45 degree angle for upper glute fibers."
        },
        {
          "name": "Seated Cable Hip Abduction",
          "sets": 3,
          "reps": "20 reps",
          "rest": "45 sec",
          "notes": "Lean forward on seat, push knees out firmly."
        }
      ]
    },
    "tuesday": {
      "focus": "Upper Body Sculpt & Core Tightening",
      "exercises": [
        {
          "name": "Dumbbell Overhead Shoulder Press",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Sculpt shoulder cap to create hourglass proportion."
        },
        {
          "name": "Lat Pulldown (Neutral Grip)",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Back width to emphasize small waist appearance."
        },
        {
          "name": "Push-Ups (Full or Kneeling)",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Chest and anterior deltoid engagement."
        },
        {
          "name": "Dumbbell Lateral Raise",
          "sets": 4,
          "reps": "12-15 reps",
          "rest": "45 sec",
          "notes": "Strict side delt tone."
        },
        {
          "name": "Dead Bug Core Bracing",
          "sets": 3,
          "reps": "12 reps/side",
          "rest": "45 sec",
          "notes": "Deep core activation without bulking obliques."
        }
      ]
    },
    "wednesday": {
      "focus": "Glute Activation, Hip Mobility & Pelvic Health",
      "exercises": [
        {
          "name": "Resistance Band Clamshells",
          "sets": 3,
          "reps": "20 reps/side",
          "rest": "30 sec",
          "notes": "Warm up gluteus medius and piriformis."
        },
        {
          "name": "Frog Pumps with Glute Band",
          "sets": 3,
          "reps": "30 reps",
          "rest": "30 sec",
          "notes": "High rep glute pump, feet soles pressed together."
        },
        {
          "name": "Pigeon Stretch & 90/90 Hip Flow",
          "sets": 2,
          "reps": "60 sec/side",
          "rest": "None",
          "notes": "Alleviate tight hip capsules and glute fascia."
        }
      ]
    },
    "thursday": {
      "focus": "Gluteus Medius, Quads & Hamstrings Focus",
      "exercises": [
        {
          "name": "Barbell Back Squats (Wide Stance)",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "2-3 min",
          "notes": "Wide stance, toes pointed out 30 degrees, drive knees open."
        },
        {
          "name": "Kas Glute Bridges (Barbell)",
          "sets": 4,
          "reps": "12 reps",
          "rest": "90 sec",
          "notes": "Shorter range of motion than hip thrust, pure glute isolation."
        },
        {
          "name": "Walking Lunges with Dumbbells",
          "sets": 3,
          "reps": "12 steps/leg",
          "rest": "90 sec",
          "notes": "Long stride length to emphasize glutes over quads."
        },
        {
          "name": "Lying Leg Curls",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Hamstring tone and knee joint protection."
        },
        {
          "name": "Standing Cable Hip Abduction",
          "sets": 3,
          "reps": "15 reps/leg",
          "rest": "45 sec",
          "notes": "Upper glute shelf development."
        }
      ]
    },
    "friday": {
      "focus": "Upper Body Tone & Shoulder Cap",
      "exercises": [
        {
          "name": "Seated Cable Row (Close Grip)",
          "sets": 3,
          "reps": "12 reps",
          "rest": "60 sec",
          "notes": "Mid-back posture correction."
        },
        {
          "name": "Incline Dumbbell Chest Press",
          "sets": 3,
          "reps": "12 reps",
          "rest": "60 sec",
          "notes": "Upper chest tone."
        },
        {
          "name": "Tricep Overhead Rope Extension",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "45 sec",
          "notes": "Firm arms and eliminate tricep slack."
        },
        {
          "name": "Face Pulls with Cable",
          "sets": 3,
          "reps": "15-20 reps",
          "rest": "45 sec",
          "notes": "Rear deltoids and postural correction."
        },
        {
          "name": "Side Planks",
          "sets": 3,
          "reps": "30-45 sec/side",
          "rest": "45 sec",
          "notes": "Waist tightening without hyperextension."
        }
      ]
    },
    "saturday": {
      "focus": "Glute Burnout & High-Rep Finisher",
      "exercises": [
        {
          "name": "Banded Bodyweight Hip Thrusts (1.5 Reps)",
          "sets": 3,
          "reps": "20 reps",
          "rest": "60 sec",
          "notes": "Go all the way up, halfway down, back up, then down (1 rep)."
        },
        {
          "name": "Curtsy Lunges with Dumbbells",
          "sets": 3,
          "reps": "12 reps/leg",
          "rest": "60 sec",
          "notes": "Step back and across to stretch the outer glute."
        },
        {
          "name": "Cable Pull-Throughs",
          "sets": 3,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Hinge backwards, snap hips through at top."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Rest & Muscle Repair",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-013",
    "planName": "5-Day Athletic Performance & Explosive Power",
    "goal": "Athletic Speed, Agility & Vertical Jump",
    "description": "Designed for court and field athletes to maximize triple-extension power, linear acceleration, rotational force, and injury resistance through plyometrics and contrast training.",
    "isActive": true,
    "monday": {
      "focus": "Plyometrics & Lower Body Explosive Power",
      "exercises": [
        {
          "name": "Depth Jumps to Box Jump (Contrast)",
          "sets": 4,
          "reps": "4 reps",
          "rest": "2 min",
          "notes": "Step off 18-inch box, minimize ground contact time, explode upward."
        },
        {
          "name": "Barbell Trap Bar Deadlift (High Handle)",
          "sets": 4,
          "reps": "4-5 reps",
          "rest": "3 min",
          "notes": "Focus on maximal velocity of the barbell on every repetition."
        },
        {
          "name": "Dumbbell Jump Squats (Loaded 15% Bodyweight)",
          "sets": 4,
          "reps": "5 reps",
          "rest": "90 sec",
          "notes": "Violent hip extension, land softly in athletic stance."
        },
        {
          "name": "Single-Leg Bulgarian Split Squats",
          "sets": 3,
          "reps": "6 reps/leg",
          "rest": "90 sec",
          "notes": "Unilateral strength and pelvic stability."
        },
        {
          "name": "Nordic Hamstring Curls",
          "sets": 3,
          "reps": "5-6 reps",
          "rest": "2 min",
          "notes": "Essential eccentric hamstring injury prevention for sprinters."
        }
      ]
    },
    "tuesday": {
      "focus": "Upper Body Ballistics & Rotational Velocity",
      "exercises": [
        {
          "name": "Medicine Ball Rotational Scoop Toss into Wall",
          "sets": 4,
          "reps": "6 reps/side",
          "rest": "60 sec",
          "notes": "Explode from rear hip, transfer kinetic energy through torso."
        },
        {
          "name": "Overhead Medicine Ball Slams",
          "sets": 4,
          "reps": "8 reps",
          "rest": "60 sec",
          "notes": "Triple extension to violent anterior core flexion."
        },
        {
          "name": "Push Press (Barbell)",
          "sets": 4,
          "reps": "5 reps",
          "rest": "2 min",
          "notes": "Dip 3-4 inches with knees, drive aggressively overhead."
        },
        {
          "name": "Chest-Supported Neutral Row (Speed)",
          "sets": 4,
          "reps": "6-8 reps",
          "rest": "90 sec",
          "notes": "Fast concentric, controlled eccentric."
        },
        {
          "name": "Half-Kneeling Landmine Press",
          "sets": 3,
          "reps": "8 reps/arm",
          "rest": "60 sec",
          "notes": "Scapular upward rotation and contralateral core brace."
        }
      ]
    },
    "wednesday": {
      "focus": "Active Agility, Footwork & Hip Flow",
      "exercises": [
        {
          "name": "Agility Ladder Footwork Drills (Ickey Shuffle, In-Outs)",
          "sets": 6,
          "reps": "20 yards",
          "rest": "45 sec",
          "notes": "Quick feet, light on balls of feet, athletic base."
        },
        {
          "name": "Ankle Mobility Wall Drives & Dorsiflexion",
          "sets": 3,
          "reps": "15 reps/ankle",
          "rest": "30 sec",
          "notes": "Restore ankle dorsiflexion for deeper athletic positioning."
        },
        {
          "name": "Hip 90/90 Switches & Psoas Activation",
          "sets": 3,
          "reps": "8 per side",
          "rest": "30 sec",
          "notes": "Hip capsule mobility and groin protection."
        }
      ]
    },
    "thursday": {
      "focus": "Olympic Lifts, Triple Extension & Squats",
      "exercises": [
        {
          "name": "Hang Power Cleans",
          "sets": 5,
          "reps": "3 reps",
          "rest": "2-3 min",
          "notes": "Catch on deltoids with elbows high, explode from mid-thigh."
        },
        {
          "name": "Barbell Front Squats",
          "sets": 4,
          "reps": "5 reps",
          "rest": "2-3 min",
          "notes": "Reinforces vertical posture and knee flexion power."
        },
        {
          "name": "Barbell Romanian Deadlift (Speed Accentuated)",
          "sets": 3,
          "reps": "6-8 reps",
          "rest": "2 min",
          "notes": "Snap hips forward at top lockout."
        },
        {
          "name": "Lateral Bounds (Skater Jumps with Stick)",
          "sets": 3,
          "reps": "6 reps/side",
          "rest": "60 sec",
          "notes": "Stick landing for 2 seconds to train eccentric deceleration."
        },
        {
          "name": "Paloff Press Core Anti-Rotation",
          "sets": 3,
          "reps": "10 reps/side",
          "rest": "45 sec",
          "notes": "Resist cable rotational pull, hold 2s at extension."
        }
      ]
    },
    "friday": {
      "focus": "Upper Body Contrast Training & Core Deceleration",
      "exercises": [
        {
          "name": "Plyometric Clapping Push-Ups",
          "sets": 4,
          "reps": "5 reps",
          "rest": "90 sec",
          "notes": "Explode off floor with maximum upper body power."
        },
        {
          "name": "Weighted Pull-Ups (Explosive)",
          "sets": 4,
          "reps": "4-6 reps",
          "rest": "2 min",
          "notes": "Fast upward drive to bar."
        },
        {
          "name": "Incline Dumbbell Press",
          "sets": 3,
          "reps": "8 reps",
          "rest": "90 sec",
          "notes": "Speed pressing off chest."
        },
        {
          "name": "Single-Arm Dumbbell Snatch",
          "sets": 3,
          "reps": "5 reps/arm",
          "rest": "90 sec",
          "notes": "Floor to overhead in one smooth explosive stroke."
        },
        {
          "name": "Hanging Windshield Wipers",
          "sets": 3,
          "reps": "8 reps/side",
          "rest": "60 sec",
          "notes": "Rotational core strength and lat grip stamina."
        }
      ]
    },
    "saturday": {
      "focus": "Multi-Directional Sprints & Energy Systems",
      "exercises": [
        {
          "name": "10-Yard Sprints from 3-Point Stance",
          "sets": 6,
          "reps": "10 yards",
          "rest": "60 sec",
          "notes": "Max acceleration, low shin angle, powerful arm drive."
        },
        {
          "name": "Pro Agility 5-10-5 Shuttle Run",
          "sets": 4,
          "reps": "1 drill",
          "rest": "90 sec",
          "notes": "Touch line with hand, sharp change of direction."
        },
        {
          "name": "Farmer's Carries (Heavy Dumbbells)",
          "sets": 3,
          "reps": "50 meters",
          "rest": "90 sec",
          "notes": "Grip and full-body structural stability."
        }
      ]
    },
    "sunday": {
      "focus": "Tissue Regeneration & Rest",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-014",
    "planName": "4-Day Functional Calisthenics & Bodyweight Dominance",
    "goal": "Relative Strength & Gymnastic Skill Mastery",
    "description": "Progressive bodyweight athletics program focused on mastering foundational and advanced gymnastic skills: muscle-ups, handstand push-ups, levers, and pistol squats.",
    "isActive": true,
    "monday": {
      "focus": "Straight-Arm Strength & Planche/Lever Progression",
      "exercises": [
        {
          "name": "Tuck Planche Holds (Parallettes)",
          "sets": 5,
          "reps": "10-15 sec hold",
          "rest": "90 sec",
          "notes": "Protracted scapulae, locked elbows, lean shoulders over hands."
        },
        {
          "name": "Front Lever Tuck / Advanced Tuck Holds",
          "sets": 5,
          "reps": "10-15 sec hold",
          "rest": "90 sec",
          "notes": "Depress scapulae, pull straight arms down toward hips."
        },
        {
          "name": "Skin the Cat (Gymnastic Rings)",
          "sets": 4,
          "reps": "5 reps",
          "rest": "90 sec",
          "notes": "Shoulder extension and 360-degree joint mobility."
        },
        {
          "name": "Ring Support Hold",
          "sets": 4,
          "reps": "30 sec hold",
          "rest": "60 sec",
          "notes": "Turn ring palms outward at 45 degrees, locked elbows."
        },
        {
          "name": "Dragon Flag Negatives",
          "sets": 3,
          "reps": "5 reps",
          "rest": "90 sec",
          "notes": "Lower rigid body slowly, pivot from shoulders."
        }
      ]
    },
    "tuesday": {
      "focus": "Bent-Arm Push (HSPU & Ring Dips)",
      "exercises": [
        {
          "name": "Wall-Facing Handstand Push-Ups",
          "sets": 4,
          "reps": "5-8 reps",
          "rest": "2 min",
          "notes": "Form tripod with head and hands, press to locked lockout."
        },
        {
          "name": "Gymnastic Ring Dips",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "90 sec",
          "notes": "Turn rings out at top of each repetition."
        },
        {
          "name": "Deficit Pike Push-Ups (Feet Elevated)",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Lower head in front of hands into deficit, press overhead."
        },
        {
          "name": "Pseudo Planche Push-Ups",
          "sets": 3,
          "reps": "8-10 reps",
          "rest": "60 sec",
          "notes": "Hands turned back, extreme forward lean at top."
        },
        {
          "name": "Tricep Tiger Bend Push-Ups",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Drop forearms to floor, push back up with triceps."
        }
      ]
    },
    "wednesday": {
      "focus": "Lower Body Calisthenics & Pistol Squats",
      "exercises": [
        {
          "name": "Pistol Squats (Single-Leg)",
          "sets": 4,
          "reps": "6-8 reps/leg",
          "rest": "90 sec",
          "notes": "Keep non-working leg straight out, full depth, balance on heel."
        },
        {
          "name": "Sissy Squats (Bodyweight)",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Lean torso back, drive knees forward for intense quad load."
        },
        {
          "name": "Single-Leg Elevated Hip Thrusts",
          "sets": 4,
          "reps": "12 reps/leg",
          "rest": "60 sec",
          "notes": "Full glute extension off a bench."
        },
        {
          "name": "Nordic Hamstring Curls (Band-Assisted)",
          "sets": 3,
          "reps": "6-8 reps",
          "rest": "90 sec",
          "notes": "Slow eccentric descent, push off lightly with hands."
        },
        {
          "name": "Single-Leg Calf Raises (Deficit)",
          "sets": 4,
          "reps": "20 reps/leg",
          "rest": "45 sec",
          "notes": "Deep stretch on stairs, rise to full tip-toe."
        }
      ]
    },
    "thursday": {
      "focus": "Bent-Arm Pull (Muscle-Ups & Weighted Chins)",
      "exercises": [
        {
          "name": "Bar Muscle-Ups (or Band-Assisted)",
          "sets": 4,
          "reps": "3-5 reps",
          "rest": "2 min",
          "notes": "Aggressive hollow pull, quick head transition over bar."
        },
        {
          "name": "Weighted Pull-Ups (Neutral Grip)",
          "sets": 4,
          "reps": "5-6 reps",
          "rest": "2 min",
          "notes": "Add weight vest or belt, pull chin cleanly over bar."
        },
        {
          "name": "Horizontal Ring Inverted Rows",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Feet elevated on box, pull rings to sternum."
        },
        {
          "name": "Tuck Front Lever Pull-Ups",
          "sets": 3,
          "reps": "6-8 reps",
          "rest": "90 sec",
          "notes": "Maintain tucked flat back while pulling."
        },
        {
          "name": "Ring Bicep Curls (Bodyweight)",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Lean back, pull forehead to ring handles."
        }
      ]
    },
    "friday": {
      "focus": "Core Compression & Hollow Body Mastery",
      "exercises": [
        {
          "name": "Hanging Toes-to-Bar",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Touch toes to bar without swinging."
        },
        {
          "name": "L-Sit Holds (on Parallettes)",
          "sets": 4,
          "reps": "15-20 sec hold",
          "rest": "60 sec",
          "notes": "Depress shoulders, lift straight legs parallel to floor."
        },
        {
          "name": "Hollow Body Rockers",
          "sets": 3,
          "reps": "20 reps",
          "rest": "45 sec",
          "notes": "Lower back glued to floor, rock smoothly like a boat."
        }
      ]
    },
    "saturday": {
      "focus": "Calisthenics Freestyle & Flow Practice",
      "exercises": [
        {
          "name": "Freestanding Handstand Practice",
          "sets": 5,
          "reps": "30 sec efforts",
          "rest": "60 sec",
          "notes": "Focus on finger pressure balance, bail safely."
        },
        {
          "name": "German Hang to Skin the Cat",
          "sets": 3,
          "reps": "3 reps",
          "rest": "60 sec",
          "notes": "Shoulder flexibility and connective tissue resilience."
        }
      ]
    },
    "sunday": {
      "focus": "Wrist, Shoulder & Hamstring Mobility",
      "exercises": [
        {
          "name": "Wrist Extension & Flexion Floor Routine",
          "sets": 3,
          "reps": "15 reps",
          "rest": "30 sec",
          "notes": "Condition wrists for handstand pressure."
        },
        {
          "name": "Pancake Stretch Progression",
          "sets": 3,
          "reps": "60 sec",
          "rest": "45 sec",
          "notes": "Hamstring and adductor flexibility for straddle skills."
        }
      ]
    }
  },
  {
    "workoutPlanId": "WPL-015",
    "planName": "5-Day Tactical Operator Readiness & Combat Conditioning",
    "goal": "Tactical Conditioning, Rucking & Multi-Domain Strength",
    "description": "Built for military, law enforcement, and first responders requiring raw physical stamina, structural armor, grip resilience, heavy rucking capacity, and all-weather readiness.",
    "isActive": true,
    "monday": {
      "focus": "Structural Strength & Heavy Barbell Armor",
      "exercises": [
        {
          "name": "Barbell Back Squat",
          "sets": 4,
          "reps": "5 reps",
          "rest": "3 min",
          "notes": "Heavy load, builds leg drive to carry heavy operational loads."
        },
        {
          "name": "Barbell Overhead Push Press",
          "sets": 4,
          "reps": "5 reps",
          "rest": "2 min",
          "notes": "Pressing strength overhead, lock hips and core."
        },
        {
          "name": "Chest-Supported Barbell Row",
          "sets": 4,
          "reps": "6-8 reps",
          "rest": "90 sec",
          "notes": "Upper back armor to support body armor and plate carriers."
        },
        {
          "name": "Farmer's Carry (Heavy Trap Bar)",
          "sets": 4,
          "reps": "50 meters",
          "rest": "90 sec",
          "notes": "Match bodyweight total load, grip and trap resilience."
        },
        {
          "name": "Plank with 45lb Plate on Back",
          "sets": 3,
          "reps": "60 sec hold",
          "rest": "60 sec",
          "notes": "Anterior core bracing under tactical weight."
        }
      ]
    },
    "tuesday": {
      "focus": "Tactical MetCon & VO2 Max Capacity",
      "exercises": [
        {
          "name": "5-Rounds: 400m Run + 15 Burpees + 15 Pull-Ups",
          "sets": 5,
          "reps": "1 Round",
          "rest": "90 sec",
          "notes": "Sustain steady pacing across all 5 rounds."
        },
        {
          "name": "Kettlebell Swings (32kg / 24kg)",
          "sets": 4,
          "reps": "20 reps",
          "rest": "60 sec",
          "notes": "Violent hip hinge, keep core braced."
        },
        {
          "name": "Air Bike (Assault Bike) 30s All-Out Sprint",
          "sets": 4,
          "reps": "30 sec sprint",
          "rest": "90 sec",
          "notes": "Lactate threshold endurance."
        }
      ]
    },
    "wednesday": {
      "focus": "Grip, Core & Loaded Carries",
      "exercises": [
        {
          "name": "Sandbag Bear Hug Carry (150lb / 100lb)",
          "sets": 4,
          "reps": "50 meters",
          "rest": "90 sec",
          "notes": "Wrap arms around heavy sandbag, walk tall."
        },
        {
          "name": "Single-Arm Suitcase Carry",
          "sets": 4,
          "reps": "40 meters/arm",
          "rest": "60 sec",
          "notes": "Resist lateral flexion, anti-rotation core armor."
        },
        {
          "name": "Towel Grip Dead Hangs",
          "sets": 4,
          "reps": "Max time",
          "rest": "60 sec",
          "notes": "Drape two towels over pull-up bar, grip and hang."
        },
        {
          "name": "Ab Wheel Rollouts",
          "sets": 3,
          "reps": "12 reps",
          "rest": "60 sec",
          "notes": "Control lumbar extension."
        }
      ]
    },
    "thursday": {
      "focus": "Tactical Upper Body Power (Press/Pull)",
      "exercises": [
        {
          "name": "Weighted Pull-Ups",
          "sets": 4,
          "reps": "5 reps",
          "rest": "2 min",
          "notes": "Strict tactical pull-ups, dead hang every rep."
        },
        {
          "name": "Flat Barbell Bench Press",
          "sets": 4,
          "reps": "6 reps",
          "rest": "2 min",
          "notes": "Horizontal push strength."
        },
        {
          "name": "Standing One-Arm Dumbbell Push Press",
          "sets": 3,
          "reps": "6 reps/arm",
          "rest": "60 sec",
          "notes": "Unilateral overhead power."
        },
        {
          "name": "Inverted Row with Feet Elevated",
          "sets": 3,
          "reps": "12 reps",
          "rest": "60 sec",
          "notes": "Upper back endurance."
        },
        {
          "name": "Dips (Bodyweight or Light Plate)",
          "sets": 3,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Tricep endurance."
        }
      ]
    },
    "friday": {
      "focus": "Ruck March (35lb Pack) & Posterior Durability",
      "exercises": [
        {
          "name": "Weighted Ruck March (35lb Pack)",
          "sets": 1,
          "reps": "4 to 6 miles (14 min/mile pace)",
          "rest": "None",
          "notes": "Maintain standard military ruck pace, upright posture."
        },
        {
          "name": "Bodyweight Lunges (Post-Ruck)",
          "sets": 3,
          "reps": "15 steps/leg",
          "rest": "60 sec",
          "notes": "Unweighted leg cool down and hip flexor stretch."
        }
      ]
    },
    "saturday": {
      "focus": "Combat Obstacle Simulation & Conditioning",
      "exercises": [
        {
          "name": "Sandbag Clean & Over-the-Shoulder Toss",
          "sets": 5,
          "reps": "6 reps",
          "rest": "60 sec",
          "notes": "Deadlift sandbag, pop hips, toss over shoulder."
        },
        {
          "name": "Hand-Release Push-Ups",
          "sets": 4,
          "reps": "20 reps",
          "rest": "45 sec",
          "notes": "Standard tactical physical fitness test mechanics."
        },
        {
          "name": "800-Meter Sled Drag or Tire Drag",
          "sets": 1,
          "reps": "800 meters",
          "rest": "None",
          "notes": "Continuous mental toughness test."
        }
      ]
    },
    "sunday": {
      "focus": "Deep Myofascial Release & Joint Mobility",
      "exercises": [
        {
          "name": "Lacrosse Ball Thoracic & Glute Release",
          "sets": 1,
          "reps": "15 mins",
          "rest": "None",
          "notes": "Target trigger points created by rucking and heavy loads."
        },
        {
          "name": "Active Hip Flexor & Psoas Decompression",
          "sets": 3,
          "reps": "90 sec/side",
          "rest": "30 sec",
          "notes": "Restore lumbar pelvic neutral."
        }
      ]
    }
  },
  {
    "workoutPlanId": "WPL-016",
    "planName": "4-Day Olympic Weightlifting Fundamentals",
    "goal": "Snatch, Clean & Jerk Technique and Power",
    "description": "Geared towards mastering the classical lifts: Snatch, Clean & Jerk, Front Squats, and specialized pulls. Emphasizes bar path precision, receiving positions, and explosive triple extension.",
    "isActive": true,
    "monday": {
      "focus": "Snatch Complex & Overhead Squats",
      "exercises": [
        {
          "name": "Snatch Balance",
          "sets": 4,
          "reps": "3 reps",
          "rest": "2 min",
          "notes": "Drop violently under bar into deep overhead squat position."
        },
        {
          "name": "Hang Snatch (Above Knee)",
          "sets": 5,
          "reps": "2 reps",
          "rest": "2-3 min",
          "notes": "Focus on rapid hip contact and fast elbow turnover."
        },
        {
          "name": "Full Snatch from Floor",
          "sets": 5,
          "reps": "1 rep",
          "rest": "2-3 min",
          "notes": "Work up to 80-85% 1RM with crisp speed."
        },
        {
          "name": "Overhead Squat",
          "sets": 3,
          "reps": "3 reps (with 3-sec pause)",
          "rest": "2 min",
          "notes": "Pause 3 seconds at bottom, lock shoulders, drive up."
        },
        {
          "name": "Snatch Pulls",
          "sets": 4,
          "reps": "3 reps (at 100% Snatch)",
          "rest": "2 min",
          "notes": "Reinforce leg drive and vertical torso finish."
        }
      ]
    },
    "tuesday": {
      "focus": "Clean & Jerk Progression & Heavy Front Squats",
      "exercises": [
        {
          "name": "Clean Complex (Hang Clean + Front Squat + Jerk)",
          "sets": 5,
          "reps": "1+1+1",
          "rest": "2-3 min",
          "notes": "Solid rack position, upright dip, sharp split jerk."
        },
        {
          "name": "Full Clean & Jerk from Floor",
          "sets": 5,
          "reps": "1 rep",
          "rest": "3 min",
          "notes": "Build to heavy clean and jerk single."
        },
        {
          "name": "Barbell Front Squat",
          "sets": 4,
          "reps": "3 reps",
          "rest": "3 min",
          "notes": "Elbows parallel to floor, maintain vertical chest."
        },
        {
          "name": "Clean Pulls",
          "sets": 4,
          "reps": "3 reps (at 105% Clean)",
          "rest": "2 min",
          "notes": "Explode through balls of feet, high shrug."
        }
      ]
    },
    "wednesday": {
      "focus": "Active Recovery & Thoracic Spine Mobility",
      "exercises": [
        {
          "name": "Wrist & Tricep Front Rack Stretch",
          "sets": 3,
          "reps": "60 sec/arm",
          "rest": "30 sec",
          "notes": "Enable effortless front rack position."
        },
        {
          "name": "Ankle Dorsiflexion Banded Distraction",
          "sets": 3,
          "reps": "15 reps/ankle",
          "rest": "30 sec",
          "notes": "Improve deep Olympic squat depth."
        },
        {
          "name": "Thoracic Roller Extensions",
          "sets": 3,
          "reps": "10 reps",
          "rest": "30 sec",
          "notes": "Maintain thoracic extension in overhead squats."
        }
      ]
    },
    "thursday": {
      "focus": "Power Snatch, Blocks & Technique",
      "exercises": [
        {
          "name": "Power Snatch from Blocks",
          "sets": 5,
          "reps": "2 reps",
          "rest": "2 min",
          "notes": "Catch above parallel, focus on speed under the bar."
        },
        {
          "name": "Snatch High Pulls",
          "sets": 4,
          "reps": "3 reps",
          "rest": "90 sec",
          "notes": "Keep bar close to body, elbows high and outside."
        },
        {
          "name": "Muscle Snatch",
          "sets": 3,
          "reps": "5 reps",
          "rest": "90 sec",
          "notes": "Strict turnover without rebending knees."
        },
        {
          "name": "Back Squat with 2-Second Pause",
          "sets": 4,
          "reps": "3 reps",
          "rest": "3 min",
          "notes": "Eliminate stretch reflex in hole."
        }
      ]
    },
    "friday": {
      "focus": "Push Press, Split Jerk & Core",
      "exercises": [
        {
          "name": "Push Press from Rack",
          "sets": 4,
          "reps": "4 reps",
          "rest": "2 min",
          "notes": "Smooth knee dip, violent hip drive, lock out overhead."
        },
        {
          "name": "Split Jerk from Blocks",
          "sets": 5,
          "reps": "2 reps",
          "rest": "2 min",
          "notes": "Focus on wide split balance, front shin vertical."
        },
        {
          "name": "Jerk Drives",
          "sets": 3,
          "reps": "4 reps (at 110% Jerk)",
          "rest": "90 sec",
          "notes": "Overload dip and drive mechanics."
        },
        {
          "name": "Heavy Barbell Good Mornings",
          "sets": 3,
          "reps": "8 reps",
          "rest": "90 sec",
          "notes": "Strengthen posterior chain and back erectors."
        },
        {
          "name": "GHD Sit-Ups or Hanging Leg Raises",
          "sets": 3,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Anti-extension core strength."
        }
      ]
    },
    "saturday": {
      "focus": "Olympic Back Squat Overload",
      "exercises": [
        {
          "name": "High-Bar Olympic Back Squat",
          "sets": 5,
          "reps": "3 reps",
          "rest": "3 min",
          "notes": "Deepest possible squat, vertical posture, bounce out of hole."
        },
        {
          "name": "Barbell Romanian Deadlift",
          "sets": 3,
          "reps": "8 reps",
          "rest": "2 min",
          "notes": "Hamstring and grip strength."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Rest Day",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-017",
    "planName": "5-Day Body Recomposition (Fat Loss & Lean Muscle)",
    "goal": "Body Fat Reduction & Muscle Preservation",
    "description": "Designed for individuals seeking to burn body fat while simultaneously building or preserving dense lean muscle mass through metabolic resistance and high-density compound training.",
    "isActive": true,
    "monday": {
      "focus": "Upper Body Strength & Density",
      "exercises": [
        {
          "name": "Barbell Flat Bench Press",
          "sets": 4,
          "reps": "6-8 reps",
          "rest": "90 sec",
          "notes": "Maintain heavy strength stimulus while in a calorie deficit."
        },
        {
          "name": "Chest-Supported Barbell Row",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "90 sec",
          "notes": "Strict contraction, pull bar to upper stomach."
        },
        {
          "name": "Seated Dumbbell Overhead Press",
          "sets": 3,
          "reps": "10 reps",
          "rest": "60 sec",
          "notes": "Full range overhead pressing."
        },
        {
          "name": "Lat Pulldown (Wide Grip)",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Squeeze lats at bottom."
        },
        {
          "name": "Dumbbell Lateral Raise (Superset)",
          "sets": 3,
          "reps": "15 reps",
          "rest": "30 sec",
          "notes": "Directly into tricep pushdowns."
        },
        {
          "name": "Tricep Cable Pushdown (Superset)",
          "sets": 3,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Complete arm density block."
        }
      ]
    },
    "tuesday": {
      "focus": "Lower Body Density & Sled Conditioning",
      "exercises": [
        {
          "name": "Barbell Back Squat",
          "sets": 4,
          "reps": "6-8 reps",
          "rest": "2 min",
          "notes": "Heavy compound anchor to elevate metabolic output."
        },
        {
          "name": "Romanian Deadlift with Dumbbells",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Hamstring stretch, maintain neutral lumbar curve."
        },
        {
          "name": "Walking Lunges (Dumbbell)",
          "sets": 3,
          "reps": "12 steps/leg",
          "rest": "60 sec",
          "notes": "Keep moving, high heart rate burn."
        },
        {
          "name": "Lying Leg Curls",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "45 sec",
          "notes": "Short rest intervals for metabolic stress."
        },
        {
          "name": "Prowler Sled Push (Heavy)",
          "sets": 5,
          "reps": "25 meters",
          "rest": "60 sec",
          "notes": "Concentric quad burn without muscle damage."
        }
      ]
    },
    "wednesday": {
      "focus": "Zone 2 Cardio & Core Shred",
      "exercises": [
        {
          "name": "Incline Treadmill Walk (12% Incline, 3.2 MPH)",
          "sets": 1,
          "reps": "35 mins",
          "rest": "None",
          "notes": "Zone 2 fat oxidation sweet spot (HR 125-135 bpm)."
        },
        {
          "name": "Hanging Leg Raises",
          "sets": 3,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Controlled abdominal compression."
        },
        {
          "name": "Russian Twists with 10lb Plate",
          "sets": 3,
          "reps": "20 reps",
          "rest": "30 sec",
          "notes": "Oblique rotational stability."
        }
      ]
    },
    "thursday": {
      "focus": "Upper Body Hypertrophy & Giant Sets",
      "exercises": [
        {
          "name": "Incline Dumbbell Bench Press",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Clavicular head growth, deep stretch."
        },
        {
          "name": "One-Arm Dumbbell Row",
          "sets": 4,
          "reps": "10-12 reps/arm",
          "rest": "60 sec",
          "notes": "Strict back isolation."
        },
        {
          "name": "Cable Pec Flyes",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "45 sec",
          "notes": "Constant tension on inner chest."
        },
        {
          "name": "Cable Face Pulls",
          "sets": 4,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Rear delt and posture booster."
        },
        {
          "name": "Incline Dumbbell Curls",
          "sets": 3,
          "reps": "12 reps",
          "rest": "45 sec",
          "notes": "Bicep peak pump."
        },
        {
          "name": "Overhead Rope Tricep Extension",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "45 sec",
          "notes": "Tricep long head burnout."
        }
      ]
    },
    "friday": {
      "focus": "Lower Body Volume & Glute/Hamstring",
      "exercises": [
        {
          "name": "Barbell Hip Thrust",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "2-second contraction at top lockout."
        },
        {
          "name": "Leg Press Machine",
          "sets": 3,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "High rep metabolic burn."
        },
        {
          "name": "Leg Extensions",
          "sets": 3,
          "reps": "15-20 reps",
          "rest": "45 sec",
          "notes": "Quad pump."
        },
        {
          "name": "Standing Calf Raise",
          "sets": 4,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Calf density."
        },
        {
          "name": "Kettlebell Swing Finisher",
          "sets": 4,
          "reps": "20 reps",
          "rest": "45 sec",
          "notes": "Posterior chain metabolic surge."
        }
      ]
    },
    "saturday": {
      "focus": "Metabolic HIIT Finisher Circuit",
      "exercises": [
        {
          "name": "Rowing Machine 250m Sprints",
          "sets": 6,
          "reps": "250m",
          "rest": "45 sec",
          "notes": "Sub-45s splits, all-out effort."
        },
        {
          "name": "Battle Ropes Alternating Waves",
          "sets": 4,
          "reps": "30 sec",
          "rest": "30 sec",
          "notes": "Upper body anaerobic power."
        },
        {
          "name": "Box Jump Overs",
          "sets": 4,
          "reps": "10 reps",
          "rest": "45 sec",
          "notes": "Calorie burning plyometrics."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Rest & Nutrition Prep",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-018",
    "planName": "4-Day Kettlebell Hardstyle Mastery & GPP",
    "goal": "Functional Power, Endurance & Posterior Strength",
    "description": "Pavel Tsatsouline inspired StrongFirst Hardstyle kettlebell protocol. Focuses on hip snap power, ballistic tension/relaxation cycles, and full-body structural durability.",
    "isActive": true,
    "monday": {
      "focus": "Heavy Swings & Turkish Get-Ups (Simple & Sinister)",
      "exercises": [
        {
          "name": "One-Arm Hardstyle Kettlebell Swings",
          "sets": 10,
          "reps": "10 reps (5L / 5R)",
          "rest": "60 sec",
          "notes": "Explosive hip snap, plank at top, float kettlebell to chest height."
        },
        {
          "name": "Turkish Get-Up (Heavy Single Kettlebell)",
          "sets": 5,
          "reps": "1 rep/side",
          "rest": "90 sec",
          "notes": "Flawless step-by-step ascent and descent with eyes on kettlebell."
        },
        {
          "name": "Goblet Squats with Kettlebell",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "60 sec",
          "notes": "Hold kettlebell by horns, elbows inside knees at bottom."
        },
        {
          "name": "Kettlebell Halo",
          "sets": 3,
          "reps": "10 reps each direction",
          "rest": "45 sec",
          "notes": "Shoulder and cervical spine mobility."
        }
      ]
    },
    "tuesday": {
      "focus": "Double Kettlebell Clean & Press + Front Squats",
      "exercises": [
        {
          "name": "Double Kettlebell Clean & Military Press",
          "sets": 5,
          "reps": "5 reps",
          "rest": "2 min",
          "notes": "Clean to rack, crush handles, press overhead without leg drive."
        },
        {
          "name": "Double Kettlebell Front Squat",
          "sets": 5,
          "reps": "5 reps",
          "rest": "90 sec",
          "notes": "Breathe into abdomen, maintain vertical torso against double rack."
        },
        {
          "name": "Renegade Rows (Push-Up to Row)",
          "sets": 4,
          "reps": "6 reps/side",
          "rest": "60 sec",
          "notes": "Plank on kettlebells, anti-rotational row without rocking hips."
        },
        {
          "name": "Suitcase Deadlifts with Kettlebell",
          "sets": 3,
          "reps": "8 reps/side",
          "rest": "60 sec",
          "notes": "Unilateral hip hinge, strong oblique brace."
        }
      ]
    },
    "wednesday": {
      "focus": "Original Strength Resets & Joint Mobility",
      "exercises": [
        {
          "name": "Cross-Crawl & Baby Crawling Drills",
          "sets": 3,
          "reps": "2 mins continuous",
          "rest": "60 sec",
          "notes": "Cross-lateral neurological reboot and shoulder stability."
        },
        {
          "name": "Prying Goblet Squat & Hip Openers",
          "sets": 3,
          "reps": "60 sec hold",
          "rest": "30 sec",
          "notes": "Sink deep, pry knees open, take deep diaphragmatic breaths."
        }
      ]
    },
    "thursday": {
      "focus": "Kettlebell Snatches & Windmills",
      "exercises": [
        {
          "name": "Hardstyle Kettlebell Snatch (Speed Protocol)",
          "sets": 8,
          "reps": "10 reps (5L / 5R)",
          "rest": "60 sec",
          "notes": "Tame the arc, punch through at top, absorb down smoothly."
        },
        {
          "name": "Kettlebell Windmills",
          "sets": 4,
          "reps": "5 reps/side",
          "rest": "60 sec",
          "notes": "Lock out overhead, hinge hip, touch floor with free hand."
        },
        {
          "name": "Single-Leg Romanian Deadlift with Kettlebell",
          "sets": 3,
          "reps": "8 reps/leg",
          "rest": "60 sec",
          "notes": "Balance and hamstring posterior power."
        },
        {
          "name": "Bottoms-Up Kettlebell Overhead Carry",
          "sets": 3,
          "reps": "25 meters/arm",
          "rest": "60 sec",
          "notes": "Extreme grip, rotator cuff, and stability challenge."
        }
      ]
    },
    "friday": {
      "focus": "Armor Building Complex (ABC Routine)",
      "exercises": [
        {
          "name": "Dan John's Armor Building Complex (2 Cleans, 1 Press, 3 Squats)",
          "sets": 10,
          "reps": "1 Complex",
          "rest": "75 sec",
          "notes": "Use matched pair of kettlebells. Build dense functional armor."
        },
        {
          "name": "Tactical Kettlebell Pull-Ups",
          "sets": 4,
          "reps": "6-8 reps",
          "rest": "90 sec",
          "notes": "Dead hang to chin over bar."
        },
        {
          "name": "Double Kettlebell Farmer's Walk",
          "sets": 4,
          "reps": "60 meters",
          "rest": "90 sec",
          "notes": "Max weight carries for posture and grip."
        }
      ]
    },
    "saturday": {
      "focus": "Kettlebell Conditioning & Core",
      "exercises": [
        {
          "name": "Kettlebell Swing Interval EMOM (Every Minute on Minute)",
          "sets": 10,
          "reps": "15 Swings/minute",
          "rest": "Remaining sec",
          "notes": "Sharp ballistic hip snaps."
        },
        {
          "name": "Strict Hanging Leg Raises",
          "sets": 3,
          "reps": "12 reps",
          "rest": "45 sec",
          "notes": "Decompress spine after overhead loading."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Rest Day",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-019",
    "planName": "3-Day Minimalist Dumbbell-Only Home Routine",
    "goal": "Home Fitness & Hypertrophy with Dumbbells",
    "description": "Tailored for trainees training at home with only a set of adjustable dumbbells and an adjustable bench. Maximizes mechanical tension and range of motion without fancy machines.",
    "isActive": true,
    "monday": {
      "focus": "Full Body Dumbbell Overload A",
      "exercises": [
        {
          "name": "Goblet Squat (Dumbbell)",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Hold dumbbell vertically at chest, sink hips below parallel, pause 1s."
        },
        {
          "name": "Flat Dumbbell Bench Press",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "90 sec",
          "notes": "Elbows at 45 degrees, full pectoral stretch, press up and slightly inward."
        },
        {
          "name": "Two-Arm Dumbbell Bent-Over Row",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Flat back, pull elbows up toward ceiling, squeeze lats and rhomboids."
        },
        {
          "name": "Standing Dumbbell Overhead Press",
          "sets": 3,
          "reps": "8-10 reps",
          "rest": "60 sec",
          "notes": "Brace glutes and core, press directly overhead."
        },
        {
          "name": "Dumbbell Hammer Curls",
          "sets": 3,
          "reps": "12 reps",
          "rest": "45 sec",
          "notes": "Palms facing each other, control the descent."
        },
        {
          "name": "Overhead Two-Arm Dumbbell Tricep Extension",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "45 sec",
          "notes": "Lower dumbbell behind neck, extend fully."
        }
      ]
    },
    "tuesday": {
      "focus": "Active Recovery Walk & Floor Abs",
      "exercises": [
        {
          "name": "Brisk Outdoor Walk",
          "sets": 1,
          "reps": "30-40 mins",
          "rest": "None",
          "notes": "Low-intensity steady state cardio to stimulate blood flow."
        },
        {
          "name": "Dead Bug Core Bracing",
          "sets": 3,
          "reps": "12 reps/side",
          "rest": "45 sec",
          "notes": "Keep lower back flat against floor, extend opposite arm and leg."
        },
        {
          "name": "Floor Glute Bridges",
          "sets": 3,
          "reps": "20 reps",
          "rest": "30 sec",
          "notes": "Squeeze glutes at top for 2 seconds."
        }
      ]
    },
    "wednesday": {
      "focus": "Full Body Dumbbell Overload B",
      "exercises": [
        {
          "name": "Dumbbell Romanian Deadlift",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Hinge backwards at hips, dumbbells track close to shins, soft knee bend."
        },
        {
          "name": "Incline Dumbbell Bench Press",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Target upper chest, full stretch at bottom."
        },
        {
          "name": "Single-Arm Dumbbell Row",
          "sets": 3,
          "reps": "10-12 reps/arm",
          "rest": "60 sec",
          "notes": "Brace on bench, pull smoothly to hip crease."
        },
        {
          "name": "Dumbbell Bulgarian Split Squat",
          "sets": 3,
          "reps": "10 reps/leg",
          "rest": "90 sec",
          "notes": "Rear foot on bench or chair, sink front thigh parallel to floor."
        },
        {
          "name": "Dumbbell Lateral Raise",
          "sets": 4,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Strict form, slight forward torso lean."
        },
        {
          "name": "Plank Hold",
          "sets": 3,
          "reps": "60 sec",
          "rest": "45 sec",
          "notes": "Draw navel to spine, squeeze glutes."
        }
      ]
    },
    "thursday": {
      "focus": "Postural Stretches & Mobility Flow",
      "exercises": [
        {
          "name": "Couch Stretch for Hip Flexors",
          "sets": 3,
          "reps": "60 sec/side",
          "rest": "30 sec",
          "notes": "Release hip tension from sitting and lunges."
        },
        {
          "name": "Cat-Cow & Thread-the-Needle",
          "sets": 3,
          "reps": "10 reps/side",
          "rest": "30 sec",
          "notes": "Spinal articulation and thoracic mobility."
        }
      ]
    },
    "friday": {
      "focus": "Full Body Dumbbell Overload C",
      "exercises": [
        {
          "name": "Dumbbell Front Squat",
          "sets": 4,
          "reps": "10 reps",
          "rest": "90 sec",
          "notes": "Rest dumbbells on shoulders, maintain upright chest."
        },
        {
          "name": "Dumbbell Floor Press",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Pause triceps lightly on floor before pressing up."
        },
        {
          "name": "Dumbbell Pullover",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Crosswise on bench, expand ribcage, feel stretch in lats."
        },
        {
          "name": "Dumbbell Step-Ups (onto Bench)",
          "sets": 3,
          "reps": "10 reps/leg",
          "rest": "60 sec",
          "notes": "Drive through lead heel, do not push off back foot."
        },
        {
          "name": "Incline Dumbbell Bicep Curl",
          "sets": 3,
          "reps": "12 reps",
          "rest": "45 sec",
          "notes": "Full elbow extension on incline bench."
        },
        {
          "name": "Dumbbell Kickbacks",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "45 sec",
          "notes": "Lock upper arm parallel to torso, squeeze tricep at extension."
        }
      ]
    },
    "saturday": {
      "focus": "Bodyweight Circuit & Core Burnout",
      "exercises": [
        {
          "name": "Bodyweight Push-Ups",
          "sets": 3,
          "reps": "15-20 reps",
          "rest": "45 sec",
          "notes": "Strict chest to deck push-ups."
        },
        {
          "name": "Bodyweight Air Squats",
          "sets": 3,
          "reps": "25 reps",
          "rest": "45 sec",
          "notes": "Continuous movement, keep heart rate elevated."
        },
        {
          "name": "Bicycle Crunches",
          "sets": 3,
          "reps": "20 reps/side",
          "rest": "30 sec",
          "notes": "Alternate elbow to opposite knee, rotate through core."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Rest Day",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-020",
    "planName": "4-Day Marathon & Distance Runner's Strength Armor",
    "goal": "Injury Prevention & Running Economy",
    "description": "Built for long-distance runners to bulletproof knees, ankles, hips, and calves. Improves running economy, stride power, and prevents common overuse injuries like IT band syndrome and shin splints.",
    "isActive": true,
    "monday": {
      "focus": "Unilateral Leg Strength & Pelvic Stability",
      "exercises": [
        {
          "name": "Single-Leg Bulgarian Split Squats",
          "sets": 3,
          "reps": "8-10 reps/leg",
          "rest": "90 sec",
          "notes": "Strengthen quad and glute unilaterally to eliminate stride asymmetry."
        },
        {
          "name": "Single-Leg Romanian Deadlift (Kettlebell)",
          "sets": 3,
          "reps": "8-10 reps/leg",
          "rest": "60 sec",
          "notes": "Hamstring resilience and balance on the standing foot."
        },
        {
          "name": "Step-Downs off 6-Inch Box",
          "sets": 3,
          "reps": "12 reps/leg",
          "rest": "45 sec",
          "notes": "Control knee valgus, tap opposite heel softly, quad eccentric control."
        },
        {
          "name": "Side-Lying Clamshells with Band",
          "sets": 3,
          "reps": "20 reps/side",
          "rest": "30 sec",
          "notes": "Gluteus medius firing to prevent IT band friction."
        },
        {
          "name": "Standing Deficit Calf Raises",
          "sets": 4,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Gastrocnemius and Achilles tendon stiffness."
        }
      ]
    },
    "tuesday": {
      "focus": "Upper Body Posture, Ribcage Mobility & Core",
      "exercises": [
        {
          "name": "Chest-Supported Dumbbell Row",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Keep thoracic spine upright during fatigue on late race miles."
        },
        {
          "name": "Half-Kneeling Overhead Dumbbell Press",
          "sets": 3,
          "reps": "10 reps/side",
          "rest": "60 sec",
          "notes": "Maintain neutral pelvis while pressing overhead."
        },
        {
          "name": "Push-Ups with Plus (Scapular Protraction)",
          "sets": 3,
          "reps": "12 reps",
          "rest": "45 sec",
          "notes": "Serratus anterior strength for arm carriage efficiency."
        },
        {
          "name": "Paloff Press Core Anti-Rotation",
          "sets": 3,
          "reps": "12 reps/side",
          "rest": "45 sec",
          "notes": "Resist rotational torque during running stride."
        },
        {
          "name": "Bird-Dog Extensions",
          "sets": 3,
          "reps": "10 reps/side",
          "rest": "30 sec",
          "notes": "Cross-body sling core endurance."
        }
      ]
    },
    "wednesday": {
      "focus": "Recovery Spin & Foam Rolling",
      "exercises": [
        {
          "name": "Stationary Bike Zone 1 Spin",
          "sets": 1,
          "reps": "25-30 mins",
          "rest": "None",
          "notes": "Flush metabolic waste without pounding joints."
        },
        {
          "name": "Foam Roll Quads, IT Bands & Calves",
          "sets": 1,
          "reps": "15 mins",
          "rest": "None",
          "notes": "Release fascial restrictions."
        }
      ]
    },
    "thursday": {
      "focus": "Posterior Chain Power & Achilles/Ankle Stiffness",
      "exercises": [
        {
          "name": "Barbell Trap Bar Deadlift",
          "sets": 4,
          "reps": "6 reps",
          "rest": "2 min",
          "notes": "Build raw hip extension force for uphill running."
        },
        {
          "name": "Nordic Hamstring Curls (Assisted)",
          "sets": 3,
          "reps": "6 reps",
          "rest": "90 sec",
          "notes": "Eccentric hamstring strengthening to prevent sprint pulls."
        },
        {
          "name": "Soleus Seated Calf Raise (Bent Knee)",
          "sets": 4,
          "reps": "15-20 reps",
          "rest": "45 sec",
          "notes": "Soleus absorbs up to 8x bodyweight during distance running."
        },
        {
          "name": "Pogo Hops (Ankle Stiffness Drills)",
          "sets": 3,
          "reps": "30 sec continuous",
          "rest": "45 sec",
          "notes": "Elastic energy return in the Achilles tendon."
        },
        {
          "name": "Tibialis Anterior Toe Raises against Wall",
          "sets": 3,
          "reps": "25 reps",
          "rest": "30 sec",
          "notes": "Prevent shin splints and strengthen front ankle."
        }
      ]
    },
    "friday": {
      "focus": "Rotational Core Endurance & Diaphragm Training",
      "exercises": [
        {
          "name": "Side Plank with Leg Abduction",
          "sets": 3,
          "reps": "30 sec/side",
          "rest": "45 sec",
          "notes": "Lateral chain stability for pelvic drop prevention."
        },
        {
          "name": "Suitcase Carry with Heavy Kettlebell",
          "sets": 4,
          "reps": "40 meters/side",
          "rest": "60 sec",
          "notes": "Anti-lateral flexion under fatigue."
        },
        {
          "name": "Crocodile Diaphragmatic Breathing Drills",
          "sets": 1,
          "reps": "5 mins",
          "rest": "None",
          "notes": "Expand ribcage 360 degrees for enhanced VO2 ventilation."
        }
      ]
    },
    "saturday": {
      "focus": "Long Run Prep & Dynamic Activation",
      "exercises": [
        {
          "name": "Leg Swings (Front-to-Back & Lateral)",
          "sets": 2,
          "reps": "15 reps/leg",
          "rest": "None",
          "notes": "Dynamic warmup before Saturday long run."
        },
        {
          "name": "Walking High Knees & Butt Kicks",
          "sets": 2,
          "reps": "20 yards",
          "rest": "None",
          "notes": "Cadence primer and nervous system prep."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Rest & Foot Care",
      "exercises": [
        {
          "name": "Golf Ball Foot Arch Roll",
          "sets": 1,
          "reps": "5 mins/foot",
          "rest": "None",
          "notes": "Plantar fascia release and relaxation."
        }
      ]
    }
  },
  {
    "workoutPlanId": "WPL-021",
    "planName": "5-Day Desk Worker Posture & Spinal Health Restoration",
    "goal": "Postural Realignment, Pain Relief & Joint Health",
    "description": "Combats 'computer posture'—forward head carriage, rounded shoulders, anterior pelvic tilt, and weak glutes. Realigns the spine, strengthens postural stabilizers, and eliminates chronic stiffness.",
    "isActive": true,
    "monday": {
      "focus": "Thoracic Extension & Scapular Retraction",
      "exercises": [
        {
          "name": "Prone Cobra Holds",
          "sets": 4,
          "reps": "30 sec hold",
          "rest": "45 sec",
          "notes": "Lie on stomach, squeeze scapulae down and back, external arm rotation."
        },
        {
          "name": "Cable Face Pulls with External Rotation",
          "sets": 4,
          "reps": "15-20 reps",
          "rest": "45 sec",
          "notes": "Pull rope to forehead level, rotate thumbs backwards, squeeze rear delts."
        },
        {
          "name": "Chest-Supported Neutral Dumbbell Row",
          "sets": 3,
          "reps": "12 reps",
          "rest": "60 sec",
          "notes": "Pull into ribs, strengthen middle trapezius and rhomboids."
        },
        {
          "name": "Foam Roller Thoracic Spine Extensions",
          "sets": 3,
          "reps": "10 extensions",
          "rest": "30 sec",
          "notes": "Support head, extend over roller at mid-back segments."
        },
        {
          "name": "Chin Tucks against Wall",
          "sets": 3,
          "reps": "12 reps (5s hold)",
          "rest": "30 sec",
          "notes": "Strengthen deep neck flexors to reverse forward head posture."
        }
      ]
    },
    "tuesday": {
      "focus": "Glute Awakening & Hip Flexor Decompression",
      "exercises": [
        {
          "name": "Couch Stretch (Hip Flexor & Psoas)",
          "sets": 3,
          "reps": "60 sec/side",
          "rest": "30 sec",
          "notes": "Squeeze rear glute to release chronically shortened psoas."
        },
        {
          "name": "Barbell Glute Bridge",
          "sets": 4,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Reawaken glutes after long hours sitting, hold top 2 seconds."
        },
        {
          "name": "Standing Cable Hip Extension",
          "sets": 3,
          "reps": "15 reps/leg",
          "rest": "45 sec",
          "notes": "Isolate gluteus maximus without arching lumbar spine."
        },
        {
          "name": "Goblet Squats (Slow 3s Descent)",
          "sets": 3,
          "reps": "10 reps",
          "rest": "60 sec",
          "notes": "Promote upright chest and ankle dorsiflexion."
        },
        {
          "name": "Cat-Cow Dynamic Pelvic Tilting",
          "sets": 3,
          "reps": "12 reps",
          "rest": "30 sec",
          "notes": "Restore motor control over anterior and posterior pelvic tilts."
        }
      ]
    },
    "wednesday": {
      "focus": "Deep Core Bracing & Anti-Extension Stability",
      "exercises": [
        {
          "name": "Dead Bug with Core Tension",
          "sets": 4,
          "reps": "10 reps/side",
          "rest": "45 sec",
          "notes": "Press opposite hand into knee, keep lower back glued to floor."
        },
        {
          "name": "Bird Dog with 3-Second Pause",
          "sets": 3,
          "reps": "10 reps/side",
          "rest": "30 sec",
          "notes": "Maintain level hips and neutral spine."
        },
        {
          "name": "Side Plank with Top Arm Reach",
          "sets": 3,
          "reps": "30-45 sec/side",
          "rest": "45 sec",
          "notes": "Quadratus lumborum and lateral oblique endurance."
        },
        {
          "name": "Farmer's Walk (Moderate Weight)",
          "sets": 3,
          "reps": "50 meters",
          "rest": "60 sec",
          "notes": "Walk with tall posture, open chest, level shoulders."
        }
      ]
    },
    "thursday": {
      "focus": "Scapular Upward Rotation & Posterior Delts",
      "exercises": [
        {
          "name": "Wall Slides with Foam Roller",
          "sets": 4,
          "reps": "10 reps",
          "rest": "45 sec",
          "notes": "Press forearms into roller, slide up wall, feel serratus anterior."
        },
        {
          "name": "Band Pull-Aparts (High, Mid, Low)",
          "sets": 4,
          "reps": "15 reps each angle",
          "rest": "30 sec",
          "notes": "Fire lower traps and posterior shoulder stabilizers."
        },
        {
          "name": "Incline Dumbbell Y-Raises",
          "sets": 3,
          "reps": "12 reps",
          "rest": "45 sec",
          "notes": "Thumbs up, lift at 45 degrees to target lower trapezius."
        },
        {
          "name": "Pec Doorway Stretch",
          "sets": 3,
          "reps": "45 sec",
          "rest": "30 sec",
          "notes": "Open tight pectoralis minor and major."
        }
      ]
    },
    "friday": {
      "focus": "Posterior Chain Awakening & Quad Strengthening",
      "exercises": [
        {
          "name": "Romanian Deadlift (Dumbbells)",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Reinforce proper hip hinge mechanics for lifting objects safely."
        },
        {
          "name": "Split Squats (Elevated Front Foot)",
          "sets": 3,
          "reps": "10 reps/leg",
          "rest": "60 sec",
          "notes": "Promote hip mobility and knee tracking."
        },
        {
          "name": "Resistance Band Monster Walks",
          "sets": 3,
          "reps": "20 steps forward & back",
          "rest": "30 sec",
          "notes": "Fire gluteus medius for pelvic levelness."
        },
        {
          "name": "Overhead Squat with Broomstick/Band",
          "sets": 3,
          "reps": "10 reps",
          "rest": "45 sec",
          "notes": "Full kinetic chain integration."
        }
      ]
    },
    "saturday": {
      "focus": "Full-Body Gentle Yoga & Mobility Flow",
      "exercises": [
        {
          "name": "Sun Salutation Yoga Flow",
          "sets": 5,
          "reps": "Continuous flow",
          "rest": "60 sec",
          "notes": "Move with breath, lengthen hamstrings and spine."
        },
        {
          "name": "Child's Pose with Lat Reach",
          "sets": 3,
          "reps": "45 sec/side",
          "rest": "30 sec",
          "notes": "Deep relaxation and lower back decompression."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Rest & Ergonomic Check",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-022",
    "planName": "4-Day Senior Masters Longevity & Functional Independence (50+)",
    "goal": "Healthy Aging, Bone Density & Joint Longevity",
    "description": "Designed for masters athletes and older adults (50+) aiming to preserve muscle mass (sarcopenia prevention), boost bone mineral density, optimize balance, and ensure lifelong joint longevity.",
    "isActive": true,
    "monday": {
      "focus": "Balance, Hip Hinge & Leg Press",
      "exercises": [
        {
          "name": "Leg Press Machine (Moderate Weight)",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Safe knee tracking, controlled tempo, maintain bone density."
        },
        {
          "name": "Kettlebell Deadlift from Elevated Platform",
          "sets": 3,
          "reps": "8-10 reps",
          "rest": "90 sec",
          "notes": "Learn safe hip hinge without rounding lower back."
        },
        {
          "name": "Single-Leg Balance Stand (Eyes Open/Closed)",
          "sets": 3,
          "reps": "30 sec/leg",
          "rest": "30 sec",
          "notes": "Proprioceptive training to reduce fall risks."
        },
        {
          "name": "Seated Leg Extension Machine",
          "sets": 2,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Light resistance, strengthen patellar tendon and quads."
        },
        {
          "name": "Calf Raises on Flat Floor",
          "sets": 3,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Ankle strength and calf pump."
        }
      ]
    },
    "tuesday": {
      "focus": "Upper Body Push-Pull with Resistance Machines",
      "exercises": [
        {
          "name": "Chest Press Machine",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Fixed path protects rotator cuff while stimulating pectorals."
        },
        {
          "name": "Seated Cable Row",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Pull handles to abdomen, sit tall with proud chest."
        },
        {
          "name": "Lat Pulldown Machine (Wide Neutral)",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Vertical pulling for lat and upper back strength."
        },
        {
          "name": "Standing Dumbbell Bicep Curls",
          "sets": 2,
          "reps": "12 reps",
          "rest": "45 sec",
          "notes": "Functional arm pulling capacity."
        },
        {
          "name": "Cable Tricep Pushdown",
          "sets": 2,
          "reps": "12 reps",
          "rest": "45 sec",
          "notes": "Tricep strength for pushing out of chairs."
        }
      ]
    },
    "wednesday": {
      "focus": "Low-Impact Aquatic or Brisk Walking Cardio",
      "exercises": [
        {
          "name": "Brisk Outdoor Walk or Pool Walking",
          "sets": 1,
          "reps": "30 mins",
          "rest": "None",
          "notes": "Cardiovascular health, joint lubrication, zero impact."
        },
        {
          "name": "Gentle Neck and Shoulder Rolls",
          "sets": 2,
          "reps": "10 reps each",
          "rest": "None",
          "notes": "Relieve upper body stiffness."
        }
      ]
    },
    "thursday": {
      "focus": "Sit-to-Stand Mastery & Rotational Balance",
      "exercises": [
        {
          "name": "Chair Sit-to-Stand (Box Squats)",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Crucial functional independence drill: stand up without using hands."
        },
        {
          "name": "Farmer's Walk with Light Dumbbells",
          "sets": 3,
          "reps": "30 meters",
          "rest": "60 sec",
          "notes": "Posture, grip strength, and gait stabilization."
        },
        {
          "name": "Standing Cable Paloff Press",
          "sets": 3,
          "reps": "10 reps/side",
          "rest": "45 sec",
          "notes": "Core stability without spinal flexion."
        },
        {
          "name": "Resistance Band Pull-Aparts",
          "sets": 3,
          "reps": "15 reps",
          "rest": "30 sec",
          "notes": "Reverse rounded shoulders, strengthen posterior delts."
        }
      ]
    },
    "friday": {
      "focus": "Core Integrity & Grip Foundations",
      "exercises": [
        {
          "name": "Bird Dog on Mat",
          "sets": 3,
          "reps": "8 reps/side",
          "rest": "30 sec",
          "notes": "Back-safe core stabilizer."
        },
        {
          "name": "Dead Bug Floor Holds",
          "sets": 3,
          "reps": "8 reps/side",
          "rest": "30 sec",
          "notes": "Anterior core activation."
        },
        {
          "name": "Hand Grip Strengthener Squeezes",
          "sets": 3,
          "reps": "15 reps/hand",
          "rest": "30 sec",
          "notes": "Grip strength correlates directly with longevity metrics."
        }
      ]
    },
    "saturday": {
      "focus": "Gentle Mobility & Static Stretching",
      "exercises": [
        {
          "name": "Hamstring Doorway Stretch",
          "sets": 2,
          "reps": "60 sec/leg",
          "rest": "30 sec",
          "notes": "Keep leg straight, stretch posterior chain."
        },
        {
          "name": "Chest & Bicep Wall Stretch",
          "sets": 2,
          "reps": "45 sec/side",
          "rest": "30 sec",
          "notes": "Open ribcage and improve breathing volume."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Rest & Family Vitality",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-023",
    "planName": "5-Day Time-Crunched 30-Minute Express Protocol",
    "goal": "Maximum Muscle Stimulus Under 30 Minutes",
    "description": "Built for busy executives and professionals who have only 30 minutes to train. Uses antagonist supersets and density training to deliver maximum hypertrophy in minimal time.",
    "isActive": true,
    "monday": {
      "focus": "Antagonistic Upper Body Supersets (Chest & Back)",
      "exercises": [
        {
          "name": "Flat Dumbbell Press (Superset 1A)",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "0 sec",
          "notes": "Move immediately to one-arm dumbbell rows."
        },
        {
          "name": "One-Arm Dumbbell Row (Superset 1B)",
          "sets": 4,
          "reps": "8-10 reps/arm",
          "rest": "60 sec",
          "notes": "Repeat superset for 4 total rounds."
        },
        {
          "name": "Incline Dumbbell Press (Superset 2A)",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "0 sec",
          "notes": "Move immediately to cable lat pulldowns."
        },
        {
          "name": "Lat Pulldown (Superset 2B)",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Complete 3 rounds in under 10 minutes."
        },
        {
          "name": "Push-Up to Failure Finisher",
          "sets": 1,
          "reps": "AMRAP",
          "rest": "None",
          "notes": "Burn out remaining pec fibers."
        }
      ]
    },
    "tuesday": {
      "focus": "Lower Body Density Giant Sets",
      "exercises": [
        {
          "name": "Goblet Squats (Giant Set A)",
          "sets": 4,
          "reps": "10 reps",
          "rest": "0 sec",
          "notes": "Immediate transition to dumbbell Romanian deadlift."
        },
        {
          "name": "Dumbbell Romanian Deadlift (Giant Set B)",
          "sets": 4,
          "reps": "10 reps",
          "rest": "0 sec",
          "notes": "Immediate transition to bodyweight lunges."
        },
        {
          "name": "Walking Lunges (Giant Set C)",
          "sets": 4,
          "reps": "12 steps total",
          "rest": "75 sec",
          "notes": "Brutal 3-exercise leg block. 4 rounds total in 20 minutes."
        },
        {
          "name": "Standing Calf Raise Finisher",
          "sets": 2,
          "reps": "25 reps",
          "rest": "30 sec",
          "notes": "Rapid burn."
        }
      ]
    },
    "wednesday": {
      "focus": "Rest & 20-Min Brisk Walk",
      "exercises": [
        {
          "name": "Outdoor Brisk Walk",
          "sets": 1,
          "reps": "20 mins",
          "rest": "None",
          "notes": "Reset mind, elevate non-exercise activity thermogenesis (NEAT)."
        }
      ]
    },
    "thursday": {
      "focus": "Shoulders & Arms Express Supersets",
      "exercises": [
        {
          "name": "Standing Overhead Dumbbell Press (Superset 1A)",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "0 sec",
          "notes": "Directly into dumbbell lateral raises."
        },
        {
          "name": "Dumbbell Lateral Raise (Superset 1B)",
          "sets": 4,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Deltoid pump."
        },
        {
          "name": "Incline Dumbbell Bicep Curl (Superset 2A)",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "0 sec",
          "notes": "Directly into overhead tricep extensions."
        },
        {
          "name": "Overhead Dumbbell Tricep Extension (Superset 2B)",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Arm blast."
        },
        {
          "name": "Hammer Curls to Failure",
          "sets": 1,
          "reps": "AMRAP",
          "rest": "None",
          "notes": "Final arm pump."
        }
      ]
    },
    "friday": {
      "focus": "Posterior Chain & Core Blitz",
      "exercises": [
        {
          "name": "Trap Bar Deadlift",
          "sets": 4,
          "reps": "6-8 reps",
          "rest": "90 sec",
          "notes": "Heavy compound lift done with maximum focus."
        },
        {
          "name": "Kettlebell Swings (Superset 1A)",
          "sets": 3,
          "reps": "15 reps",
          "rest": "0 sec",
          "notes": "Ballistic hip snap into hanging knee raises."
        },
        {
          "name": "Hanging Knee Raises (Superset 1B)",
          "sets": 3,
          "reps": "12 reps",
          "rest": "60 sec",
          "notes": "Decompress spine and curl abs."
        }
      ]
    },
    "saturday": {
      "focus": "20-Minute Density EMOM Conditioning",
      "exercises": [
        {
          "name": "EMOM Min 1: 15 Kettlebell Swings",
          "sets": 5,
          "reps": "15 reps",
          "rest": "Remaining sec",
          "notes": "Complete swings in 20s, rest 40s."
        },
        {
          "name": "EMOM Min 2: 12 Burpees",
          "sets": 5,
          "reps": "12 reps",
          "rest": "Remaining sec",
          "notes": "Full chest to deck burpees."
        },
        {
          "name": "EMOM Min 3: 15 Goblet Squats",
          "sets": 5,
          "reps": "15 reps",
          "rest": "Remaining sec",
          "notes": "Continuous pacing."
        },
        {
          "name": "EMOM Min 4: 45-Second Plank Hold",
          "sets": 5,
          "reps": "45 sec hold",
          "rest": "15 sec",
          "notes": "Core endurance."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Rest Day",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-024",
    "planName": "4-Day Strongman & Odd-Object Raw Power",
    "goal": "Primal Strength, Grip Resilience & Work Capacity",
    "description": "Focuses on raw brute strength with unconventional implements: Axle bars, Log presses, Atlas stone simulators, Farmer's walks, and sandbag loads. For functional unstoppable power.",
    "isActive": true,
    "monday": {
      "focus": "Heavy Axle Deadlifts & Farmer's Carries",
      "exercises": [
        {
          "name": "Axle Bar Deadlift (Thick Bar)",
          "sets": 5,
          "reps": "3 reps",
          "rest": "3-4 min",
          "notes": "Double overhand grip on 2-inch bar, train supreme grip and pulling strength."
        },
        {
          "name": "Heavy Farmer's Walk",
          "sets": 5,
          "reps": "30 meters",
          "rest": "2 min",
          "notes": "Load 1.25x bodyweight total, upright carriage, rapid short strides."
        },
        {
          "name": "Deficit Axle Bar Stiff-Leg Deadlift",
          "sets": 3,
          "reps": "6 reps",
          "rest": "2 min",
          "notes": "Massive hamstring and spinal erector loading."
        },
        {
          "name": "Barbell Shrugs (Heavy Overload)",
          "sets": 4,
          "reps": "10 reps",
          "rest": "90 sec",
          "notes": "Pause at top for 2 seconds, thick upper back."
        },
        {
          "name": "Plate Pinch Grip Holds",
          "sets": 3,
          "reps": "Max time",
          "rest": "60 sec",
          "notes": "Pinch two 25lb plates smooth side out."
        }
      ]
    },
    "tuesday": {
      "focus": "Log Clean & Press + Stone Simulators",
      "exercises": [
        {
          "name": "Log Clean & Viper Press",
          "sets": 5,
          "reps": "3 reps",
          "rest": "3 min",
          "notes": "Lap log, explode hips, catch on chest, drive overhead in one fluid motion."
        },
        {
          "name": "Heavy Sandbag to Shoulder (150lb / 200lb)",
          "sets": 4,
          "reps": "4 reps/side",
          "rest": "2 min",
          "notes": "Bear hug sandbag off ground, pop hips, hoist onto shoulder."
        },
        {
          "name": "Incline Barbell Bench Press",
          "sets": 4,
          "reps": "6 reps",
          "rest": "2 min",
          "notes": "Shoulder and upper chest support strength."
        },
        {
          "name": "Dips (Heavy Weighted)",
          "sets": 3,
          "reps": "6-8 reps",
          "rest": "90 sec",
          "notes": "Tricep lockout power."
        },
        {
          "name": "Standing Ab Wheel Rollouts",
          "sets": 3,
          "reps": "8 reps",
          "rest": "60 sec",
          "notes": "Brace anterior core against heavy overhead extension."
        }
      ]
    },
    "wednesday": {
      "focus": "Active Recovery & Forearm Therapy",
      "exercises": [
        {
          "name": "Bucket of Rice Forearm Digs",
          "sets": 3,
          "reps": "60 sec",
          "rest": "30 sec",
          "notes": "Open and close hands in bucket of rice for extensor recovery."
        },
        {
          "name": "Thoracic Roller & Lat Decompression",
          "sets": 1,
          "reps": "15 mins",
          "rest": "None",
          "notes": "Restore upper body posture."
        }
      ]
    },
    "thursday": {
      "focus": "Heavy Sandbag Loads & Yoke Walks",
      "exercises": [
        {
          "name": "Yoke Walk (or Heavy Barbell Walk)",
          "sets": 5,
          "reps": "25 meters",
          "rest": "3 min",
          "notes": "Brace entire torso like concrete, fast rhythmic steps."
        },
        {
          "name": "Sandbag Over Bar Loads (to 52-inch bar)",
          "sets": 5,
          "reps": "3 reps",
          "rest": "2 min",
          "notes": "Lap sandbag, bear hug, extend hips to launch over yoke bar."
        },
        {
          "name": "Heavy Front Squat (Cross-Arm or Clean Grip)",
          "sets": 4,
          "reps": "4 reps",
          "rest": "2-3 min",
          "notes": "Leg drive to support odd-object carrying."
        },
        {
          "name": "Dumbbell Hammer Curls (Heavy)",
          "sets": 3,
          "reps": "8 reps",
          "rest": "60 sec",
          "notes": "Bicep tendon resilience for stone and bag lifting."
        }
      ]
    },
    "friday": {
      "focus": "Zercher Squats & Keg Carries",
      "exercises": [
        {
          "name": "Barbell Zercher Squats",
          "sets": 4,
          "reps": "5 reps",
          "rest": "3 min",
          "notes": "Cradle bar in crook of elbows, brace core, squat deep."
        },
        {
          "name": "Heavy Keg or Sandbag Bear Hug Carry",
          "sets": 4,
          "reps": "40 meters",
          "rest": "2 min",
          "notes": "Crush implement into ribcage, walk continuously."
        },
        {
          "name": "Close-Grip Axle Bar Bench Press",
          "sets": 3,
          "reps": "8 reps",
          "rest": "90 sec",
          "notes": "Tricep and chest strength."
        },
        {
          "name": "Farmer's Handle Deadlift Hold",
          "sets": 3,
          "reps": "30 sec hold",
          "rest": "90 sec",
          "notes": "Pure static grip test."
        }
      ]
    },
    "saturday": {
      "focus": "Grip Gauntlet & Tire Flips",
      "exercises": [
        {
          "name": "Tire Flips (500lb+ tire)",
          "sets": 4,
          "reps": "5 flips",
          "rest": "2 min",
          "notes": "Drive forward at 45 degree angle, knee under tire, push over."
        },
        {
          "name": "Towel Pull-Ups",
          "sets": 3,
          "reps": "Max reps",
          "rest": "60 sec",
          "notes": "Crush grip and lat development."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Rest & Caloric Refuel",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-025",
    "planName": "5-Day Combat Sports & Striking/Grappling Conditioning",
    "goal": "Combat Stamina, Rotational Power & Neck/Grip Resilience",
    "description": "Built for MMA fighters, boxers, and Brazilian Jiu-Jitsu athletes. Enhances rotational punching power, takedown hip drive, neck concussion resilience, and anaerobic gas tank.",
    "isActive": true,
    "monday": {
      "focus": "Rotational Power, Medicine Ball Throws & Core",
      "exercises": [
        {
          "name": "Rotational Med-Ball Shot-Put into Wall",
          "sets": 4,
          "reps": "6 reps/side",
          "rest": "60 sec",
          "notes": "Rear foot pivot, drive hip forward, violent punch release."
        },
        {
          "name": "Landmine Rotational Press",
          "sets": 4,
          "reps": "6 reps/side",
          "rest": "60 sec",
          "notes": "Explosive punch trajectory with barbell landmine."
        },
        {
          "name": "Barbell Trap Bar Deadlift (Speed Focus)",
          "sets": 4,
          "reps": "4 reps (at 70%)",
          "rest": "2 min",
          "notes": "Move bar with max speed to develop explosive hips."
        },
        {
          "name": "Cable Woodchoppers (High to Low)",
          "sets": 3,
          "reps": "10 reps/side",
          "rest": "45 sec",
          "notes": "Core rotational torque."
        },
        {
          "name": "4-Way Neck Machine or Harness (Neck Bridges)",
          "sets": 3,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Build cervical spine armor for concussion resistance."
        }
      ]
    },
    "tuesday": {
      "focus": "Grappler's Neck, Trap & Grip Strength",
      "exercises": [
        {
          "name": "Gi Pull-Ups (Gripping BJJ Gi draped over bar)",
          "sets": 4,
          "reps": "6-8 reps",
          "rest": "90 sec",
          "notes": "Train collar and sleeve grip strength under bodyweight load."
        },
        {
          "name": "Heavy Barbell Shrugs with 3-Second Hold",
          "sets": 4,
          "reps": "10 reps",
          "rest": "60 sec",
          "notes": "Protect neck and cervical spine against grappling cranks."
        },
        {
          "name": "Zercher Good Mornings",
          "sets": 3,
          "reps": "8 reps",
          "rest": "90 sec",
          "notes": "Posterior chain resilience inside the guard."
        },
        {
          "name": "Wrist Roller with Weight Plate",
          "sets": 3,
          "reps": "3 rolls up and down",
          "rest": "60 sec",
          "notes": "Forearm pump and grip durability."
        },
        {
          "name": "Plank with Alternating Knee-to-Elbow",
          "sets": 3,
          "reps": "12 reps/side",
          "rest": "45 sec",
          "notes": "Guard retention core mechanics."
        }
      ]
    },
    "wednesday": {
      "focus": "Aerobic Base & Heavy Bag Intervals",
      "exercises": [
        {
          "name": "Heavy Bag Striking (5 x 3-Minute Rounds)",
          "sets": 5,
          "reps": "3 mins",
          "rest": "60 sec",
          "notes": "Match championship fight pacing: sharp combinations and footwork."
        },
        {
          "name": "Jump Rope Footwork Drills",
          "sets": 1,
          "reps": "15 mins continuous",
          "rest": "None",
          "notes": "Light on toes, rhythm, calf elasticity."
        }
      ]
    },
    "thursday": {
      "focus": "Explosive Takedown Hips & Trap Bar Jumps",
      "exercises": [
        {
          "name": "Trap Bar Jump Squats (Light Load)",
          "sets": 4,
          "reps": "5 reps",
          "rest": "90 sec",
          "notes": "Violent upward hip drive mimicking a double-leg takedown."
        },
        {
          "name": "Barbell Hip Thrusts (Explosive)",
          "sets": 4,
          "reps": "8 reps",
          "rest": "90 sec",
          "notes": "Crucial for escaping bottom mount and bridging."
        },
        {
          "name": "Single-Arm Dumbbell Push Press",
          "sets": 3,
          "reps": "6 reps/arm",
          "rest": "60 sec",
          "notes": "Unilateral overhead combat power."
        },
        {
          "name": "Heavy Kettlebell Swings",
          "sets": 4,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Ballistic posterior chain snap."
        },
        {
          "name": "Russian Twists with Medicine Ball",
          "sets": 3,
          "reps": "25 reps",
          "rest": "45 sec",
          "notes": "Abdominal wall endurance under rotational load."
        }
      ]
    },
    "friday": {
      "focus": "Isometric Clinch Strength & Pulling Endurance",
      "exercises": [
        {
          "name": "Isometric Chest-Supported Row Hold",
          "sets": 4,
          "reps": "20 sec hold",
          "rest": "60 sec",
          "notes": "Simulate underhook and body lock crushing strength."
        },
        {
          "name": "Inverted Rows with Feet Elevated",
          "sets": 4,
          "reps": "12 reps",
          "rest": "60 sec",
          "notes": "Pulling endurance for submission setups."
        },
        {
          "name": "Sandbag Bear Hug Squats",
          "sets": 3,
          "reps": "10 reps",
          "rest": "90 sec",
          "notes": "Clinch pressure conditioning."
        },
        {
          "name": "Manual Neck Isometric Resisted Holds",
          "sets": 3,
          "reps": "15 sec all 4 sides",
          "rest": "30 sec",
          "notes": "Isometric neck stabilization."
        }
      ]
    },
    "saturday": {
      "focus": "Wrestling Conditioning & Sprawl Sprints",
      "exercises": [
        {
          "name": "Sprawl to 10-Yard Sprint Drills",
          "sets": 8,
          "reps": "1 rep",
          "rest": "45 sec",
          "notes": "Drop hips flat to floor, pop up instantly, sprint 10 yards."
        },
        {
          "name": "Air Bike All-Out Lactate Burst (20s on / 40s off)",
          "sets": 6,
          "reps": "20 sec",
          "rest": "40 sec",
          "notes": "Fight third-round lactic burn."
        }
      ]
    },
    "sunday": {
      "focus": "Contrast Showers & Full Rest",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-026",
    "planName": "4-Day Posterior Chain & Deadlift Specialization",
    "goal": "Deadlift Peak & Posterior Chain Hypertrophy",
    "description": "Laser-focused on building a monstrous deadlift and bulletproofing the entire posterior chain: glutes, hamstrings, spinal erectors, lats, and trapezius.",
    "isActive": true,
    "monday": {
      "focus": "Heavy Conventional Deadlift & Deficits",
      "exercises": [
        {
          "name": "Conventional Deadlift (Heavy Work Sets)",
          "sets": 4,
          "reps": "3 reps",
          "rest": "3-4 min",
          "notes": "Pull slack, push floor away, lock hips with glutes. 80-85% 1RM."
        },
        {
          "name": "Deficit Deadlift (Standing on 2-inch block)",
          "sets": 3,
          "reps": "5 reps",
          "rest": "2-3 min",
          "notes": "Increases leg drive off the floor and reinforces tight starting posture."
        },
        {
          "name": "Barbell Pendlay Row",
          "sets": 4,
          "reps": "6-8 reps",
          "rest": "2 min",
          "notes": "Explosive pull from floor, keeps upper back rigid on deadlifts."
        },
        {
          "name": "Glute-Ham Raise (GHR)",
          "sets": 3,
          "reps": "8-10 reps",
          "rest": "90 sec",
          "notes": "Eccentric hamstring control, pull up with hamstrings."
        },
        {
          "name": "Heavy Barbell Shrugs",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Trap density to support heavy lockout weight."
        }
      ]
    },
    "tuesday": {
      "focus": "Upper Body Push & Lat Stabilization",
      "exercises": [
        {
          "name": "Barbell Flat Bench Press",
          "sets": 4,
          "reps": "6 reps",
          "rest": "2 min",
          "notes": "Upper body strength balance."
        },
        {
          "name": "Overhead Barbell Military Press",
          "sets": 3,
          "reps": "8 reps",
          "rest": "2 min",
          "notes": "Lock out overhead with strong glute squeeze."
        },
        {
          "name": "Straight-Arm Cable Lat Pulldown",
          "sets": 4,
          "reps": "12 reps",
          "rest": "60 sec",
          "notes": "Teaches keeping the barbell pinned against thighs during deadlift."
        },
        {
          "name": "Face Pulls with Rope",
          "sets": 4,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Rear delt and external rotator reinforcement."
        }
      ]
    },
    "wednesday": {
      "focus": "Active Flushes & Hamstring Flossing",
      "exercises": [
        {
          "name": "Banded Hamstring Flossing",
          "sets": 3,
          "reps": "15 reps/leg",
          "rest": "30 sec",
          "notes": "Restore sciatic nerve glide and hamstring tissue quality."
        },
        {
          "name": "Foam Roll Glutes & Adductors",
          "sets": 1,
          "reps": "15 mins",
          "rest": "None",
          "notes": "Ease posterior chain tightness."
        }
      ]
    },
    "thursday": {
      "focus": "Block Pulls & Romanian Deadlifts",
      "exercises": [
        {
          "name": "Block Pulls (Bar at Mid-Shin)",
          "sets": 4,
          "reps": "4 reps",
          "rest": "3 min",
          "notes": "Overload lockout strength with 90-95% of conventional 1RM."
        },
        {
          "name": "Barbell Romanian Deadlift (Slow 4s Eccentric)",
          "sets": 3,
          "reps": "8 reps",
          "rest": "2 min",
          "notes": "Stretch hamstrings to their max length under heavy load."
        },
        {
          "name": "Chest-Supported T-Bar Row",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "90 sec",
          "notes": "Mid-back thickness without fatiguing spinal erectors."
        },
        {
          "name": "Seated Leg Curl Machine",
          "sets": 3,
          "reps": "12 reps",
          "rest": "60 sec",
          "notes": "Knee flexion balance."
        }
      ]
    },
    "friday": {
      "focus": "Barbell Good Mornings & Hip Thrusts",
      "exercises": [
        {
          "name": "Barbell Good Mornings (Slight Knee Bend)",
          "sets": 4,
          "reps": "8 reps",
          "rest": "2 min",
          "notes": "Hinge backwards, keep spinal erectors locked in extension."
        },
        {
          "name": "Barbell Hip Thrust",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "2 min",
          "notes": "Build glute lockout power for terminal deadlift extension."
        },
        {
          "name": "Reverse Hyperextension (or Back Extension)",
          "sets": 3,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Decompress lumbar spine and pump blood into erectors."
        },
        {
          "name": "Hanging Leg Raises",
          "sets": 3,
          "reps": "12 reps",
          "rest": "60 sec",
          "notes": "Decompress spine and train anterior core."
        }
      ]
    },
    "saturday": {
      "focus": "Farmer's Walks & Heavy Grip Endurance",
      "exercises": [
        {
          "name": "Heavy Trap Bar Farmer's Walk",
          "sets": 4,
          "reps": "40 meters",
          "rest": "2 min",
          "notes": "Build unbreakable grip so deadlift is never limited by hands."
        },
        {
          "name": "Static Barbell Holds in Power Rack",
          "sets": 3,
          "reps": "20-30 sec hold",
          "rest": "90 sec",
          "notes": "Hold heavy deadlift weight at lockout height."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Rest & Lumbar Decompression",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-027",
    "planName": "5-Day Arm & Shoulder Hypertrophy Blitz",
    "goal": "Bicep/Tricep Thickness & Cannonball Deltoids",
    "description": "An intensive specialization routine prioritizing upper arm circumference (biceps, triceps, brachialis) and 3D round deltoids with dedicated volume and isolation angles.",
    "isActive": true,
    "monday": {
      "focus": "Biceps & Triceps Antagonist Supersets",
      "exercises": [
        {
          "name": "Barbell EZ-Bar Curl (Superset 1A)",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "0 sec",
          "notes": "Heavy bicep mass, strict elbow placement."
        },
        {
          "name": "Close-Grip Bench Press (Superset 1B)",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "90 sec",
          "notes": "Hands 14 inches apart, tuck elbows to ribs."
        },
        {
          "name": "Incline Dumbbell Curl (Superset 2A)",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "0 sec",
          "notes": "Long head bicep stretch."
        },
        {
          "name": "Lying Tricep Skull Crusher (Superset 2B)",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Lower EZ-bar behind head for tricep long head."
        },
        {
          "name": "Preacher Curl Machine (Superset 3A)",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "0 sec",
          "notes": "Short head bicep peak."
        },
        {
          "name": "Cable Rope Pushdown (Superset 3B)",
          "sets": 3,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Spread ropes wide at bottom lockout."
        }
      ]
    },
    "tuesday": {
      "focus": "Deltoid Trifecta (Front, Lateral & Rear)",
      "exercises": [
        {
          "name": "Seated Dumbbell Shoulder Press",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "2 min",
          "notes": "Heavy overhead pressing base."
        },
        {
          "name": "Standing Dumbbell Lateral Raise (Heavy 5x5 + Drop)",
          "sets": 5,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Slight forward torso tilt, raise to parallel."
        },
        {
          "name": "Cable Egyptian Lateral Raise",
          "sets": 3,
          "reps": "15 reps/arm",
          "rest": "45 sec",
          "notes": "Continuous tension on side delts."
        },
        {
          "name": "Bent-Over Rear Delt Flyes on Incline Bench",
          "sets": 4,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Lead with elbows, squeeze rear delts."
        },
        {
          "name": "Barbell Upright Row (Wide Grip)",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Grip outside shoulder width to spare rotator cuff."
        }
      ]
    },
    "wednesday": {
      "focus": "Lower Body Maintenance & Core",
      "exercises": [
        {
          "name": "Barbell Back Squats",
          "sets": 4,
          "reps": "8 reps",
          "rest": "2 min",
          "notes": "Maintain leg size and systemic hormone output."
        },
        {
          "name": "Romanian Deadlift",
          "sets": 3,
          "reps": "10 reps",
          "rest": "90 sec",
          "notes": "Hamstring and glute maintenance."
        },
        {
          "name": "Standing Calf Raises",
          "sets": 4,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Calf volume."
        },
        {
          "name": "Hanging Knee Raises",
          "sets": 3,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Core compression."
        }
      ]
    },
    "thursday": {
      "focus": "Tricep Long Head & Brachialis Overload",
      "exercises": [
        {
          "name": "Overhead Dumbbell Tricep Extension (Single Heavy)",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Two hands on one dumbbell, deep stretch behind head."
        },
        {
          "name": "Cross-Body Hammer Curls",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Target brachialis muscle to push bicep peak higher."
        },
        {
          "name": "Parallel Bar Dips (Weighted)",
          "sets": 3,
          "reps": "8-10 reps",
          "rest": "90 sec",
          "notes": "Keep torso upright to isolate triceps."
        },
        {
          "name": "Reverse-Grip EZ-Bar Curls",
          "sets": 3,
          "reps": "12 reps",
          "rest": "60 sec",
          "notes": "Build brachioradialis and forearm thickness."
        },
        {
          "name": "Cable Single-Arm Tricep Kickback",
          "sets": 3,
          "reps": "15 reps/arm",
          "rest": "45 sec",
          "notes": "Peak tricep contraction at full extension."
        }
      ]
    },
    "friday": {
      "focus": "Bicep Peak & Lateral Delt Strict Dropsets",
      "exercises": [
        {
          "name": "Spider Curls with EZ-Bar",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Chest against 45-degree pad, eliminate all shoulder sway."
        },
        {
          "name": "Cable Lateral Raises (Behind Back)",
          "sets": 4,
          "reps": "12-15 reps/arm",
          "rest": "45 sec",
          "notes": "Cable passes behind body for maximum initial stretch."
        },
        {
          "name": "Concentration Curls",
          "sets": 3,
          "reps": "12 reps/arm",
          "rest": "45 sec",
          "notes": "Arnold style bicep peak isolation."
        },
        {
          "name": "Dumbbell Lateral Raise Running the Rack (Drop Set)",
          "sets": 1,
          "reps": "30 reps total",
          "rest": "None",
          "notes": "Start heavy for 8, drop 5lbs for 10, drop 5lbs to failure."
        },
        {
          "name": "Rope Face Pulls with Squeeze",
          "sets": 3,
          "reps": "20 reps",
          "rest": "45 sec",
          "notes": "Rear delt polish and postural balance."
        }
      ]
    },
    "saturday": {
      "focus": "Forearms, Wrist Flexion & Grip Mass",
      "exercises": [
        {
          "name": "Seated Barbell Wrist Curls (Palms Up)",
          "sets": 4,
          "reps": "15-20 reps",
          "rest": "45 sec",
          "notes": "Forearms resting on thighs, roll bar down to fingertips."
        },
        {
          "name": "Standing Barbell Behind-the-Back Wrist Curls",
          "sets": 3,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Forearm flexor thickness."
        },
        {
          "name": "Reverse Wrist Curls with Dumbbells",
          "sets": 3,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Forearm extensor mass."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Rest & Arm Recovery",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-028",
    "planName": "4-Day Functional Fitness & MetCon WOD Protocol",
    "goal": "Work Capacity, Functional Stamina & MetCon Power",
    "description": "Cross-training and functional conditioning program combining barbell cycling, gymnastics, and high-intensity metabolic conditioning (WODs) for elite total-body work capacity.",
    "isActive": true,
    "monday": {
      "focus": "Barbell Thrusters & Pull-Up MetCon Intervals",
      "exercises": [
        {
          "name": "Barbell Front Squat (Heavy Strength)",
          "sets": 4,
          "reps": "5 reps",
          "rest": "2-3 min",
          "notes": "Build solid squat foundation before the conditioning piece."
        },
        {
          "name": "Fran-Style MetCon: 21-15-9 Thrusters & Pull-Ups",
          "sets": 1,
          "reps": "21-15-9 reps for time",
          "rest": "None",
          "notes": "95lb barbell thrusters unbroken if possible, chest-to-bar pull-ups."
        },
        {
          "name": "Double-Under Jump Rope Intervals",
          "sets": 4,
          "reps": "50 reps",
          "rest": "60 sec",
          "notes": "Wrist speed and cardiovascular cadence."
        },
        {
          "name": "Toes-to-Bar Skill & Endurance",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Kip rhythmically or perform strict toes-to-bar."
        }
      ]
    },
    "tuesday": {
      "focus": "Olympic Lift EMOMs & Box Jumps",
      "exercises": [
        {
          "name": "Power Snatch EMOM (10 Minutes)",
          "sets": 10,
          "reps": "2 reps/minute (at 75%)",
          "rest": "Remaining sec",
          "notes": "Sharp technique under fatigue."
        },
        {
          "name": "24-Inch Plyometric Box Jumps",
          "sets": 4,
          "reps": "10 reps",
          "rest": "60 sec",
          "notes": "Step down to preserve Achilles tendons, explode up."
        },
        {
          "name": "Handstand Push-Up (HSPU) Strict Volume",
          "sets": 4,
          "reps": "6-8 reps",
          "rest": "90 sec",
          "notes": "Wall-supported, touch crown of head to ab-mat."
        },
        {
          "name": "Rowing Machine 500m Sprints",
          "sets": 3,
          "reps": "500m sprint",
          "rest": "90 sec",
          "notes": "Pace below 1:40/500m."
        }
      ]
    },
    "wednesday": {
      "focus": "Active Recovery Rowing & Joint Mobility",
      "exercises": [
        {
          "name": "Easy Concept2 Ergometer Row",
          "sets": 1,
          "reps": "20-25 mins",
          "rest": "None",
          "notes": "Pace 2:10/500m, focus on leg drive and long stroke."
        },
        {
          "name": "Pigeon Pose & Hip Opener Sequence",
          "sets": 2,
          "reps": "90 sec/side",
          "rest": "None",
          "notes": "Decompress tight glutes and hips."
        }
      ]
    },
    "thursday": {
      "focus": "Wall Balls, Kettlebell Swings & Burpees",
      "exercises": [
        {
          "name": "Deadlift 5x5 (Strength Anchor)",
          "sets": 5,
          "reps": "5 reps",
          "rest": "2-3 min",
          "notes": "Heavy conventional pull at 75-80% 1RM."
        },
        {
          "name": "MetCon: 20-Min AMRAP (Wall Balls, KB Swings, Burpees)",
          "sets": 1,
          "reps": "AMRAP in 20 mins",
          "rest": "None",
          "notes": "15 Wall Balls (20lb to 10ft target) + 15 American KB Swings (24kg) + 12 Burpees."
        },
        {
          "name": "GHD Sit-Ups (or AbMat Sit-Ups)",
          "sets": 3,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Full range core flexion."
        }
      ]
    },
    "friday": {
      "focus": "Heavy Deadlifts & Gymnastic Holds",
      "exercises": [
        {
          "name": "Clean and Jerk Heavy Single",
          "sets": 5,
          "reps": "1 rep",
          "rest": "2 min",
          "notes": "Technique work up to 85% 1RM."
        },
        {
          "name": "Bar Muscle-Ups / Chest-to-Bar Pull-Ups",
          "sets": 4,
          "reps": "5 reps",
          "rest": "90 sec",
          "notes": "Gymnastic pulling power."
        },
        {
          "name": "Ring Push-Ups (Feet Elevated)",
          "sets": 3,
          "reps": "12 reps",
          "rest": "60 sec",
          "notes": "Shoulder stability on unstable rings."
        },
        {
          "name": "L-Sit Ring Hold",
          "sets": 3,
          "reps": "20 sec hold",
          "rest": "60 sec",
          "notes": "Gymnastic core compression."
        }
      ]
    },
    "saturday": {
      "focus": "Hero WOD / Endurance Challenge",
      "exercises": [
        {
          "name": "Murph-Style Mini Challenge",
          "sets": 1,
          "reps": "For Time",
          "rest": "None",
          "notes": "800m Run + 50 Pull-Ups + 100 Push-Ups + 150 Air Squats + 800m Run."
        },
        {
          "name": "Foam Roll & Post-WOD Walk",
          "sets": 1,
          "reps": "15 mins",
          "rest": "None",
          "notes": "Bring heart rate down gently."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Rest Day",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-029",
    "planName": "5-Day Chest & Back Torso Thickness Protocol",
    "goal": "Upper Body Thickness & Dense Torso Mass",
    "description": "Designed for lifters aiming to construct a dense, armor-plated torso. Balances heavy horizontal/vertical pushing with thick rowing to create incredible 3D chest and back depth.",
    "isActive": true,
    "monday": {
      "focus": "Upper Chest Clavicular Head & Incline Focus",
      "exercises": [
        {
          "name": "Incline Barbell Bench Press (Heavy)",
          "sets": 4,
          "reps": "6-8 reps",
          "rest": "2-3 min",
          "notes": "30-degree incline, touch upper chest smoothly, explode upward."
        },
        {
          "name": "Incline Dumbbell Bench Press",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "90 sec",
          "notes": "Deep stretch at bottom, squeeze upper pec shelf at top."
        },
        {
          "name": "Incline Cable Flyes (Low-to-High)",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Scoop cables upward along clavicular fibers."
        },
        {
          "name": "Dips (Weighted with Forward Lean)",
          "sets": 3,
          "reps": "8-10 reps",
          "rest": "90 sec",
          "notes": "Flared elbows and chest dip for lower pec outline."
        },
        {
          "name": "Push-Up Finisher on Handles",
          "sets": 2,
          "reps": "AMRAP",
          "rest": "60 sec",
          "notes": "Deep stretch push-ups to failure."
        }
      ]
    },
    "tuesday": {
      "focus": "Vertical Lat Width & Scapular Depression",
      "exercises": [
        {
          "name": "Wide-Grip Pull-Ups (Weighted)",
          "sets": 4,
          "reps": "6-8 reps",
          "rest": "2 min",
          "notes": "Full dead hang, pull chest to bar, squeeze lower lats."
        },
        {
          "name": "Close-Grip Neutral Lat Pulldown",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Pull V-bar down to collarbone, arch slightly."
        },
        {
          "name": "Single-Arm Half-Kneeling Cable Pulldown",
          "sets": 3,
          "reps": "12 reps/arm",
          "rest": "60 sec",
          "notes": "Drive elbow into hip pocket for extreme lat focus."
        },
        {
          "name": "Straight-Arm Rope Lat Pullover",
          "sets": 4,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Continuous lat tension, keep arms mostly straight."
        }
      ]
    },
    "wednesday": {
      "focus": "Active Recovery & Shoulder Health",
      "exercises": [
        {
          "name": "Band Dislocates & Over-and-Backs",
          "sets": 3,
          "reps": "15 reps",
          "rest": "30 sec",
          "notes": "Maintain healthy shoulder capsule after heavy pressing."
        },
        {
          "name": "Lying Foam Roller Chest Expansion",
          "sets": 1,
          "reps": "10 mins",
          "rest": "None",
          "notes": "Passive pectoral opening."
        }
      ]
    },
    "thursday": {
      "focus": "Flat & Decline Chest Mass Overload",
      "exercises": [
        {
          "name": "Flat Barbell Bench Press (Heavy)",
          "sets": 4,
          "reps": "5 reps",
          "rest": "3 min",
          "notes": "Pure horizontal pressing power, arch and plant feet."
        },
        {
          "name": "Flat Dumbbell Press",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "90 sec",
          "notes": "Deep stretch, rotate dumbbells slightly inward."
        },
        {
          "name": "Decline Hammer Strength Press",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Heavy lower pec contraction."
        },
        {
          "name": "Pec Deck Machine Flyes",
          "sets": 3,
          "reps": "15 reps + drop set",
          "rest": "60 sec",
          "notes": "Hold peak squeeze for 2 seconds each rep."
        }
      ]
    },
    "friday": {
      "focus": "Horizontal Back Thickness & Mid-Trap Rows",
      "exercises": [
        {
          "name": "Barbell Pendlay Row (Heavy)",
          "sets": 4,
          "reps": "6-8 reps",
          "rest": "2 min",
          "notes": "Dead-stop row from floor, build thick spinal erectors and lats."
        },
        {
          "name": "Chest-Supported T-Bar Row (Neutral Grip)",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "90 sec",
          "notes": "Overload rhomboids and middle trapezius."
        },
        {
          "name": "One-Arm Dumbbell Kroc Row",
          "sets": 3,
          "reps": "12-15 reps/arm",
          "rest": "90 sec",
          "notes": "Heavy, explosive rowing to build dense back thickness."
        },
        {
          "name": "Seated Wide-Grip Cable Row",
          "sets": 3,
          "reps": "12 reps",
          "rest": "60 sec",
          "notes": "Pull to sternum, squeeze shoulder blades together."
        }
      ]
    },
    "saturday": {
      "focus": "Scapular Prehab, Face Pulls & Core",
      "exercises": [
        {
          "name": "Cable Face Pulls with External Rotation",
          "sets": 4,
          "reps": "20 reps",
          "rest": "45 sec",
          "notes": "Strengthen rotator cuff and rear deltoids."
        },
        {
          "name": "Prone Incline Y-T-W Dumbbell Raises",
          "sets": 3,
          "reps": "10 reps each letter",
          "rest": "60 sec",
          "notes": "Bulletproof lower and mid traps."
        },
        {
          "name": "Hanging Leg Raises",
          "sets": 3,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Tighten midsection."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Rest Day",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-030",
    "planName": "4-Day Quad & Calf Specialization (Leg Hypertrophy)",
    "goal": "Quad Teardrop Development & Calf Growth",
    "description": "Designed for lifters looking to bring up lagging quadriceps and stubborn calves. Focuses on extreme knee flexion, sissy squats, hack squats, and high-frequency calf training.",
    "isActive": true,
    "monday": {
      "focus": "High-Bar Back Squats & Quad Leg Press",
      "exercises": [
        {
          "name": "High-Bar Olympic Back Squat (Heels Elevated)",
          "sets": 5,
          "reps": "6-8 reps",
          "rest": "2-3 min",
          "notes": "Elevate heels on 5lb plates or squat shoes for max quad travel."
        },
        {
          "name": "Narrow-Stance Leg Press (Feet Low on Sled)",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "2 min",
          "notes": "Extreme knee flexion, target vastus medialis (teardrop)."
        },
        {
          "name": "Walking Dumbbell Lunges (Short Stride)",
          "sets": 3,
          "reps": "12 steps/leg",
          "rest": "90 sec",
          "notes": "Short stride emphasizes knee flexion and quad load."
        },
        {
          "name": "Leg Extension (Strict Peak Squeeze)",
          "sets": 4,
          "reps": "15 reps",
          "rest": "60 sec",
          "notes": "Hold top contraction 2 seconds, slow 3-second descent."
        },
        {
          "name": "Standing Calf Machine",
          "sets": 5,
          "reps": "12 reps (3s stretch pause)",
          "rest": "45 sec",
          "notes": "Pause 3 seconds at bottom stretch to eliminate Achilles bounce."
        }
      ]
    },
    "tuesday": {
      "focus": "Upper Body Maintenance (Push/Pull)",
      "exercises": [
        {
          "name": "Incline Dumbbell Bench Press",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "90 sec",
          "notes": "Maintain upper body pressing strength."
        },
        {
          "name": "Neutral Grip Lat Pulldown",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "90 sec",
          "notes": "Upper body pulling maintenance."
        },
        {
          "name": "Dumbbell Lateral Raise",
          "sets": 3,
          "reps": "12 reps",
          "rest": "45 sec",
          "notes": "Deltoid health."
        },
        {
          "name": "Dips or Tricep Pushdown",
          "sets": 3,
          "reps": "12 reps",
          "rest": "60 sec",
          "notes": "Tricep maintenance."
        }
      ]
    },
    "wednesday": {
      "focus": "Knee Mobility & Patellar Flossing",
      "exercises": [
        {
          "name": "Tibialis Raises against Wall",
          "sets": 3,
          "reps": "25 reps",
          "rest": "30 sec",
          "notes": "Anterior lower leg strength to protect knee joints."
        },
        {
          "name": "Poliquin Step-Ups (Knee over Toes)",
          "sets": 3,
          "reps": "15 reps/leg",
          "rest": "45 sec",
          "notes": "Strengthen VMO tendon and promote blood flow into patella."
        },
        {
          "name": "Foam Roll Quadriceps & IT Band",
          "sets": 1,
          "reps": "15 mins",
          "rest": "None",
          "notes": "Tissue relaxation."
        }
      ]
    },
    "thursday": {
      "focus": "Hack Squats, Sissy Squats & Adductors",
      "exercises": [
        {
          "name": "Hack Squat Machine (Deep Range)",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "2 min",
          "notes": "Descend until hamstrings touch calves, explode up."
        },
        {
          "name": "Sissy Squats (Bodyweight or Plate Hold)",
          "sets": 3,
          "reps": "12-15 reps",
          "rest": "60 sec",
          "notes": "Torso leans back, knees drive forward, insane quad stretch."
        },
        {
          "name": "Bulgarian Split Squat (Upright Torso)",
          "sets": 3,
          "reps": "10 reps/leg",
          "rest": "90 sec",
          "notes": "Torso completely vertical to maximize quad recruitment."
        },
        {
          "name": "Seated Adductor Machine",
          "sets": 3,
          "reps": "15-20 reps",
          "rest": "45 sec",
          "notes": "Inner thigh fullness adds massive leg girth."
        },
        {
          "name": "Seated Calf Raise (Soleus Focus)",
          "sets": 5,
          "reps": "15-20 reps",
          "rest": "45 sec",
          "notes": "Full range soleus pump."
        }
      ]
    },
    "friday": {
      "focus": "Hamstring Balance & Calf Overload",
      "exercises": [
        {
          "name": "Romanian Deadlift (Barbell)",
          "sets": 4,
          "reps": "8-10 reps",
          "rest": "2 min",
          "notes": "Essential posterior balance for heavy quad training."
        },
        {
          "name": "Lying Leg Curl",
          "sets": 4,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Full knee flexion hamstring pump."
        },
        {
          "name": "Donkey Calf Raise or Leg Press Calf Press",
          "sets": 5,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Heavy loading, full ankle flexion."
        },
        {
          "name": "Farmer's Walk on Tip-Toes",
          "sets": 3,
          "reps": "30 meters",
          "rest": "60 sec",
          "notes": "Dynamic calf stabilization."
        }
      ]
    },
    "saturday": {
      "focus": "Abdominals & Core Stability",
      "exercises": [
        {
          "name": "Hanging Leg Raises",
          "sets": 4,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Lower abdominal compression."
        },
        {
          "name": "Ab Wheel Rollouts",
          "sets": 3,
          "reps": "12 reps",
          "rest": "60 sec",
          "notes": "Anterior core brace."
        },
        {
          "name": "Side Planks",
          "sets": 3,
          "reps": "45 sec/side",
          "rest": "30 sec",
          "notes": "Lateral stabilization."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Rest Day",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-031",
    "planName": "7-Day Deload & Active Regeneration Week",
    "goal": "Central Nervous System Reset & Joint Decompression",
    "description": "A planned restorative deload protocol to dissipate accumulated systemic fatigue, heal connective tissues, reset cortisol levels, and prime the body for future heavy training blocks.",
    "isActive": true,
    "monday": {
      "focus": "Gentle Full-Body Movement & Joint CARs",
      "exercises": [
        {
          "name": "Controlled Articular Rotations (CARs) for Shoulders & Hips",
          "sets": 3,
          "reps": "5 slow rotations/joint",
          "rest": "30 sec",
          "notes": "Move joints through their greatest pain-free circle."
        },
        {
          "name": "Light Kettlebell Goblet Squat (40% normal weight)",
          "sets": 3,
          "reps": "8 reps",
          "rest": "60 sec",
          "notes": "Keep motion smooth, sink deep into hips without straining."
        },
        {
          "name": "Band Pull-Aparts",
          "sets": 3,
          "reps": "15 reps",
          "rest": "30 sec",
          "notes": "Promote upper body blood flow."
        }
      ]
    },
    "tuesday": {
      "focus": "Controlled Spinal Waves & Thoracic Openers",
      "exercises": [
        {
          "name": "Cat-Cow Flow with Diaphragmatic Breath",
          "sets": 3,
          "reps": "10 breath cycles",
          "rest": "30 sec",
          "notes": "Inhale to arch, exhale to round spine gently."
        },
        {
          "name": "Thread-the-Needle Thoracic Stretch",
          "sets": 3,
          "reps": "8 reps/side",
          "rest": "30 sec",
          "notes": "Open mid-back and release shoulder blades."
        },
        {
          "name": "Child's Pose with Side Reaches",
          "sets": 3,
          "reps": "45 sec/side",
          "rest": "30 sec",
          "notes": "Decompress latissimus dorsi and lumbar spine."
        }
      ]
    },
    "wednesday": {
      "focus": "Zone 1 Flush Walk & Diaphragmatic Breathwork",
      "exercises": [
        {
          "name": "Outdoor Nature Walk (Zone 1 HR)",
          "sets": 1,
          "reps": "40 mins",
          "rest": "None",
          "notes": "Breathe exclusively through nose, relax nervous system."
        },
        {
          "name": "Box Breathing (4s Inhale, 4s Hold, 4s Exhale, 4s Hold)",
          "sets": 1,
          "reps": "10 mins",
          "rest": "None",
          "notes": "Down-regulate sympathetic tone, lower resting cortisol."
        }
      ]
    },
    "thursday": {
      "focus": "Light Band Activation & Glute Reset",
      "exercises": [
        {
          "name": "Mini-Band Glute Bridges",
          "sets": 3,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Gentle muscular wake-up without fatigue."
        },
        {
          "name": "Mini-Band Clamshells",
          "sets": 3,
          "reps": "15 reps/side",
          "rest": "30 sec",
          "notes": "Pelvic stabilization."
        },
        {
          "name": "Incline Push-Ups on Bench (Light)",
          "sets": 3,
          "reps": "10 reps",
          "rest": "45 sec",
          "notes": "Gentle chest and shoulder activation."
        }
      ]
    },
    "friday": {
      "focus": "Hip Capsule Decompression & Hamstring Flow",
      "exercises": [
        {
          "name": "90/90 Hip Switches",
          "sets": 3,
          "reps": "8 reps/side",
          "rest": "30 sec",
          "notes": "Lubricate hip joints and restore internal rotation."
        },
        {
          "name": "World's Greatest Stretch",
          "sets": 3,
          "reps": "5 reps/side",
          "rest": "30 sec",
          "notes": "Full body flow linking hips, thoracic spine, and ankles."
        }
      ]
    },
    "saturday": {
      "focus": "Myofascial Foam Rolling & Epsom Salt Soak",
      "exercises": [
        {
          "name": "Full Body Gentle Foam Rolling",
          "sets": 1,
          "reps": "20 mins",
          "rest": "None",
          "notes": "Roll slowly over major muscle bellies, breathe into tender spots."
        },
        {
          "name": "Legs-Up-the-Wall Inversion",
          "sets": 1,
          "reps": "10 mins",
          "rest": "None",
          "notes": "Promote venous blood return from legs and reduce inflammation."
        }
      ]
    },
    "sunday": {
      "focus": "Mindful Walking, Sun Exposure & Mental Reset",
      "exercises": [
        {
          "name": "Casual Leisure Walk",
          "sets": 1,
          "reps": "30 mins",
          "rest": "None",
          "notes": "Enjoy outdoor air, recover mentally, ready for the next training cycle."
        }
      ]
    }
  },
  {
    "workoutPlanId": "WPL-032",
    "planName": "5-Day Agility, Footwork & Speed Development",
    "goal": "Linear Speed, Deceleration & Change of Direction",
    "description": "Designed for track athletes, wide receivers, soccer and basketball players. Builds blistering acceleration, deceleration braking mechanics, and rapid multidirectional change-of-direction.",
    "isActive": true,
    "monday": {
      "focus": "Acceleration, Drive Phase & Wall Drills",
      "exercises": [
        {
          "name": "Sprint Posture Wall Drills (Single & Triple Switches)",
          "sets": 4,
          "reps": "10 switches",
          "rest": "60 sec",
          "notes": "Maintain 45-degree forward lean, punch knee up to 90 degrees."
        },
        {
          "name": "10-Yard Falling Starts",
          "sets": 6,
          "reps": "10 yards",
          "rest": "90 sec",
          "notes": "Fall forward until balance is lost, explode into low-angle drive phase."
        },
        {
          "name": "Heavy Sled Sprints (30% bodyweight)",
          "sets": 5,
          "reps": "15 yards",
          "rest": "2 min",
          "notes": "Overload horizontal force production and ground reaction force."
        },
        {
          "name": "Trap Bar Deadlift (Speed Focus)",
          "sets": 4,
          "reps": "3 reps (at 70%)",
          "rest": "2 min",
          "notes": "Max acceleration off floor."
        }
      ]
    },
    "tuesday": {
      "focus": "Top-End Max Velocity & Hamstring Elasticity",
      "exercises": [
        {
          "name": "Flying 20-Yard Sprints (with 20y Acceleration Zone)",
          "sets": 5,
          "reps": "20 yards",
          "rest": "3 min",
          "notes": "Hit absolute maximum speed through the 20-yard fly zone."
        },
        {
          "name": "Single-Leg Pogo Hops",
          "sets": 4,
          "reps": "15 reps/leg",
          "rest": "60 sec",
          "notes": "Stiff ankle spring, minimal ground contact time."
        },
        {
          "name": "Nordic Hamstring Curls",
          "sets": 3,
          "reps": "5-6 reps",
          "rest": "2 min",
          "notes": "Prevent hamstring tears during high velocity sprint mechanics."
        },
        {
          "name": "A-Skips & B-Skips Technique Series",
          "sets": 4,
          "reps": "30 yards",
          "rest": "60 sec",
          "notes": "Front side sprinting mechanics."
        }
      ]
    },
    "wednesday": {
      "focus": "Rest, Hip Flexor Opening & Hydration",
      "exercises": [
        {
          "name": "Couch Stretch & Psoas Release",
          "sets": 3,
          "reps": "60 sec/side",
          "rest": "30 sec",
          "notes": "Release anterior hip capsule."
        },
        {
          "name": "Thoracic Windmill Stretches",
          "sets": 3,
          "reps": "8 reps/side",
          "rest": "30 sec",
          "notes": "Rotational spine mobility."
        }
      ]
    },
    "thursday": {
      "focus": "Lateral Agility & 5-10-5 Pro Shuttle",
      "exercises": [
        {
          "name": "Pro Agility 5-10-5 Shuttle Drills",
          "sets": 5,
          "reps": "1 test run",
          "rest": "2 min",
          "notes": "Sharp change of direction, stay low, touch lines with hand."
        },
        {
          "name": "Lateral Skater Bounds to Single-Leg Stick",
          "sets": 4,
          "reps": "5 reps/side",
          "rest": "60 sec",
          "notes": "Absorb landing forces on outer foot, hold 2 seconds."
        },
        {
          "name": "Lateral Resisted Band Shuffles",
          "sets": 3,
          "reps": "15 yards/direction",
          "rest": "45 sec",
          "notes": "Glute medius power for defensive shuffles."
        },
        {
          "name": "Lateral Dumbbell Lunges",
          "sets": 3,
          "reps": "8 reps/leg",
          "rest": "60 sec",
          "notes": "Frontal plane strength."
        }
      ]
    },
    "friday": {
      "focus": "Deceleration Mechanics, Depth Drops & Knee Stability",
      "exercises": [
        {
          "name": "Depth Drops from 18-Inch Box (Braking Focus)",
          "sets": 5,
          "reps": "3 reps",
          "rest": "90 sec",
          "notes": "Step off, land silently in quarter squat, absorb ground force."
        },
        {
          "name": "15-Yard Sprint to Hard Deceleration Stop",
          "sets": 5,
          "reps": "1 rep",
          "rest": "90 sec",
          "notes": "Sprint full speed 15y, drop hips and stop within 3 steps."
        },
        {
          "name": "Single-Leg Romanian Deadlift",
          "sets": 3,
          "reps": "8 reps/leg",
          "rest": "60 sec",
          "notes": "Posterior braking muscle group balance."
        },
        {
          "name": "Tibialis Anterior Toe Raises",
          "sets": 3,
          "reps": "20 reps",
          "rest": "45 sec",
          "notes": "Anterior ankle deceleration capacity."
        }
      ]
    },
    "saturday": {
      "focus": "Hill Sprints & Ankle Elasticity",
      "exercises": [
        {
          "name": "Steep Incline Hill Sprints (30-40 yards)",
          "sets": 6,
          "reps": "1 sprint",
          "rest": "2 min",
          "notes": "High knee drive, natural forward lean, low joint impact."
        },
        {
          "name": "Double-Leg Broad Jumps",
          "sets": 4,
          "reps": "3 jumps",
          "rest": "60 sec",
          "notes": "Horizontal leap power."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Rest & Neuromuscular Healing",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-033",
    "planName": "4-Day Youth Athlete Foundations (Ages 14-18)",
    "goal": "Safe Movement Patterns, Coordination & Baseline Strength",
    "description": "A comprehensive developmental curriculum for young athletes. Emphasizes fundamental movement patterns (squat, hinge, push, pull, carry), landing mechanics, and long-term athletic development.",
    "isActive": true,
    "monday": {
      "focus": "Bodyweight Squats, Lunge Patterns & Core Basics",
      "exercises": [
        {
          "name": "Bodyweight Squats with Counterbalance Plate",
          "sets": 3,
          "reps": "10-12 reps",
          "rest": "60 sec",
          "notes": "Hold light 5lb plate out front, sink hips below knees, keep chest proud."
        },
        {
          "name": "Walking Lunges (Bodyweight)",
          "sets": 3,
          "reps": "10 steps/leg",
          "rest": "60 sec",
          "notes": "Learn knee control and balance on each single leg."
        },
        {
          "name": "Incline Push-Ups on Bench",
          "sets": 3,
          "reps": "8-10 reps",
          "rest": "60 sec",
          "notes": "Learn rigid plank posture while pressing."
        },
        {
          "name": "Dead Bug Floor Holds",
          "sets": 3,
          "reps": "10 reps/side",
          "rest": "45 sec",
          "notes": "Core coordination and spinal stability."
        }
      ]
    },
    "tuesday": {
      "focus": "Push-Ups, Inverted Rows & Scapular Stability",
      "exercises": [
        {
          "name": "Inverted Bodyweight Rows (TRX or Barbell)",
          "sets": 3,
          "reps": "8-10 reps",
          "rest": "60 sec",
          "notes": "Pull chest to handles, squeeze shoulder blades together."
        },
        {
          "name": "Floor Push-Ups",
          "sets": 3,
          "reps": "8-12 reps",
          "rest": "60 sec",
          "notes": "Maintain neutral spine, do not sag hips."
        },
        {
          "name": "Resistance Band Pull-Aparts",
          "sets": 3,
          "reps": "15 reps",
          "rest": "30 sec",
          "notes": "Build upper back posture and shoulder health."
        },
        {
          "name": "Plank Hold",
          "sets": 3,
          "reps": "30-45 sec",
          "rest": "45 sec",
          "notes": "Drive forearms into floor, squeeze glutes."
        }
      ]
    },
    "wednesday": {
      "focus": "Active Games & Multidirectional Mobility",
      "exercises": [
        {
          "name": "Outdoor Sport Play (Basketball, Soccer, Tag)",
          "sets": 1,
          "reps": "30-45 mins",
          "rest": "None",
          "notes": "Fun, unstructured multidirectional movement."
        },
        {
          "name": "Gentle Hamstring & Quad Stretch",
          "sets": 2,
          "reps": "30 sec/leg",
          "rest": "None",
          "notes": "Promote flexibility during growth spurts."
        }
      ]
    },
    "thursday": {
      "focus": "Goblet Squats, Hip Hinge Mastery & Planks",
      "exercises": [
        {
          "name": "Kettlebell Goblet Squat (Light/Moderate)",
          "sets": 3,
          "reps": "8-10 reps",
          "rest": "60 sec",
          "notes": "Elbows inside knees, perfect upright posture."
        },
        {
          "name": "Kettlebell Deadlift (from elevated box)",
          "sets": 3,
          "reps": "8-10 reps",
          "rest": "60 sec",
          "notes": "Master hip hinge without flexing lower back."
        },
        {
          "name": "Step-Ups onto Low Plyo Box",
          "sets": 3,
          "reps": "8 reps/leg",
          "rest": "45 sec",
          "notes": "Step up with lead leg, stand tall at top."
        },
        {
          "name": "Side Plank Hold",
          "sets": 3,
          "reps": "20-30 sec/side",
          "rest": "30 sec",
          "notes": "Build lateral abdominal strength."
        }
      ]
    },
    "friday": {
      "focus": "Farmer's Carries, Broad Jumps & Landing",
      "exercises": [
        {
          "name": "Two-Arm Dumbbell Farmer's Carry",
          "sets": 3,
          "reps": "30 meters",
          "rest": "60 sec",
          "notes": "Hold light dumbbells, walk tall with level shoulders."
        },
        {
          "name": "Standing Broad Jump to Stick Landing",
          "sets": 4,
          "reps": "3 jumps",
          "rest": "60 sec",
          "notes": "Focus on soft, quiet landing with knees tracking over toes."
        },
        {
          "name": "Medicine Ball Chest Pass against Wall",
          "sets": 3,
          "reps": "8 reps",
          "rest": "45 sec",
          "notes": "Explosive upper body push."
        },
        {
          "name": "Bird Dog Core Balance",
          "sets": 3,
          "reps": "8 reps/side",
          "rest": "30 sec",
          "notes": "Cross-body core stability."
        }
      ]
    },
    "saturday": {
      "focus": "Team Sport Practice & Agility Fun",
      "exercises": [
        {
          "name": "Agility Ladder & Cone Drills",
          "sets": 4,
          "reps": "20 yards",
          "rest": "45 sec",
          "notes": "Coordination, rhythm, balance, and quick feet."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Rest & Growth Sleep",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-034",
    "planName": "5-Day High-Frequency Full Body (Norwegian Powerlifting)",
    "goal": "Motor Learning, Frequent Submaximal Lifts & Strength",
    "description": "Inspired by the Norwegian Powerlifting model. Features high weekly frequency (submaximal 70-80% loads) for Squat, Bench, and Deadlift to optimize motor groove, technique, and volume accumulation.",
    "isActive": true,
    "monday": {
      "focus": "Full Body Volume (Squat 70%, Bench 72%, Row)",
      "exercises": [
        {
          "name": "Barbell Back Squat (Submaximal Volume)",
          "sets": 4,
          "reps": "5 reps (at 70% 1RM)",
          "rest": "2 min",
          "notes": "Pristine technical execution, high bar speed."
        },
        {
          "name": "Barbell Bench Press (Pause on Chest)",
          "sets": 5,
          "reps": "4 reps (at 72% 1RM)",
          "rest": "2 min",
          "notes": "1-second competition pause on chest each rep."
        },
        {
          "name": "Barbell Pendlay Row",
          "sets": 4,
          "reps": "6 reps",
          "rest": "90 sec",
          "notes": "Explode off floor, upper back rigidity."
        },
        {
          "name": "Leg Press (Accessory)",
          "sets": 3,
          "reps": "10 reps",
          "rest": "90 sec",
          "notes": "Quad volume without spinal load."
        },
        {
          "name": "Cable Face Pulls",
          "sets": 3,
          "reps": "15 reps",
          "rest": "45 sec",
          "notes": "Rotator cuff preservation."
        }
      ]
    },
    "tuesday": {
      "focus": "Full Body Technique (Deadlift 68%, OHP 70%, Pull-Ups)",
      "exercises": [
        {
          "name": "Conventional Barbell Deadlift",
          "sets": 4,
          "reps": "4 reps (at 68% 1RM)",
          "rest": "2-3 min",
          "notes": "Focus on perfect hip wedge and lats pinned to bar."
        },
        {
          "name": "Standing Overhead Press",
          "sets": 4,
          "reps": "5 reps (at 70% 1RM)",
          "rest": "2 min",
          "notes": "Strict vertical bar path."
        },
        {
          "name": "Weighted Pull-Ups",
          "sets": 4,
          "reps": "5 reps",
          "rest": "90 sec",
          "notes": "Chin over bar, smooth eccentric."
        },
        {
          "name": "Hamstring Lying Leg Curl",
          "sets": 3,
          "reps": "10 reps",
          "rest": "60 sec",
          "notes": "Knee flexion accessory."
        },
        {
          "name": "Standing Calf Raises",
          "sets": 4,
          "reps": "12 reps",
          "rest": "45 sec",
          "notes": "Calf maintenance."
        }
      ]
    },
    "wednesday": {
      "focus": "Full Body Variation (Tempo Squat, Incline Bench, GHR)",
      "exercises": [
        {
          "name": "Barbell Squat (3-0-3 Tempo)",
          "sets": 3,
          "reps": "4 reps (at 65% 1RM)",
          "rest": "2 min",
          "notes": "3 seconds down, 0 pause, 3 seconds up for perfect motor tracking."
        },
        {
          "name": "Incline Barbell Bench Press",
          "sets": 4,
          "reps": "6 reps (at 68% 1RM)",
          "rest": "2 min",
          "notes": "Upper chest and anterior delt loading."
        },
        {
          "name": "Glute-Ham Raise (GHR)",
          "sets": 3,
          "reps": "8 reps",
          "rest": "90 sec",
          "notes": "Posterior chain hypertrophy."
        },
        {
          "name": "Chest-Supported Row",
          "sets": 3,
          "reps": "10 reps",
          "rest": "60 sec",
          "notes": "Mid-back thickness."
        }
      ]
    },
    "thursday": {
      "focus": "Full Body Speed & Dynamic Effort (Speed Deadlift, Close Grip)",
      "exercises": [
        {
          "name": "Speed Conventional Deadlift",
          "sets": 6,
          "reps": "2 reps (at 65% 1RM)",
          "rest": "60 sec",
          "notes": "Max acceleration from the floor on every rep."
        },
        {
          "name": "Close-Grip Bench Press",
          "sets": 4,
          "reps": "6 reps",
          "rest": "90 sec",
          "notes": "Tricep lockout strength."
        },
        {
          "name": "Bulgarian Split Squats (Dumbbell)",
          "sets": 3,
          "reps": "8 reps/leg",
          "rest": "60 sec",
          "notes": "Unilateral leg stability."
        },
        {
          "name": "EZ-Bar Bicep Curls",
          "sets": 3,
          "reps": "10 reps",
          "rest": "45 sec",
          "notes": "Arm accessory."
        }
      ]
    },
    "friday": {
      "focus": "Full Body Heavy Singles & Primers (Squat 85%, Bench 85%)",
      "exercises": [
        {
          "name": "Barbell Back Squat (Heavy Technical Single)",
          "sets": 3,
          "reps": "1 rep (at 85% 1RM)",
          "rest": "3 min",
          "notes": "Build confidence with heavy weight without reaching failure."
        },
        {
          "name": "Barbell Bench Press (Heavy Technical Single)",
          "sets": 3,
          "reps": "1 rep (at 85% 1RM)",
          "rest": "3 min",
          "notes": "Competition pause, powerful leg drive."
        },
        {
          "name": "Romanian Deadlift",
          "sets": 3,
          "reps": "6 reps",
          "rest": "2 min",
          "notes": "Hamstring stretch and hip hinge stability."
        },
        {
          "name": "Ab Wheel Rollouts",
          "sets": 3,
          "reps": "10 reps",
          "rest": "60 sec",
          "notes": "Anti-extension core strength."
        }
      ]
    },
    "saturday": {
      "focus": "GPP & Core Bracing",
      "exercises": [
        {
          "name": "Farmer's Carry",
          "sets": 4,
          "reps": "40 meters",
          "rest": "90 sec",
          "notes": "Grip and torso stability."
        },
        {
          "name": "Incline Treadmill Walk",
          "sets": 1,
          "reps": "25 mins",
          "rest": "None",
          "notes": "Zone 2 active recovery."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Rest & Neurological Recovery",
      "exercises": []
    }
  },
  {
    "workoutPlanId": "WPL-035",
    "planName": "4-Day Pelvic Floor & Core Postpartum Rehabilitation",
    "goal": "Diastasis Recti Healing, Pelvic Floor Strength & Re-Entry",
    "description": "Designed for postpartum recovery and diastasis recti rehabilitation. Safely reconnects deep core stabilizers (transverse abdominis), rebuilds pelvic floor integrity, and restores functional daily strength.",
    "isActive": true,
    "monday": {
      "focus": "Diaphragmatic Breathing & Transverse Abdominis Activation",
      "exercises": [
        {
          "name": "360-Degree Diaphragmatic Breathing with Pelvic Lift",
          "sets": 4,
          "reps": "8 breath cycles",
          "rest": "45 sec",
          "notes": "Inhale expanding belly and ribcage, exhale gently drawing pelvic floor upward."
        },
        {
          "name": "Heel Slides with Core Engagement",
          "sets": 3,
          "reps": "10 reps/leg",
          "rest": "30 sec",
          "notes": "Slide heel out and back while keeping transverse abdominis contracted."
        },
        {
          "name": "Supine Glute Bridges with Yoga Block between Knees",
          "sets": 3,
          "reps": "12 reps",
          "rest": "45 sec",
          "notes": "Squeeze block gently to engage adductors and pelvic floor."
        },
        {
          "name": "Cat-Cow Gentle Pelvic Rocking",
          "sets": 3,
          "reps": "8 reps",
          "rest": "30 sec",
          "notes": "Gentle spinal wave without dropping into extreme lumbar extension."
        }
      ]
    },
    "tuesday": {
      "focus": "Glute Bridges, Clamshells & Pelvic Alignment",
      "exercises": [
        {
          "name": "Side-Lying Clamshells (Slow & Controlled)",
          "sets": 3,
          "reps": "12 reps/side",
          "rest": "30 sec",
          "notes": "Keep pelvis stacked, isolate gluteus medius, avoid rolling backward."
        },
        {
          "name": "Single-Leg Glute Bridge Iso-Hold",
          "sets": 3,
          "reps": "15 sec hold/side",
          "rest": "30 sec",
          "notes": "Pelvic levelness without sagging."
        },
        {
          "name": "Supported Bodyweight Box Squats (to Chair)",
          "sets": 3,
          "reps": "10 reps",
          "rest": "45 sec",
          "notes": "Sit back onto chair, exhale and engage pelvic floor on standing up."
        },
        {
          "name": "Standing Resistance Band Rows",
          "sets": 3,
          "reps": "12 reps",
          "rest": "45 sec",
          "notes": "Upper back strength to counteract nursing posture."
        }
      ]
    },
    "wednesday": {
      "focus": "Gentle Walking & Postural Lengthening",
      "exercises": [
        {
          "name": "Stroller Walk or Gentle Outdoor Stroll",
          "sets": 1,
          "reps": "20-25 mins",
          "rest": "None",
          "notes": "Upright posture, relaxed stride, breathe fresh air."
        },
        {
          "name": "Chest Opener Doorway Stretch",
          "sets": 2,
          "reps": "30 sec",
          "rest": "None",
          "notes": "Relieve tension across chest and front shoulders."
        }
      ]
    },
    "thursday": {
      "focus": "Modified Bird Dogs, Wall Sits & Side Planks",
      "exercises": [
        {
          "name": "Modified Bird Dog (Leg Slide Only)",
          "sets": 3,
          "reps": "8 reps/side",
          "rest": "45 sec",
          "notes": "Slide toe along floor without lifting if diastasis recti is present."
        },
        {
          "name": "Wall Sit with Yoga Block Squeeze",
          "sets": 3,
          "reps": "30 sec hold",
          "rest": "45 sec",
          "notes": "Back flat against wall, squeeze block, breathe diaphragmatically."
        },
        {
          "name": "Kneeling Modified Side Plank",
          "sets": 3,
          "reps": "20 sec/side",
          "rest": "30 sec",
          "notes": "Hips stacked, support from knees, lateral core engagement."
        },
        {
          "name": "Banded Paloff Press Hold",
          "sets": 3,
          "reps": "15 sec hold/side",
          "rest": "30 sec",
          "notes": "Resist band rotation with deep core."
        }
      ]
    },
    "friday": {
      "focus": "Upper Body Scapular Posture & Ergonomics",
      "exercises": [
        {
          "name": "Resistance Band Face Pulls",
          "sets": 3,
          "reps": "15 reps",
          "rest": "30 sec",
          "notes": "Strengthen upper back and reverse rounded baby-carrying posture."
        },
        {
          "name": "Seated Dumbbell Overhead Press (Light 5-8lbs)",
          "sets": 3,
          "reps": "10 reps",
          "rest": "45 sec",
          "notes": "Exhale as you press overhead, keep ribcage tucked."
        },
        {
          "name": "Farmer's Walk with Light Dumbbells (Suitcase Style)",
          "sets": 3,
          "reps": "25 meters/side",
          "rest": "45 sec",
          "notes": "Train unilateral carrying mechanics with proper spine alignment."
        }
      ]
    },
    "saturday": {
      "focus": "Pelvic Floor Relaxation & Deep Hip Stretches",
      "exercises": [
        {
          "name": "Happy Baby Pose with Gentle Rock",
          "sets": 3,
          "reps": "45 sec hold",
          "rest": "30 sec",
          "notes": "Relax and release hypertonic pelvic floor muscles."
        },
        {
          "name": "Child's Pose with Deep Belly Inhalation",
          "sets": 3,
          "reps": "60 sec",
          "rest": "30 sec",
          "notes": "Send breath deep into lower back and pelvis."
        }
      ]
    },
    "sunday": {
      "focus": "Complete Rest & Restorative Care",
      "exercises": []
    }
  }
];
