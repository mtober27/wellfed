(function (root) {
  const INGREDIENTS = root.LARDER_INGREDIENTS;
  const RECIPES = root.LARDER_RECIPES;
  if (!INGREDIENTS || !RECIPES) {
    throw new Error("Larder catalog did not load.");
  }

  const STORES = [
    { id: "walmart", label: "Walmart" },
    { id: "kroger", label: "Kroger" },
    { id: "aldi", label: "Aldi" },
    { id: "target", label: "Target" },
    { id: "wholefoods", label: "Whole Foods" },
    { id: "traderjoes", label: "Trader Joe's" },
    { id: "costco", label: "Costco" },
  ];

  const STORE_LABEL = {};
  STORES.forEach(function (store) {
    STORE_LABEL[store.id] = store.label;
  });

  const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const AISLE_ORDER = [
    "Produce",
    "Meat",
    "Seafood",
    "Dairy & Eggs",
    "Bakery",
    "Frozen",
    "Grains & Pasta",
    "Canned & Jarred",
    "Oils & Spreads",
    "Condiments",
    "Spices",
    "Breakfast & Protein",
    "Beverages",
  ];

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function roundTo(n, step) {
    return Math.round(n / step) * step;
  }

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function emptyMacros() {
    return { kcal: 0, p: 0, c: 0, f: 0, fiber: 0 };
  }

  function addMacros(total, extra) {
    total.kcal += extra.kcal;
    total.p += extra.p;
    total.c += extra.c;
    total.f += extra.f;
    total.fiber += extra.fiber;
    return total;
  }

  function macrosOf(id, grams) {
    const per = INGREDIENTS[id].per100;
    const k = grams / 100;
    return {
      kcal: per.kcal * k,
      p: per.p * k,
      c: per.c * k,
      f: per.f * k,
      fiber: (per.fiber || 0) * k,
    };
  }

  function sumItems(items) {
    return items.reduce(function (total, item) {
      return addMacros(total, macrosOf(item.id, item.grams));
    }, emptyMacros());
  }

  function sumMeals(meals) {
    return meals.reduce(function (total, meal) {
      return addMacros(total, meal.totals || sumItems(meal.items));
    }, emptyMacros());
  }

  function portion(id, grams) {
    const ing = INGREDIENTS[id];
    const g = Math.round(grams);
    if (!ing.household || grams < 1) return g + " g";
    const qty = Math.round((grams / ing.household.grams) * 4) / 4;
    if (qty <= 0) return g + " g";
    return "about " + trimNum(qty) + " " + ing.household.label + " (" + g + " g)";
  }

  function trimNum(n) {
    return (Math.round(n * 100) / 100).toString();
  }

  function money(n) {
    return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
  }

  function formatFoodWeight(grams) {
    if (grams >= 453.6) {
      const lb = Math.round((grams / 453.59237) * 10) / 10;
      return trimNum(lb) + " lb (" + Math.round(grams) + " g)";
    }
    return Math.round(grams) + " g";
  }

  function activityFactor(answers) {
    let score = { desk: 0, mixed: 1, feet: 2, labor: 3 }[answers.job] || 0;
    score += { under5: 0, "5to8": 1, "8to12": 2, over12: 3 }[answers.steps] || 0;
    const weekly = answers.workouts * answers.minutes;
    if (weekly >= 240) score += 3;
    else if (weekly >= 150) score += 2;
    else if (weekly >= 60) score += 1;
    const table = [1.2, 1.3, 1.375, 1.45, 1.55, 1.65, 1.725, 1.8, 1.9];
    return table[Math.min(score, table.length - 1)];
  }

  function applyNotes(answers) {
    const notes = (answers.notes || "").toLowerCase();
    const applied = [];
    function addAvoid(tag, label) {
      if (!answers.avoids.includes(tag)) {
        answers.avoids.push(tag);
        applied.push(label);
      }
    }
    function addAllergy(tag, label) {
      if (!answers.allergies.includes(tag)) {
        answers.allergies.push(tag);
        applied.push(label);
      }
    }
    if (/lactose|no dairy|dairy[ -]?free|without dairy/.test(notes)) addAvoid("dairy", "no dairy");
    if (/gluten[ -]?free|no gluten|celiac/.test(notes)) addAllergy("gluten", "no gluten");
    if (/no peanut|peanut allergy/.test(notes)) addAllergy("peanut", "no peanuts");
    if (/tree nut|no almond|nut allergy/.test(notes)) addAllergy("tree-nut", "no tree nuts");
    if (/\bvegan\b/.test(notes) && answers.diet === "omnivore") {
      answers.diet = "vegan";
      applied.push("vegan");
    } else if (/\bvegetarian\b/.test(notes) && answers.diet === "omnivore") {
      answers.diet = "vegetarian";
      applied.push("vegetarian");
    }
    if (/no spice|not spicy|no heat/.test(notes)) {
      answers.spice = 0;
      applied.push("no spicy food");
    }
    return applied;
  }

  function normalize(raw) {
    const answers = {
      name: String(raw.name || "").trim().slice(0, 40),
      age: Number(raw.age),
      equation: raw.equation === "male" ? "male" : raw.equation === "female" ? "female" : "",
      units: raw.units === "metric" ? "metric" : "imperial",
      goal: raw.goal,
      pace: raw.pace === "mild" ? "mild" : "standard",
      carbs: raw.carbs === "lower" || raw.carbs === "higher" ? raw.carbs : "balanced",
      job: raw.job || "mixed",
      steps: raw.steps || "5to8",
      workouts: Number(raw.workouts),
      workoutType: raw.workoutType || "both",
      minutes: Number(raw.minutes),
      meals: Number(raw.meals),
      diet: raw.diet || "omnivore",
      cook: Number(raw.cook) || 35,
      breakfast: raw.breakfast || "either",
      cuisines: Array.isArray(raw.cuisines) ? raw.cuisines.slice() : [],
      spice: Number(raw.spice),
      allergies: Array.isArray(raw.allergies) ? raw.allergies.slice() : [],
      avoids: Array.isArray(raw.avoids) ? raw.avoids.slice() : [],
      treat: !!raw.treat,
      leftovers: !!raw.leftovers,
      stores: Array.isArray(raw.stores) ? raw.stores.slice() : [],
      budget: Number(raw.budget),
      brands: raw.brands === "name" ? "name" : "value",
      clinical: raw.clinical || "none",
      notes: String(raw.notes || "").trim().slice(0, 400),
    };

    if (answers.units === "metric") {
      answers.heightCm = Number(raw.heightCm);
      answers.weightKg = Number(raw.weight);
    } else {
      const ft = Number(raw.heightFt);
      const inches = Number(raw.heightIn);
      answers.heightCm = (ft * 12 + inches) * 2.54;
      answers.weightKg = Number(raw.weight) * 0.45359237;
    }

    if (!answers.equation) return { error: "Choose the calorie equation." };
    if (!Number.isFinite(answers.age) || answers.age < 18 || answers.age > 90) {
      return { error: "This planner is for adults 18 and older." };
    }
    if (answers.clinical !== "none") {
      return { error: "This planner will not build a target for that answer." };
    }
    if (!(answers.heightCm >= 140 && answers.heightCm <= 230)) {
      return { error: "Enter a height between about 4'7\" and 7'6\"." };
    }
    if (!(answers.weightKg >= 38 && answers.weightKg <= 250)) {
      return { error: "Enter a body weight the calculator can use." };
    }
    if (!["lose", "maintain", "gain"].includes(answers.goal)) {
      return { error: "Choose a goal." };
    }
    if (![3, 4, 5].includes(answers.meals)) answers.meals = 4;
    if (!answers.stores.length) return { error: "Pick at least one grocery store." };
    if (!(answers.budget >= 25)) answers.budget = 120;
    if (!Number.isFinite(answers.spice)) answers.spice = 1;
    answers.spice = clamp(answers.spice, 0, 2);
    answers.workouts = clamp(Number.isFinite(answers.workouts) ? answers.workouts : 0, 0, 14);
    answers.minutes = clamp(Number.isFinite(answers.minutes) ? answers.minutes : 0, 0, 120);
    answers.appliedNotes = applyNotes(answers);
    return answers;
  }

  function buildProfile(answers) {
    const warnings = [];
    const kg = answers.weightKg;
    const cm = answers.heightCm;
    const bmrBase = 10 * kg + 6.25 * cm - 5 * answers.age;
    const bmr = answers.equation === "male" ? bmrBase + 5 : bmrBase - 161;
    const factor = activityFactor(answers);
    const tdee = bmr * factor;
    const heightM = cm / 100;
    const bmi = kg / (heightM * heightM);

    let goalUsed = answers.goal;
    if (goalUsed === "lose" && bmi < 18.5) {
      goalUsed = "maintain";
      warnings.push("BMI is under 18.5, so this week is set to maintenance instead of weight loss.");
    }

    let delta = 0;
    if (goalUsed === "lose") delta = answers.pace === "mild" ? -250 : -500;
    if (goalUsed === "gain") delta = answers.pace === "mild" ? 200 : 350;

    const floor = answers.equation === "male" ? 1700 : 1500;
    let kcal = tdee + delta;
    let floorApplied = false;
    if (kcal < floor) {
      kcal = floor;
      floorApplied = true;
      warnings.push(
        "The target was raised to " +
          Math.round(floor).toLocaleString("en-US") +
          " kcal. Lower than that is not used here."
      );
    }

    const hardFloor = answers.equation === "male" ? 1550 : 1350;
    let foodKcal = kcal;
    if (answers.treat) {
      foodKcal = Math.max(hardFloor, kcal - 150);
    }

    let perKg = goalUsed === "maintain" ? 1.6 : 1.8;
    if (answers.workoutType === "strength" || answers.workoutType === "both") perKg += 0.2;
    if (goalUsed === "lose") perKg += 0.1;
    perKg = clamp(perKg, 1.4, 2.2);
    let protein = perKg * kg;
    if (protein * 4 > foodKcal * 0.4) protein = (foodKcal * 0.4) / 4;

    const minFat = 0.6 * kg;
    let fatPct = 0.28;
    if (answers.carbs === "lower") fatPct = 0.35;
    if (answers.carbs === "higher") fatPct = 0.22;
    let fat = Math.max(minFat, (fatPct * foodKcal) / 9);
    const proteinCals = protein * 4;
    if (proteinCals + fat * 9 > foodKcal - 320) {
      fat = Math.max(minFat, (foodKcal - proteinCals - 320) / 9);
    }
    let carbs = (foodKcal - proteinCals - fat * 9) / 4;
    if (carbs < 70) {
      fat = Math.max(minFat * 0.85, (foodKcal - proteinCals - 70 * 4) / 9);
      carbs = (foodKcal - proteinCals - fat * 9) / 4;
    }

    const fiber = Math.round((14 * foodKcal) / 1000);
    const paceLabel =
      goalUsed === "lose"
        ? answers.pace === "mild"
          ? "about 0.5 lb a week"
          : "about 1 lb a week"
        : goalUsed === "gain"
          ? answers.pace === "mild"
            ? "about 0.25 lb a week"
            : "about 0.5 lb a week"
          : "holding weight";

    const narrative = [
      "At rest you burn about " +
        Math.round(bmr).toLocaleString("en-US") +
        " kcal. That uses the Mifflin-St Jeor equation with your age, height, and weight.",
      "With your activity, a normal day is about " +
        Math.round(tdee).toLocaleString("en-US") +
        " kcal.",
      goalUsed === "maintain"
        ? "You asked to hold your weight, so the target stays near that."
        : (goalUsed === "lose" ? "Fat loss" : "Muscle gain") +
          " at " +
          paceLabel +
          " moves the target " +
          (delta > 0 ? "up " : "down ") +
          Math.abs(delta) +
          " kcal.",
      "Protein is about " +
        Math.round(protein) +
        " g (" +
        trimNum(Math.round(perKg * 10) / 10) +
        " g per kg). Fat is about " +
        Math.round(fat) +
        " g. Carbs make up the rest, about " +
        Math.round(carbs) +
        " g.",
    ];
    if (answers.treat) {
      narrative.push("Meals are 150 kcal under the full target, so you have room for a treat.");
    }
    if (floorApplied) narrative.push(warnings[warnings.length - 1]);

    return {
      bmr: bmr,
      tdee: tdee,
      factor: factor,
      bmi: bmi,
      kcal: kcal,
      foodKcal: foodKcal,
      protein: protein,
      carbs: carbs,
      fat: fat,
      fiber: fiber,
      proteinPerKg: perKg,
      floorApplied: floorApplied,
      goalUsed: goalUsed,
      equation: answers.equation,
      warnings: warnings,
      narrative: narrative,
      treat: answers.treat,
      waterMl: Math.round(kg * 35),
      paceLabel: paceLabel,
    };
  }

  function foodTargets(profile) {
    return {
      kcal: profile.foodKcal,
      p: profile.protein,
      c: profile.carbs,
      f: profile.fat,
      fiber: profile.fiber,
    };
  }

  function mealSlots(count) {
    if (count <= 3) return ["breakfast", "lunch", "dinner"];
    if (count === 4) return ["breakfast", "lunch", "dinner", "snack"];
    return ["breakfast", "lunch", "snack", "dinner", "snack"];
  }

  function sharesFor(slots) {
    const table = {
      3: [0.3, 0.35, 0.35],
      4: [0.27, 0.33, 0.3, 0.1],
      5: [0.24, 0.28, 0.1, 0.28, 0.1],
    };
    const base = table[slots.length] || table[4];
    return slots.map(function (slot, index) {
      return { slot: slot, kcal: base[index], p: base[index], c: base[index], f: base[index] };
    });
  }

  function mealLabel(slot, index, slots) {
    if (slot !== "snack") return slot.charAt(0).toUpperCase() + slot.slice(1);
    const snacks = [];
    slots.forEach(function (name, i) {
      if (name === "snack") snacks.push(i);
    });
    if (snacks.length < 2) return "Snack";
    return index === snacks[0] ? "Afternoon snack" : "Evening snack";
  }

  function ingredientBlocked(ing, answers) {
    if (!ing.diets.includes(answers.diet)) return true;
    if (ing.allergens.some(function (tag) { return answers.allergies.includes(tag); })) return true;
    if (ing.avoids.some(function (tag) { return answers.avoids.includes(tag); })) return true;
    return false;
  }

  function recipeAllowed(recipe, answers, filters) {
    if (recipe.spice > answers.spice) return false;
    if (filters.time && recipe.minutes > answers.cook) return false;
    if (
      filters.style &&
      recipe.slot === "breakfast" &&
      answers.breakfast !== "either" &&
      recipe.style !== answers.breakfast
    ) {
      return false;
    }
    if (
      filters.cuisine &&
      answers.cuisines.length &&
      !recipe.cuisines.some(function (cuisine) { return answers.cuisines.includes(cuisine); })
    ) {
      return false;
    }
    for (let i = 0; i < recipe.items.length; i++) {
      const ing = INGREDIENTS[recipe.items[i].id];
      if (!ing || ingredientBlocked(ing, answers)) return false;
    }
    return true;
  }

  function weightedPick(list, weights, rand) {
    let total = weights.reduce(function (sum, weight) { return sum + weight; }, 0);
    let ticket = rand() * total;
    for (let i = 0; i < list.length; i++) {
      ticket -= weights[i];
      if (ticket <= 0) return list[i];
    }
    return list[list.length - 1];
  }

function cuisineMatch(recipe, answers) {
  return answers.cuisines.some(function (cuisine) { return recipe.cuisines.indexOf(cuisine) !== -1; });
}

function pickRecipe(slot, answers, rand, usedIds, recentProteins, maxCost) {
  const passes = [
    { time: true, style: true, cost: true },
    { time: false, style: true, cost: true },
    { time: false, style: false, cost: true },
    { time: false, style: false, cost: false },
  ];
  let pool = [];
  let passUsed = passes[0];
  for (let p = 0; p < passes.length; p++) {
    passUsed = passes[p];
    pool = RECIPES.filter(function (recipe) {
      if (recipe.slot !== slot) return false;
      if (passUsed.cost && recipe.cost > maxCost) return false;
      return recipeAllowed(recipe, answers, {
        time: passUsed.time,
        style: passUsed.style,
        cuisine: false,
      });
    });
    if (pool.length) break;
  }
  if (!pool.length) return { recipe: null, relaxedTime: false, relaxedCuisine: false };

  const unused = pool.filter(function (recipe) { return usedIds.indexOf(recipe.id) === -1; });
  const unusedCuisine = unused.filter(function (recipe) { return cuisineMatch(recipe, answers); });
  let source = unused.length ? unused : pool;
  if (unusedCuisine.length && unusedCuisine.length >= Math.min(2, unused.length)) source = unusedCuisine;
  const relaxedCuisine = answers.cuisines.length > 0 && source.some(function (recipe) { return !cuisineMatch(recipe, answers); });

  const weights = source.map(function (recipe) {
    let weight = 1;
    if (recipe.proteins.some(function (protein) { return recentProteins.indexOf(protein) !== -1; })) weight *= 0.35;
    if (answers.goal === "lose" && recipe.cost >= 3) weight *= 0.55;
    if (answers.goal === "lose" && ["chicken", "turkey", "tuna", "shrimp", "salmon", "dairy", "whey", "egg"].some(function (protein) {
      return recipe.proteins.indexOf(protein) !== -1;
    })) weight *= 1.35;
    if (answers.budget <= 90 && recipe.cost === 1) weight *= 1.6;
    if (cuisineMatch(recipe, answers)) weight *= 1.8;
    return weight * (0.75 + rand() * 0.5);
  });
  return {
    recipe: weightedPick(source, weights, rand),
    relaxedTime: !passUsed.time,
    relaxedCuisine: relaxedCuisine,
  };
}

const SEASONING = {
  salt: true,
  pepper: true,
  cumin: true,
  chiliPowder: true,
  garlic: true,
  lemon: true,
  cilantro: true,
  maple: true,
};

function scaleLever(items, lever, multiplier) {
  const applied = clamp(multiplier, 0.45, 1.85);
  items.forEach(function (item) {
    if (item.lever !== lever) return;
    const floor = Math.min(item.min, item.grams * 0.4);
    item.grams = clamp(item.grams * applied, floor, item.max);
  });
}

function fitMeal(recipe, target) {
  const items = recipe.items.map(function (item) { return Object.assign({}, item); });
  for (let n = 0; n < 14; n++) {
    const macros = sumItems(items);
    const ratio = target.kcal / Math.max(macros.kcal, 1);
    if (ratio < 0.95) {
      if (n < 8) {
        scaleLever(items, "carb", ratio);
        scaleLever(items, "fat", ratio);
      } else {
        scaleLever(items, "protein", ratio);
      }
    } else if (ratio > 1.06) {
      if (macros.p < target.p * 0.92) scaleLever(items, "protein", Math.min(ratio, target.p / Math.max(macros.p, 1)));
      else scaleLever(items, "carb", ratio);
    } else if (macros.p < target.p - 6) {
      scaleLever(items, "protein", clamp(target.p / Math.max(macros.p, 1), 1, 1.4));
    } else {
      break;
    }
  }
  return items;
}

  function firstAllowed(ids, answers) {
    for (let i = 0; i < ids.length; i++) {
      const ing = INGREDIENTS[ids[i]];
      if (ing && !ingredientBlocked(ing, answers)) return ids[i];
    }
    return null;
  }

  function mergeItems(items) {
    const map = new Map();
    items.forEach(function (item) {
      if (!map.has(item.id)) map.set(item.id, Object.assign({}, item));
      else map.get(item.id).grams += item.grams;
    });
    return Array.from(map.values());
  }

  function addOrGrow(meal, id, grams, lever, min, max) {
    const existing = meal.items.find(function (item) { return item.id === id; });
    if (existing) existing.grams = clamp(existing.grams + grams, existing.min, Math.max(existing.max, max));
    else meal.items.push({ id: id, grams: grams, lever: lever, min: min, max: max });
  }

function scaleDay(day, ratio) {
  const applied = clamp(ratio, 0.62, 1.38);
  day.meals.forEach(function (meal) {
    meal.items.forEach(function (item) {
      if (SEASONING[item.id]) return;
      const floor = Math.min(item.min * 0.55, item.grams * 0.45);
      item.grams = clamp(item.grams * applied, Math.max(floor, 1), item.max);
    });
  });
}

function growCarbs(day) {
  let grew = false;
  day.meals.forEach(function (meal) {
    meal.items.forEach(function (item) {
      if (item.lever === "carb" && item.grams < item.max - 1) {
        item.grams = Math.min(item.max, item.grams * 1.16);
        grew = true;
      }
    });
  });
  return grew;
}

  function refreshTotals(day) {
    day.meals.forEach(function (meal) {
      meal.items = mergeItems(meal.items);
      meal.totals = sumItems(meal.items);
    });
    day.totals = sumMeals(day.meals);
  }

function balanceDay(day, target, answers) {
  const proteinIds = ["whey", "greekYogurt", "cottage", "peaProtein", "shrimp", "tuna", "chickenBreast", "tofu", "egg", "edamame"];
  const carbIds = ["brownRice", "banana", "apple", "potato", "oats"];
  const fatIds = ["oliveOil", "peanutButter", "sunflowerButter", "avocado"];
  for (let n = 0; n < 8; n++) {
    refreshTotals(day);
    const kcalRatio = day.totals.kcal / target.kcal;
    if (kcalRatio > 1.06 || kcalRatio < 0.94) {
      scaleDay(day, target.kcal / day.totals.kcal);
      continue;
    }
    if (day.totals.p + 10 < target.p) {
      const id = firstAllowed(proteinIds, answers);
      const meal = day.meals[day.meals.length - 1];
      if (id && meal) {
        addOrGrow(meal, id, 25, "protein", 10, 90);
        refreshTotals(day);
        if (day.totals.kcal > target.kcal * 1.04) scaleDay(day, target.kcal / day.totals.kcal);
      }
      continue;
    }
    if (day.totals.f + 12 < target.f && day.totals.kcal < target.kcal * 1.03) {
      const fat = firstAllowed(fatIds, answers);
      const meal = day.meals[day.meals.length - 1];
      if (fat && meal) addOrGrow(meal, fat, 8, "fat", 4, 24);
      continue;
    }
    if (day.totals.kcal < target.kcal * 0.96) {
      if (!growCarbs(day)) {
        const carb = firstAllowed(carbIds, answers);
        const fat = firstAllowed(fatIds, answers);
        const meal = day.meals.find(function (entry) { return entry.slot === "dinner"; }) || day.meals[0];
        if (carb) addOrGrow(meal, carb, 70, "carb", 30, 320);
        else if (fat) addOrGrow(meal, fat, 10, "fat", 4, 28);
      }
      continue;
    }
    break;
  }
  refreshTotals(day);
}

  function roundItems(items) {
    items.forEach(function (item) {
      if (item.id === "egg") item.grams = Math.max(item.min, roundTo(item.grams, 50));
      else if (item.id === "whey" || item.id === "peaProtein") item.grams = Math.max(5, roundTo(item.grams, 5));
      else if (item.lever === "fixed") item.grams = Math.round(item.grams * 10) / 10;
      else item.grams = Math.max(1, Math.round(item.grams));
    });
  }

  function recipeById(id) {
    return RECIPES.find(function (recipe) { return recipe.id === id; });
  }

  function makeMeal(recipe, slot, label, share, target) {
    const macroTarget = {
      kcal: target.kcal * share.kcal,
      p: target.p * share.p,
      c: target.c * share.c,
      f: target.f * share.f,
    };
    const items = fitMeal(recipe, macroTarget);
    return {
      slot: slot,
      label: label,
      recipeId: recipe.id,
      name: recipe.name,
      method: recipe.method,
      minutes: recipe.minutes,
      proteins: recipe.proteins.slice(),
      items: items,
      totals: sumItems(items),
      macroTarget: macroTarget,
      share: share.kcal,
      locked: false,
      leftover: false,
    };
  }

  function refitUnlocked(day, target) {
    const open = day.meals.filter(function (meal) { return !meal.locked; });
    const lockedMacros = day.meals.filter(function (meal) { return meal.locked; }).reduce(function (total, meal) {
      return addMacros(total, sumItems(meal.items));
    }, emptyMacros());
    if (lockedMacros.kcal > target.kcal * 0.5) {
      const factor = (target.kcal * 0.42) / lockedMacros.kcal;
      day.meals.forEach(function (meal) {
        if (!meal.locked) return;
        meal.items.forEach(function (item) {
          if (item.lever === "fixed") return;
          item.grams = clamp(item.grams * factor, item.min, item.max);
        });
      });
      return refitUnlocked(day, target);
    }
    const remain = {
      kcal: Math.max(target.kcal - lockedMacros.kcal, open.length * 220),
      p: Math.max(target.p - lockedMacros.p, open.length * 12),
      c: Math.max(target.c - lockedMacros.c, open.length * 18),
      f: Math.max(target.f - lockedMacros.f, open.length * 6),
    };
    const shareSum = open.reduce(function (sum, meal) { return sum + meal.share; }, 0) || 1;
    open.forEach(function (meal) {
      const share = meal.share / shareSum;
      const recipe = recipeById(meal.recipeId);
      meal.items = fitMeal(recipe || { items: meal.items }, {
        kcal: remain.kcal * share,
        p: remain.p * share,
        c: remain.c * share,
        f: remain.f * share,
      });
    });
  }

  function assembleWeek(answers, seed, maxCost) {
    const rand = mulberry32(seed);
    const profile = buildProfile(answers);
    const target = foodTargets(profile);
    const slots = mealSlots(answers.meals);
    if (target.kcal > 3000 && slots.length < 5 && answers.meals >= 3) {
      slots.splice(2, 0, "snack");
      profile.warnings.push("An extra snack was added. The calorie target is high for the number of meals you picked.");
    }
    const shareRows = sharesFor(slots);
    const used = { breakfast: [], lunch: [], dinner: [], snack: [] };
    let recentProteins = [];
    let relaxedTime = false;
    let relaxedCuisine = false;
    const days = [];

    for (let d = 0; d < 7; d++) {
      const meals = [];
      for (let s = 0; s < slots.length; s++) {
        const slot = slots[s];
        const picked = pickRecipe(slot, answers, rand, used[slot], recentProteins, maxCost);
        if (!picked.recipe) {
          return {
            error: "No " + slot + " fits those limits. Drop an allergy, a food you skip, or a cuisine and try again.",
          };
        }
        if (picked.relaxedTime) relaxedTime = true;
        if (picked.relaxedCuisine) relaxedCuisine = true;
        used[slot].push(picked.recipe.id);
        if (used[slot].length > 8) used[slot].shift();
        const meal = makeMeal(picked.recipe, slot, mealLabel(slot, s, slots), shareRows[s], target);
        meals.push(meal);
        recentProteins = recentProteins.concat(picked.recipe.proteins).slice(-6);
      }
      const day = { index: d, name: DAY_NAMES[d], meals: meals, totals: emptyMacros() };
      balanceDay(day, target, answers);
      days.push(day);
    }

    if (answers.leftovers) {
      for (let d = 1; d < days.length; d += 2) {
        const dinner = days[d - 1].meals.find(function (meal) { return meal.slot === "dinner"; });
        const lunch = days[d].meals.find(function (meal) { return meal.slot === "lunch"; });
        if (!dinner || !lunch) continue;
        lunch.name = dinner.name + ", leftover";
        lunch.method = "Reheat last night's dinner until it is steaming. The portion is adjusted so today still hits your targets.";
        lunch.recipeId = dinner.recipeId;
        lunch.minutes = 10;
        lunch.proteins = dinner.proteins.slice();
        lunch.items = dinner.items.map(function (item) { return Object.assign({}, item); });
        lunch.locked = true;
        lunch.leftover = true;
        refitUnlocked(days[d], target);
        balanceDay(days[d], target, answers);
      }
    }

    days.forEach(function (day) {
      day.meals.forEach(function (meal) {
        roundItems(meal.items);
        meal.items.forEach(function (item) {
          item.name = INGREDIENTS[item.id].name;
          item.portion = portion(item.id, item.grams);
        });
        meal.totals = sumItems(meal.items);
      });
      day.totals = sumMeals(day.meals);
    });

    if (relaxedTime) {
      profile.warnings.push("A few meals take longer to cook than you asked for. There were not enough shorter ones.");
    }
    if (relaxedCuisine) {
      profile.warnings.push("Some meals are outside the cuisines you picked, so the week is not the same few dishes.");
    }
    if (answers.appliedNotes.length) {
      profile.warnings.push("From your note: " + answers.appliedNotes.join(", ") + ".");
    }

    return { profile: profile, days: days, target: target };
  }

  function packsFor(listing, grams) {
    if (listing.perLb) {
      const lbs = grams / 453.59237;
      const buy = Math.max(0.25, Math.ceil(lbs * 4 - 1e-9) / 4);
      return {
        qty: buy,
        cost: buy * listing.price,
        haveGrams: buy * 453.59237,
        label: trimNum(buy) + " lb",
      };
    }
    const packs = Math.max(1, Math.ceil(grams / listing.grams - 1e-9));
    return {
      qty: packs,
      cost: packs * listing.price,
      haveGrams: packs * listing.grams,
      label: packs === 1 ? "1 × " + listing.pack : packs + " × " + listing.pack,
    };
  }

  function bestOffer(listings, grams) {
    let best = null;
    listings.forEach(function (listing) {
      const trip = packsFor(listing, grams);
      if (!best || trip.cost < best.trip.cost - 0.001) best = { listing: listing, trip: trip };
    });
    return best;
  }

  function buildGrocery(days, answers) {
    const buckets = {};
    days.forEach(function (day) {
      day.meals.forEach(function (meal) {
        meal.items.forEach(function (item) {
          const ing = INGREDIENTS[item.id];
          if (!ing || ing.skipGrocery) return;
          const bought = item.grams / ing.cookYield;
          if (!buckets[item.id]) buckets[item.id] = { bought: 0, eaten: 0, uses: [] };
          buckets[item.id].bought += bought;
          buckets[item.id].eaten += item.grams;
          const use = day.name + " · " + meal.label;
          if (buckets[item.id].uses.indexOf(use) === -1) buckets[item.id].uses.push(use);
        });
      });
    });

    const lines = [];
    Object.keys(buckets).forEach(function (id) {
      const ing = INGREDIENTS[id];
      const bucket = buckets[id];
      const offers = [];
      answers.stores.forEach(function (store) {
        const all = ing.listings.filter(function (listing) { return listing.store === store; });
        if (!all.length) return;
        const named = all.filter(function (listing) { return listing.tier === "name"; });
        const pool = answers.brands === "name" && named.length ? named : all;
        const best = bestOffer(pool, bucket.bought);
        if (!best) return;
        offers.push({
          store: store,
          storeLabel: STORE_LABEL[store] || store,
          product: best.listing.product,
          brand: best.listing.brand,
          pack: best.listing.pack,
          tier: best.listing.tier,
          tripCost: best.trip.cost,
          qtyLabel: best.trip.label,
          haveGrams: best.trip.haveGrams,
          listing: best.listing,
          trip: best.trip,
        });
      });
      if (!offers.length) return;

      let candidates = offers;
      if (answers.brands === "name") {
        const namedOffers = offers.filter(function (offer) { return offer.tier === "name"; });
        if (namedOffers.length) candidates = namedOffers;
      }
      candidates.sort(function (a, b) { return a.tripCost - b.tripCost; });
      const winner = candidates[0];
      offers.forEach(function (offer) {
        offer.winner = offer.store === winner.store && offer.product === winner.product;
        offer.excluded = answers.brands === "name" && offer.tier !== "name" && candidates !== offers;
      });
      offers.sort(function (a, b) { return a.tripCost - b.tripCost; });

      const leftover = Math.max(0, winner.haveGrams - bucket.bought);
      let boughtText = "Buy about " + formatFoodWeight(bucket.bought) + ".";
      let eatenText = "";
      if (Math.abs(ing.cookYield - 1) > 0.05) {
        eatenText = "The recipes use about " + formatFoodWeight(bucket.eaten) + " prepared.";
        boughtText = "Buy about " + formatFoodWeight(bucket.bought) + " as packaged.";
      }
      let leftoverText = "";
      if (leftover > 30) {
        leftoverText = "This purchase leaves about " + formatFoodWeight(leftover) + " after the week.";
      }

      const unit = winner.listing.perLb
        ? money(winner.listing.price) + " / lb"
        : money(winner.listing.price) + " each";

      lines.push({
        id: id,
        name: ing.name,
        aisle: ing.aisle,
        product: winner.product,
        brand: winner.brand,
        store: winner.store,
        storeLabel: winner.storeLabel,
        pack: winner.pack,
        packsLabel: winner.qtyLabel,
        lineTotal: winner.tripCost,
        unitPriceLabel: unit,
        eatenText: eatenText,
        boughtText: boughtText,
        leftoverText: leftoverText,
        uses: bucket.uses,
        offers: offers.map(function (offer) {
          return {
            store: offer.store,
            storeLabel: offer.storeLabel,
            product: offer.product,
            brand: offer.brand,
            pack: offer.pack,
            tripCost: offer.tripCost,
            qtyLabel: offer.qtyLabel,
            winner: offer.winner,
            excluded: !!offer.excluded,
            unitPriceLabel: offer.listing.perLb ? money(offer.listing.price) + " / lb" : money(offer.listing.price),
          };
        }),
      });
    });

    lines.sort(function (a, b) {
      const aisle = AISLE_ORDER.indexOf(a.aisle) - AISLE_ORDER.indexOf(b.aisle);
      if (aisle !== 0) return aisle;
      return a.name.localeCompare(b.name);
    });

    const total = lines.reduce(function (sum, line) { return sum + line.lineTotal; }, 0);
    return {
      lines: lines,
      total: total,
      budget: answers.budget,
      overBy: Math.max(0, total - answers.budget),
    };
  }

  function buildPlan(raw, seed) {
    const answers = normalize(raw);
    if (answers.error) return { error: answers.error };
    const startSeed = (seed || 1) >>> 0;
    const attempts = [];
    for (let cost = 3; cost >= 1; cost--) {
      const attempt = assembleWeek(answers, startSeed, cost);
      if (attempt.error) {
        if (!attempts.length) return attempt;
        break;
      }
      attempt.grocery = buildGrocery(attempt.days, answers);
      attempt.costCap = cost;
      attempts.push(attempt);
    }
    if (!attempts.length) return { error: "The week could not be built." };
    const cap = answers.budget * 1.12;
    const under = attempts.filter(function (attempt) { return attempt.grocery.total <= cap; });
    let built;
    if (under.length) {
      under.sort(function (a, b) { return b.grocery.total - a.grocery.total; });
      built = under[0];
    } else {
      attempts.sort(function (a, b) { return a.grocery.total - b.grocery.total; });
      built = attempts[0];
    }

    if (built.grocery.total > answers.budget) {
      built.profile.warnings.push(
        "The list is about " +
          money(built.grocery.total) +
          ", over the " +
          money(answers.budget) +
          " you set. A higher budget or store brands would cost less."
      );
    } else if (built.costCap < 3) {
      built.profile.warnings.push("Some expensive dinners were left out to stay near your budget.");
    }

    return {
      seed: startSeed,
      answers: answers,
      profile: built.profile,
      days: built.days,
      grocery: built.grocery,
    };
  }

  function swapMeal(plan, dayIndex, mealIndex) {
    if (!plan || !plan.days || !plan.days[dayIndex]) return plan;
    const day = plan.days[dayIndex];
    const meal = day.meals[mealIndex];
    if (!meal || meal.locked) return plan;
    const used = [];
    plan.days.forEach(function (entry) {
      entry.meals.forEach(function (item) {
        if (item.recipeId) used.push(item.recipeId);
      });
    });
    const rand = mulberry32((plan.seed + 97 + dayIndex * 13 + mealIndex * 17) >>> 0);
    let replacement = null;
    const pool = RECIPES.filter(function (recipe) {
      if (recipe.slot !== meal.slot) return false;
      if (recipe.id === meal.recipeId) return false;
      if (used.indexOf(recipe.id) !== -1 && RECIPES.filter(function (item) { return item.slot === meal.slot; }).length > 3) {
        return false;
      }
      return recipeAllowed(recipe, plan.answers, { time: false, style: true, cuisine: false, cost: false });
    });
    if (!pool.length) return plan;
    replacement = pool[Math.floor(rand() * pool.length)];
    meal.recipeId = replacement.id;
    meal.name = replacement.name;
    meal.method = replacement.method;
    meal.minutes = replacement.minutes;
    meal.proteins = replacement.proteins.slice();
    meal.leftover = false;
    meal.items = fitMeal(replacement, meal.macroTarget);
    const target = foodTargets(plan.profile);
    balanceDay(day, target, plan.answers);
    day.meals.forEach(function (entry) {
      roundItems(entry.items);
      entry.items.forEach(function (item) {
        item.name = INGREDIENTS[item.id].name;
        item.portion = portion(item.id, item.grams);
      });
      entry.totals = sumItems(entry.items);
    });
    day.totals = sumMeals(day.meals);
    plan.grocery = buildGrocery(plan.days, plan.answers);
    plan.seed = (plan.seed + 1) >>> 0;
    return plan;
  }

  function exampleAnswers() {
    return {
      name: "Alex",
      age: 34,
      equation: "female",
      units: "imperial",
      heightFt: 5,
      heightIn: 6,
      weight: 160,
      goal: "lose",
      pace: "mild",
      carbs: "balanced",
      job: "mixed",
      steps: "8to12",
      workouts: 3,
      workoutType: "both",
      minutes: 40,
      meals: 4,
      diet: "omnivore",
      cook: 35,
      breakfast: "either",
      cuisines: ["mediterranean", "mexican"],
      spice: 1,
      allergies: [],
      avoids: [],
      treat: true,
      leftovers: true,
      stores: ["walmart", "aldi"],
      budget: 120,
      brands: "value",
      clinical: "none",
      notes: "",
    };
  }

  function audit() {
    const errors = [];
    const ids = Object.keys(INGREDIENTS);
    ids.forEach(function (id) {
      const ing = INGREDIENTS[id];
      if (ing.skipGrocery) return;
      STORES.forEach(function (store) {
        const found = ing.listings.some(function (listing) { return listing.store === store.id; });
        if (!found) errors.push(id + " missing " + store.id);
      });
      ing.listings.forEach(function (listing) {
        if (!(listing.price > 0) || !(listing.grams > 0) || !listing.product) {
          errors.push("bad listing " + id + " " + listing.store);
        }
      });
    });
    RECIPES.forEach(function (recipe) {
      recipe.items.forEach(function (item) {
        if (!INGREDIENTS[item.id]) errors.push(recipe.id + " missing " + item.id);
        if (item.grams < item.min || item.grams > item.max) {
          errors.push(recipe.id + " " + item.id + " base outside min/max");
        }
      });
    });
    return errors;
  }

  root.Larder = {
    STORES: STORES,
    buildPlan: buildPlan,
    swapMeal: swapMeal,
    exampleAnswers: exampleAnswers,
    portion: portion,
    money: money,
    audit: audit,
    buildProfile: buildProfile,
    normalize: normalize,
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
