const { getFallbackResponse } = require("./chatConfig");

// ── Expected responses (source of truth) ────────────────────────────────────
const EXPECTED = {
  protein:
    "**For optimal protein intake**, aim for **1.6-2.2g per kg** of body weight daily. Good sources include **chicken breast (31g/100g)**, **eggs (6g each)**, **Greek yogurt (10g/100g)**, **lentils (9g/100g)**, and **quality whey protein**. Would you like me to recommend some protein supplements from our store?",

  workout:
    "**A balanced workout routine** should include: **3-4 strength training sessions** per week focusing on compound movements (**squats, deadlifts, bench press, rows**), plus **2-3 cardio sessions**. Start with **3 sets of 8-12 reps** for each exercise. Remember to **warm up for 5-10 minutes** and **cool down with stretching**!",

  weightLoss:
    "**For sustainable weight loss**: Create a **moderate calorie deficit (300-500 calories below maintenance)**, **prioritize protein intake (1.6-2g per kg body weight)**, combine **strength training with cardio**, get **7-9 hours of sleep**, and **stay hydrated**. Aim for **0.5-1kg loss per week** for healthy results.",

  muscleGain:
    "**For muscle gain**: Consume a **slight calorie surplus (200-300 above maintenance)**, eat **1.6-2.2g protein per kg body weight**, focus on **progressive overload** in your training, get **adequate sleep (7-9 hours)**, and **stay consistent** with your workouts. **Compound exercises** like **squats, deadlifts, and bench press** are key!",

  default:
    "I'm here to help with your fitness journey! Feel free to ask about **workouts**, **nutrition**, **protein intake**, **weight loss**, or **muscle gain**. What specific aspect of fitness would you like to know more about?",
};

// ── Protein branch ───────────────────────────────────────────────────────────
describe("getFallbackResponse — protein branch", () => {
  test('exact keyword "protein"', () => {
    expect(getFallbackResponse("protein")).toBe(EXPECTED.protein);
  });

  test("keyword embedded in a sentence", () => {
    expect(getFallbackResponse("How much protein should I eat daily?")).toBe(
      EXPECTED.protein
    );
  });

  test("uppercase input is normalised", () => {
    expect(getFallbackResponse("PROTEIN intake advice")).toBe(EXPECTED.protein);
  });

  test("mixed-case input is normalised", () => {
    expect(getFallbackResponse("Tell me about Protein shakes")).toBe(
      EXPECTED.protein
    );
  });

  // protein wins over workout/muscle because it is checked first
  test("protein takes priority over workout when both present", () => {
    expect(getFallbackResponse("protein before workout")).toBe(
      EXPECTED.protein
    );
  });

  test("protein takes priority over muscle when both present", () => {
    expect(getFallbackResponse("protein for muscle growth")).toBe(
      EXPECTED.protein
    );
  });
});

// ── Workout / exercise branch ────────────────────────────────────────────────
describe("getFallbackResponse — workout / exercise branch", () => {
  test('exact keyword "workout"', () => {
    expect(getFallbackResponse("workout")).toBe(EXPECTED.workout);
  });

  test('exact keyword "exercise"', () => {
    expect(getFallbackResponse("exercise")).toBe(EXPECTED.workout);
  });

  test('"workout" embedded in a sentence', () => {
    expect(getFallbackResponse("Give me a good workout plan")).toBe(
      EXPECTED.workout
    );
  });

  test('"exercise" embedded in a sentence', () => {
    expect(getFallbackResponse("What exercise should I do?")).toBe(
      EXPECTED.workout
    );
  });

  test("uppercase WORKOUT is normalised", () => {
    expect(getFallbackResponse("WORKOUT TIPS")).toBe(EXPECTED.workout);
  });

  test("uppercase EXERCISE is normalised", () => {
    expect(getFallbackResponse("EXERCISE ROUTINE")).toBe(EXPECTED.workout);
  });

  // workout wins over muscle/gain because it is checked first
  test("workout takes priority over muscle when both present", () => {
    expect(getFallbackResponse("workout for muscle gain")).toBe(
      EXPECTED.workout
    );
  });
});

// ── Weight loss branch ───────────────────────────────────────────────────────
describe("getFallbackResponse — weight loss branch", () => {
  test('exact phrase "weight loss"', () => {
    expect(getFallbackResponse("weight loss")).toBe(EXPECTED.weightLoss);
  });

  test("phrase embedded in a sentence", () => {
    expect(getFallbackResponse("Any tips for weight loss?")).toBe(
      EXPECTED.weightLoss
    );
  });

  test("uppercase input is normalised", () => {
    expect(getFallbackResponse("WEIGHT LOSS DIET")).toBe(EXPECTED.weightLoss);
  });

  test("mixed-case input is normalised", () => {
    expect(getFallbackResponse("Weight Loss journey tips")).toBe(
      EXPECTED.weightLoss
    );
  });

  // weight loss beats muscle/gain because it is checked first
  test("weight loss takes priority over muscle when both present", () => {
    expect(getFallbackResponse("weight loss and muscle toning")).toBe(
      EXPECTED.weightLoss
    );
  });
});

// ── Muscle / gain branch ─────────────────────────────────────────────────────
describe("getFallbackResponse — muscle / gain branch", () => {
  test('exact keyword "muscle"', () => {
    expect(getFallbackResponse("muscle")).toBe(EXPECTED.muscleGain);
  });

  test('exact keyword "gain"', () => {
    expect(getFallbackResponse("gain")).toBe(EXPECTED.muscleGain);
  });

  test('"muscle" embedded in a sentence', () => {
    expect(getFallbackResponse("How do I build muscle fast?")).toBe(
      EXPECTED.muscleGain
    );
  });

  test('"gain" embedded in a sentence', () => {
    expect(getFallbackResponse("I want to gain weight healthily")).toBe(
      EXPECTED.muscleGain
    );
  });

  test("uppercase MUSCLE is normalised", () => {
    expect(getFallbackResponse("MUSCLE BUILDING TIPS")).toBe(
      EXPECTED.muscleGain
    );
  });

  test("uppercase GAIN is normalised", () => {
    expect(getFallbackResponse("GAIN MASS FAST")).toBe(EXPECTED.muscleGain);
  });
});

// ── Default / fallback branch ────────────────────────────────────────────────
describe("getFallbackResponse — default branch", () => {
  test("unrelated message returns default", () => {
    expect(getFallbackResponse("hello")).toBe(EXPECTED.default);
  });

  test("empty string returns default", () => {
    expect(getFallbackResponse("")).toBe(EXPECTED.default);
  });

  test("whitespace-only string returns default", () => {
    expect(getFallbackResponse("   ")).toBe(EXPECTED.default);
  });

  test("fitness-adjacent but unmatched keyword returns default", () => {
    // "cardio" alone isn't a keyword — should fall through
    expect(getFallbackResponse("Tell me about cardio")).toBe(EXPECTED.default);
  });

  test("numeric-only input returns default", () => {
    expect(getFallbackResponse("12345")).toBe(EXPECTED.default);
  });

  test("special characters only return default", () => {
    expect(getFallbackResponse("!@#$%")).toBe(EXPECTED.default);
  });
});

// ── Return-type / shape contract ─────────────────────────────────────────────
describe("getFallbackResponse — return type contract", () => {
  const sampleInputs = [
    "protein shake",
    "workout plan",
    "weight loss",
    "muscle gain",
    "random question",
  ];

  test.each(sampleInputs)('always returns a string for "%s"', (input) => {
    expect(typeof getFallbackResponse(input)).toBe("string");
  });

  test.each(sampleInputs)(
    'never returns an empty string for "%s"',
    (input) => {
      expect(getFallbackResponse(input).length).toBeGreaterThan(0);
    }
  );
});
