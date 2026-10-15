(function () {
  const app = document.getElementById("app");
  const KEY = "larder-answers-v1";
  const PLAN_KEY = "larder-plan-v1";

  const CUISINES = [
    ["american", "American"],
    ["mexican", "Mexican"],
    ["mediterranean", "Mediterranean"],
    ["italian", "Italian"],
    ["asian", "Asian"],
    ["indian", "Indian"],
    ["middleeastern", "Middle Eastern"],
  ];

  const ALLERGIES = [
    ["milk", "Milk"],
    ["egg", "Eggs"],
    ["fish", "Fish"],
    ["shellfish", "Shellfish"],
    ["peanut", "Peanuts"],
    ["tree-nut", "Tree nuts"],
    ["soy", "Soy"],
    ["gluten", "Wheat / gluten"],
    ["sesame", "Sesame"],
  ];

  const AVOIDS = [
    ["chicken", "Chicken"],
    ["turkey", "Turkey"],
    ["beef", "Beef"],
    ["pork", "Pork"],
    ["fish", "Fish"],
    ["shellfish", "Shellfish"],
    ["eggs", "Eggs"],
    ["dairy", "Dairy"],
    ["beans", "Beans and lentils"],
    ["peanuts", "Peanuts"],
    ["tree-nuts", "Tree nuts"],
    ["onions", "Onions"],
    ["mushrooms", "Mushrooms"],
    ["cilantro", "Cilantro"],
    ["avocado", "Avocado"],
  ];

  function blank() {
    return {
      name: "",
      age: "",
      equation: "",
      units: "imperial",
      heightFt: "",
      heightIn: "0",
      heightCm: "",
      weight: "",
      goal: "",
      pace: "mild",
      carbs: "balanced",
      job: "mixed",
      steps: "5to8",
      workouts: "3",
      workoutType: "both",
      minutes: "40",
      meals: "4",
      diet: "",
      cook: "35",
      breakfast: "either",
      cuisines: [],
      spice: "1",
      allergies: [],
      avoids: [],
      treat: false,
      leftovers: true,
      stores: [],
      budget: "120",
      brands: "value",
      clinical: "",
      notes: "",
    };
  }

  function loadAnswers() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      if (saved && typeof saved === "object") return Object.assign(blank(), saved);
    } catch (err) {}
    return blank();
  }

  const state = {
    view: "home",
    step: 0,
    answers: loadAnswers(),
    error: "",
    stop: "",
    plan: null,
    day: 0,
    checks: {},
    focus: false,
    menu: false,
  };

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function saveAnswers() {
    try { localStorage.setItem(KEY, JSON.stringify(state.answers)); } catch (err) {}
  }

  function savePlan() {
    try { localStorage.setItem(PLAN_KEY, JSON.stringify(state.plan)); } catch (err) {}
  }

  function money(n) { return Larder.money(n); }

  function choices(name, options, current, multi) {
    const selected = Array.isArray(current) ? current.map(String) : [String(current)];
    return (
      '<div class="choices' + (options.length > 3 ? " two" : "") + '">' +
      options.map(function (opt) {
        const on = selected.indexOf(String(opt[0])) !== -1;
        return (
          '<label class="choice"><input type="' + (multi ? "checkbox" : "radio") +
          '" name="' + name + '" value="' + esc(opt[0]) + '"' + (on ? " checked" : "") +
          (multi ? "" : " required") +
          " /><span><strong>" + esc(opt[1]) + "</strong>" +
          (opt[2] ? "<small>" + esc(opt[2]) + "</small>" : "") +
          "</span></label>"
        );
      }).join("") +
      "</div>"
    );
  }

  function field(label, hint, inner) {
    return '<label class="stack">' + esc(label) + (hint ? '<small>' + esc(hint) + "</small>" : "") + inner + "</label>";
  }

  function textInput(name, value, attrs) {
    return '<input type="text" name="' + name + '" value="' + esc(value) + '" ' + (attrs || "") + " />";
  }

  function numberInput(name, value, attrs) {
    return '<input type="number" inputmode="decimal" name="' + name + '" value="' + esc(value) + '" ' + (attrs || "") + " />";
  }

  const STEPS = [
    {
      kicker: "About you",
      title: "Who is this for?",
      lede: "Your answers set the calories, the meals, and the grocery list.",
      body: function (a) {
        return (
          field("What should we call you?", "Optional.", textInput("name", a.name, 'autocomplete="given-name" maxlength="40" placeholder="Alex"')) +
          field("Age", "Adults 18 and older.", numberInput("age", a.age, 'min="18" max="90" inputmode="numeric" required')) +
          "<p class=\"hint\">The calorie formula has a male and a female version. Pick the one that fits.</p>" +
          choices("equation", [
            ["female", "Female"],
            ["male", "Male"],
          ], a.equation) +
          "<p class=\"hint\">If any of the last three apply, this stops. No calorie target.</p>" +
          choices("clinical", [
            ["none", "None of these. Build the plan."],
            ["pregnant", "I am pregnant or breastfeeding."],
            ["doctor", "A doctor already gave me a diet to follow."],
            ["ed", "I have a history of an eating disorder."],
          ], a.clinical)
        );
      },
      validate: function (a) {
        const age = Number(a.age);
        if (!a.age) return "Enter your age.";
        if (!Number.isFinite(age) || Math.round(age) !== age) return "Age needs to be a whole number.";
        if (age < 18) return "stop:age";
        if (age > 90) return "Enter an age from 18 to 90.";
        if (!a.equation) return "Pick male or female.";
        if (!a.clinical) return "Pick one of those four.";
        if (a.clinical !== "none") return "stop:" + a.clinical;
        return "";
      },
    },
    {
      kicker: "Your size",
      title: "Height and weight.",
      lede: "Used with your age to estimate how many calories you burn at rest.",
      body: function (a) {
        const units = choices("units", [
          ["imperial", "Pounds and feet"],
          ["metric", "Kilograms and centimeters"],
        ], a.units);
        let size = "";
        if (a.units === "metric") {
          size =
            '<div class="split">' +
            field("Height", "Centimeters", numberInput("heightCm", a.heightCm, 'min="140" max="230" required')) +
            field("Weight", "Kilograms", numberInput("weight", a.weight, 'min="38" max="250" step="0.1" required')) +
            "</div>";
        } else {
          let feet = '<option value="">Feet</option>';
          for (let ft = 4; ft <= 7; ft++) {
            feet += '<option value="' + ft + '"' + (String(a.heightFt) === String(ft) ? " selected" : "") + ">" + ft + " ft</option>";
          }
          let inches = "";
          for (let inch = 0; inch <= 11; inch++) {
            inches += '<option value="' + inch + '"' + (String(a.heightIn) === String(inch) ? " selected" : "") + ">" + inch + " in</option>";
          }
          size =
            '<div class="split">' +
            field("Feet", "", '<select name="heightFt">' + feet + "</select>") +
            field("Inches", "", '<select name="heightIn">' + inches + "</select>") +
            "</div>" +
            field("Weight", "Pounds", numberInput("weight", a.weight, 'min="80" max="550" step="0.1" required'));
        }
        return units + size;
      },
      validate: function (a) {
        const weight = Number(a.weight);
        if (a.units === "metric") {
          const cm = Number(a.heightCm);
          if (!(cm >= 140 && cm <= 230)) return "Enter a height from 140 to 230 cm.";
          if (!(weight >= 38 && weight <= 250)) return "Enter a weight from 38 to 250 kg.";
        } else {
          if (a.heightFt === "" || a.heightFt == null) return "Choose your height.";
          const inches = Number(a.heightFt) * 12 + Number(a.heightIn || 0);
          if (inches < 56 || inches > 90) return "Enter a height between 4'8\" and 7'6\".";
          if (!(weight >= 80 && weight <= 550)) return "Enter a weight from 80 to 550 lb.";
        }
        return "";
      },
    },
    {
      kicker: "The goal",
      title: "What is the goal?",
      lede: "Losing or gaining weight changes the calories a bit. The pace stays moderate.",
      body: function (a) {
        let pace = "";
        if (a.goal === "lose") {
          pace = "<p class=\"hint\">How fast?</p>" + choices("pace", [
            ["mild", "About 0.5 lb a week", "A 250 kcal deficit."],
            ["standard", "About 1 lb a week", "A 500 kcal deficit."],
          ], a.pace);
        } else if (a.goal === "gain") {
          pace = "<p class=\"hint\">How fast?</p>" + choices("pace", [
            ["mild", "About 0.25 lb a week", "A 200 kcal surplus."],
            ["standard", "About 0.5 lb a week", "A 350 kcal surplus."],
          ], a.pace);
        }
        return (
          choices("goal", [
            ["lose", "Lose fat"],
            ["maintain", "Maintain weight"],
            ["gain", "Build muscle"],
          ], a.goal) +
          pace +
          "<p class=\"hint\">Carbs and fat</p>" +
          choices("carbs", [
            ["balanced", "Balanced"],
            ["lower", "Lower carb"],
            ["higher", "Higher carb"],
          ], a.carbs) +
          '<label class="choice"><input data-bool="1" type="checkbox" name="treat"' + (a.treat ? " checked" : "") + " /><span><strong>Leave 150 kcal for a treat</strong><small>Meals cover the rest.</small></span></label>"
        );
      },
      validate: function (a) {
        if (!a.goal) return "Choose a goal.";
        return "";
      },
    },
    {
      kicker: "Your days",
      title: "How active are you?",
      lede: "Work, steps, and workouts change how much you need to eat. This is an estimate.",
      body: function (a) {
        return (
          "<p class=\"hint\">Workday</p>" +
          choices("job", [
            ["desk", "Mostly sitting"],
            ["mixed", "A mix of sitting and walking"],
            ["feet", "On your feet most of the day"],
            ["labor", "Heavy physical work"],
          ], a.job) +
          "<p class=\"hint\">About how many steps?</p>" +
          choices("steps", [
            ["under5", "Under 5,000"],
            ["5to8", "5,000 to 8,000"],
            ["8to12", "8,000 to 12,000"],
            ["over12", "Over 12,000"],
          ], a.steps) +
          '<div class="split">' +
          field("Workouts each week", "", numberInput("workouts", a.workouts, 'min="0" max="14"')) +
          field("Minutes in a session", "", numberInput("minutes", a.minutes, 'min="0" max="120"')) +
          "</div>" +
          choices("workoutType", [
            ["strength", "Mostly strength"],
            ["cardio", "Mostly cardio"],
            ["both", "Both"],
            ["none", "I am not training right now"],
          ], a.workoutType)
        );
      },
      validate: function () { return ""; },
    },
    {
      kicker: "How you eat",
      title: "How do you eat?",
      lede: "Meals are picked to match this. Allergies on the next page are always left out.",
      body: function (a) {
        return (
          choices("meals", [
            ["3", "3 meals"],
            ["4", "3 meals and a snack"],
            ["5", "3 meals and 2 snacks"],
          ], a.meals) +
          "<p class=\"hint\">Eating pattern</p>" +
          choices("diet", [
            ["omnivore", "Omnivore"],
            ["pescatarian", "Pescatarian"],
            ["vegetarian", "Vegetarian"],
            ["vegan", "Vegan"],
          ], a.diet) +
          "<p class=\"hint\">Time you want to spend cooking a meal</p>" +
          choices("cook", [
            ["20", "About 20 minutes"],
            ["35", "About 35 minutes"],
            ["50", "I can go longer"],
          ], a.cook) +
          "<p class=\"hint\">Breakfast</p>" +
          choices("breakfast", [
            ["sweet", "Sweet"],
            ["savory", "Savory"],
            ["either", "Either"],
          ], a.breakfast) +
          "<p class=\"hint\">Heat</p>" +
          choices("spice", [
            ["0", "No heat"],
            ["1", "Mild"],
            ["2", "Medium"],
          ], a.spice) +
          '<label class="choice"><input data-bool="1" type="checkbox" name="leftovers"' + (a.leftovers ? " checked" : "") + " /><span><strong>I like leftovers</strong><small>Some lunches are last night's dinner.</small></span></label>"
        );
      },
      validate: function (a) {
        if (!a.diet) return "Choose an eating pattern.";
        return "";
      },
    },
    {
      kicker: "Flavor",
      title: "Any cuisines you want more of?",
      lede: "Pick a few, or leave them blank.",
      body: function (a) {
        return choices("cuisines", CUISINES, a.cuisines, true);
      },
      validate: function () { return ""; },
    },
    {
      kicker: "Leave these out",
      title: "Allergies and foods to skip.",
      lede: "Oats are left out with gluten, since most oats are not certified gluten-free.",
      body: function (a) {
        return (
          "<p class=\"hint\">Allergies</p>" +
          choices("allergies", ALLERGIES, a.allergies, true) +
          "<p class=\"hint\">Foods to skip</p>" +
          choices("avoids", AVOIDS, a.avoids, true)
        );
      },
      validate: function () { return ""; },
    },
    {
      kicker: "The cart",
      title: "Where do you shop?",
      lede: "The list uses the cheaper store for what you need. Prices are typical U.S. shelf prices, not live prices.",
      body: function (a) {
        const stores = Larder.STORES.map(function (store) { return [store.id, store.label]; });
        return (
          choices("stores", stores, a.stores, true) +
          field("Weekly food budget", "U.S. dollars for the groceries in this plan.", numberInput("budget", a.budget, 'min="40" max="400" step="1"')) +
          choices("brands", [
            ["value", "Best price, including store brands"],
            ["name", "Name brands when the store has them"],
          ], a.brands) +
          field("Anything else?", "A short note. Words like vegan, gluten-free, or no dairy are used.", '<textarea name="notes" maxlength="400" placeholder="No cilantro. Keep breakfast fast.">' + esc(a.notes) + "</textarea>")
        );
      },
      validate: function (a) {
        if (!a.stores.length) return "Pick at least one store.";
        if (!(Number(a.budget) >= 40)) return "Set a weekly budget of at least $40.";
        return "";
      },
    },
    {
      kicker: "Review",
      title: "Look this over.",
      lede: "You can edit any answer. This is a calculator, not medical advice.",
      body: function (a) {
        const rows = [
          ["Name", a.name || "Not given", 0],
          ["Age", a.age, 0],
          ["Equation", a.equation, 0],
          ["Size", a.units === "metric" ? a.heightCm + " cm, " + a.weight + " kg" : a.heightFt + " ft " + a.heightIn + " in, " + a.weight + " lb", 1],
          ["Goal", a.goal + (a.goal === "maintain" ? "" : ", " + a.pace) + ", " + a.carbs + " carbs" + (a.treat ? ", treat slot" : ""), 2],
          ["Movement", a.job + ", " + a.steps + " steps, " + a.workouts + " workouts", 3],
          ["Eating", a.meals + " meals, " + a.diet + ", " + a.cook + " min, " + a.breakfast + " breakfast", 4],
          ["Cuisines", a.cuisines.length ? a.cuisines.join(", ") : "No preference", 5],
          ["Limits", (a.allergies.concat(a.avoids).join(", ") || "None"), 6],
          ["Shopping", a.stores.join(", ") + ", $" + a.budget + "/week, " + (a.brands === "name" ? "name brands" : "best price"), 7],
        ];
        return (
          '<ul class="summary">' +
          rows.map(function (row) {
            return "<li><span><b>" + esc(row[0]) + ".</b> " + esc(row[1]) + '</span><button type="button" data-action="goto" data-step="' + row[2] + '">Edit</button></li>';
          }).join("") +
          "</ul>" +
          '<p class="fine">Calories use the Mifflin-St Jeor equation. Prices are examples. Check the tag and the ingredient list in the store. Talk to a doctor or dietitian before you change how you eat, especially if you are pregnant, sick, or have had an eating disorder.</p>'
        );
      },
      validate: function () { return ""; },
    },
  ];

  function readGroup(name) {
    const nodes = Array.from(app.querySelectorAll('[name="' + name + '"]'));
    if (!nodes.length) return;
    const first = nodes[0];
    if (first.type === "checkbox" && first.dataset.bool) {
      state.answers[name] = first.checked;
      return;
    }
    if (first.type === "checkbox") {
      state.answers[name] = nodes.filter(function (node) { return node.checked; }).map(function (node) { return node.value; });
      return;
    }
    if (first.type === "radio") {
      const picked = nodes.find(function (node) { return node.checked; });
      state.answers[name] = picked ? picked.value : state.answers[name];
      return;
    }
    state.answers[name] = first.value;
  }

  function sync() {
    const names = new Set();
    app.querySelectorAll("[name]").forEach(function (node) { names.add(node.name); });
    names.forEach(readGroup);
    if (state.answers.units === "imperial" && state.answers.heightIn === "") state.answers.heightIn = "0";
  }

  function setUnits(next) {
    const answers = state.answers;
    if (next === answers.units) return;
    const weight = parseFloat(answers.weight);
    if (Number.isFinite(weight)) {
      answers.weight = next === "metric"
        ? String(Math.round(weight * 0.45359237 * 10) / 10)
        : String(Math.round((weight / 0.45359237) * 10) / 10);
    }
    if (next === "metric" && answers.heightFt !== "") {
      answers.heightCm = String(Math.round((Number(answers.heightFt) * 12 + Number(answers.heightIn || 0)) * 2.54));
    }
    if (next === "imperial" && answers.heightCm !== "") {
      const inches = Math.round(Number(answers.heightCm) / 2.54);
      answers.heightFt = String(Math.floor(inches / 12));
      answers.heightIn = String(inches % 12);
    }
    answers.units = next;
  }

  function logoMark() {
    return '<svg class="logo-mark" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8.2 13.2c1 1.7 2.3 2.6 3.8 2.6s2.8-.9 3.8-2.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  }

  function topbar() {
    const stores = ["Walmart", "Kroger", "Aldi", "Target", "Whole Foods", "Trader Joe's", "Costco"];
    return (
      '<header class="pillbar no-print">' +
      '<button type="button" class="pill-logo" data-action="home">' + logoMark() + "Wellfed</button>" +
      '<nav class="pill-links" aria-label="Primary">' +
      '<button type="button" data-action="jump" data-target="how">How it works</button>' +
      '<button type="button" data-action="jump" data-target="features">What you get</button>' +
      '<div class="drop">' +
      '<button type="button" class="drop-toggle" data-action="menu" aria-expanded="' + (state.menu ? "true" : "false") + '">Stores <svg class="chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.2 4.2 6 8l3.8-3.8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></button>' +
      '<div class="drop-panel"' + (state.menu ? "" : " hidden") + ">" +
      stores.map(function (store) {
        return '<button type="button" data-action="jump" data-target="stores">' + esc(store) + "</button>";
      }).join("") +
      "</div></div></nav>" +
      '<div class="pill-actions">' +
      '<button type="button" class="btn-line" data-action="start">Get Started</button>' +
      '<button type="button" class="btn-fill" data-action="example">See a week</button>' +
      "</div></header>"
    );
  }

  function ticker() {
    const names = [
      '<b>Walmart</b>',
      '<span class="thin">Kroger</span>',
      "<b>Aldi</b>",
      '<span class="serifish">Target</span>',
      "<b>Whole Foods</b>",
      '<span class="thin">Trader Joe\'s</span>',
      "<b>Costco</b>",
    ];
    const row = names.map(function (name) { return name + ' <span class="dot">·</span> '; }).join("");
    return '<div class="marquee" aria-hidden="true"><div class="marquee-track">' + row + row + "</div></div>";
  }

  function renderHome() {
    app.innerHTML =
      topbar() +
      '<div class="stage" id="top">' +
      '<div class="hero">' +
      "<h1>A week of meals<br>from your answers.</h1>" +
      "<p>Answer a few questions about your size, activity, and goal. You get daily calories, seven days of food, and a grocery list with the product, the store, and the price.</p>" +
      '<button type="button" class="btn-line hero-cta" data-action="start">Get Started</button>' +
      "</div>" +
      ticker() +
      "</div>" +
      '<section class="band" id="how"><h2>How it works</h2><div class="band-grid">' +
      '<article class="glass"><h3>Tell us about you</h3><p>Age, height, weight, how you move, what you skip, and where you shop.</p></article>' +
      '<article class="glass"><h3>Get the day</h3><p>Calories, protein, carbs, and fat for one day.</p></article>' +
      '<article class="glass"><h3>Shop the week</h3><p>Seven days of meals, then the groceries to buy.</p></article>' +
      "</div></section>" +
      '<section class="band" id="features"><h2>What you get</h2><div class="band-grid">' +
      '<article class="glass"><h3>Daily macros</h3><p>Calories and macros from your size, activity, and goal.</p></article>' +
      '<article class="glass"><h3>A week of meals</h3><p>Breakfast, lunch, dinner, and snacks, with amounts and how to cook them.</p></article>' +
      '<article class="glass"><h3>The grocery list</h3><p>The cheaper option at the stores you picked, with the product and the price.</p></article>' +
      "</div></section>" +
      '<section class="band" id="stores"><h2>Stores</h2><div class="store-row">' +
      ["Walmart", "Kroger", "Aldi", "Target", "Whole Foods", "Trader Joe's", "Costco"].map(function (store) {
        return '<article class="glass">' + esc(store) + "</article>";
      }).join("") +
      "</div></section>";
  }

  function renderQuiz() {
    const step = STEPS[state.step];
    const pct = Math.round(((state.step + 1) / STEPS.length) * 100);
    const last = state.step === STEPS.length - 1;
    app.innerHTML =
      topbar() +
      '<div class="shell">' +
      '<div class="progress" aria-hidden="true"><span style="width:' + pct + '%"></span></div>' +
      '<section class="panel"><p class="kicker">Question ' + (state.step + 1) + " of " + STEPS.length + " · " + esc(step.kicker) + "</p>" +
      "<h1>" + esc(step.title) + "</h1><p class=\"lede\">" + esc(step.lede) + "</p>" +
      '<div class="fields">' + step.body(state.answers) + "</div>" +
      '<p class="error" role="alert">' + esc(state.error) + "</p>" +
      '<div class="nav">' +
      (state.step > 0
        ? '<button type="button" class="ghost" data-action="back">Back</button>'
        : '<button type="button" class="ghost" data-action="home">Back</button>') +
      '<button type="button" class="primary" data-action="next">' + (last ? "Create my plan" : "Continue") + "</button>" +
      (state.step === 0 ? '<button type="button" class="textish" data-action="example">See an example week</button>' : "") +
      (savedPlan() && state.step === 0 ? '<button type="button" class="textish" data-action="last">View the last plan</button>' : "") +
      "</div></section></div>";
    const first = app.querySelector("input, select, textarea");
    if (state.focus && first) first.focus();
    state.focus = false;
  }

  function renderStop() {
    const copy = {
      age: ["This planner is for adults 18 and older.", "A calorie target for a younger person should come from a doctor or a dietitian."],
      pregnant: ["Wellfed will not set calories during pregnancy or breastfeeding.", "Ask your doctor or a prenatal dietitian."],
      doctor: ["Follow the plan your doctor already gave you.", "This site will not replace it."],
      ed: ["Wellfed will not set calories or macros for you.", "Talk to a registered dietitian. The National Eating Disorders Association helpline is 1-800-931-2237. If you are in crisis, call or text 988."],
    };
    const lines = copy[state.stop] || copy.age;
    app.innerHTML =
      topbar() +
      '<div class="shell">' +
      '<section class="panel stop"><p class="kicker">Before a plan</p><h1>' + esc(lines[0]) + "</h1><p class=\"lede\">" + esc(lines[1]) + "</p>" +
      '<div class="nav"><button type="button" class="primary" data-action="back">Back to the question</button></div></section></div>';
  }

  function goalLine(profile, answers) {
    if (profile.goalUsed === "lose") return "Fat loss, " + profile.paceLabel;
    if (profile.goalUsed === "gain") return "Muscle gain, " + profile.paceLabel;
    if (answers.goal === "lose" && profile.goalUsed === "maintain") return "Maintenance";
    return "Maintenance";
  }

  function renderResults() {
    const plan = state.plan;
    const profile = plan.profile;
    const name = plan.answers.name ? esc(plan.answers.name) + ", here is the week." : "Here is the week.";
    const pCal = profile.protein * 4;
    const cCal = profile.carbs * 4;
    const fCal = profile.fat * 9;
    const sum = Math.max(pCal + cCal + fCal, 1);
    const pPct = pCal / sum * 100;
    const cPct = cCal / sum * 100;
    const fPct = fCal / sum * 100;
    const day = plan.days[state.day];
    const groups = [];
    plan.grocery.lines.forEach(function (line) {
      let group = groups.find(function (item) { return item.aisle === line.aisle; });
      if (!group) {
        group = { aisle: line.aisle, lines: [], total: 0 };
        groups.push(group);
      }
      group.lines.push(line);
      group.total += line.lineTotal;
    });
    const over = plan.grocery.total > plan.grocery.budget;
    const width = Math.min(100, (plan.grocery.total / Math.max(plan.grocery.budget, 1)) * 100);

    app.innerHTML =
      topbar() +
      '<div class="results">' +
      '<div class="result-actions no-print">' +
      '<button type="button" class="ghost" data-action="edit">Edit answers</button>' +
      '<button type="button" class="ghost" data-action="shuffle">Build another week</button>' +
      '<button type="button" class="ghost" data-action="print">Print</button>' +
      '<button type="button" class="textish" data-action="restart">Start over</button>' +
      "</div>" +
      "<p class=\"kicker\">" + esc(goalLine(profile, plan.answers)) + "</p><h1>" + name + "</h1>" +
      '<div class="jump no-print"><a href="#macros">Macro plan</a><a href="#planner">Daily meals</a><a href="#grocery">Grocery list</a></div>' +
      (plan.example ? '<p class="warn">This is an example week for Alex. Start over to use your own answers.</p>' : "") +
      '<section class="section" id="macros"><div class="section-head"><h2>Daily macro plan</h2></div>' +
      '<div class="stat-grid">' +
      stat(profile.treat ? "Day with treat" : "Calories", Math.round(profile.kcal).toLocaleString("en-US")) +
      stat("Protein", Math.round(profile.protein) + " g") +
      stat("Carbs", Math.round(profile.carbs) + " g") +
      stat("Fat", Math.round(profile.fat) + " g") +
      "</div>" +
      '<div class="layout" style="margin-top:16px"><div class="ring-wrap"><div class="ring" style="--p:' + pPct.toFixed(2) + ";--c:" + cPct.toFixed(2) + ";--f:" + fPct.toFixed(2) + '"><span>Meals<br />' + Math.round(profile.foodKcal).toLocaleString("en-US") + " kcal</span></div>" +
      '<div class="legend"><span><i class="p"></i>Protein</span><span><i class="c"></i>Carbs</span><span><i class="f"></i>Fat</span></div></div>' +
      '<div class="story">' + profile.narrative.map(function (line) { return "<p>" + esc(line) + "</p>"; }).join("") +
      "<p>Aim for about " + profile.fiber + " g of fiber. Water is about " + (profile.waterMl / 1000).toFixed(1) + " liters, or " + Math.round(profile.waterMl / 240) + " glasses.</p>" +
      "<p>BMI from what you entered is " + profile.bmi.toFixed(1) + ". It does not account for muscle.</p></div></div>" +
      (profile.warnings.length ? '<div class="warn" style="margin-top:12px">' + profile.warnings.map(function (line) { return "<p>" + esc(line) + "</p>"; }).join("") + "</div>" : "") +
      "</section>" +
      '<section class="section" id="planner"><div class="section-head"><div><h2>Daily meals</h2><p class="lede">Seven days, close to ' + Math.round(profile.foodKcal).toLocaleString("en-US") + " kcal" + (profile.treat ? ", with 150 kcal left for a treat" : "") + ".</p></div></div>" +
      '<div class="days no-print" role="tablist">' +
      plan.days.map(function (entry, index) {
        return '<button type="button" role="tab" aria-pressed="' + (index === state.day) + '" data-action="day" data-day="' + index + '">' + entry.name.slice(0, 3) + "</button>";
      }).join("") +
      "</div>" +
      '<p class="day-total">' + esc(day.name) + " · " + Math.round(day.totals.kcal) + " kcal · " + Math.round(day.totals.p) + " g protein · " + Math.round(day.totals.c) + " g carbs · " + Math.round(day.totals.f) + " g fat · " + Math.round(day.totals.fiber) + " g fiber</p>" +
      '<div class="meals">' + day.meals.map(function (meal, index) { return mealCard(meal, index); }).join("") + "</div></section>" +
      '<section class="section" id="grocery"><div class="section-head"><div><h2>Grocery list</h2><p class="lede">One week of the meals above. Buy from the highlighted store. Prices are examples from fall 2026. They change by city and by sale.</p></div>' +
      '<button type="button" class="ghost no-print" data-action="copy">Copy list</button></div>' +
      '<div class="meter' + (over ? " over" : "") + '"><span style="width:' + width + '%"></span></div>' +
      "<p><strong>" + money(plan.grocery.total) + "</strong> estimated for the week. Budget " + money(plan.grocery.budget) + "." +
      (over ? " About " + money(plan.grocery.overBy) + " over." : "") + "</p>" +
      groups.map(function (group) {
        return '<div class="aisle-block"><h3>' + esc(group.aisle) + "<span>" + money(group.total) + "</span></h3>" +
          group.lines.map(productCard).join("") + "</div>";
      }).join("") +
      '<p class="fine">Check the product name on the tag. Package sizes change, and a sale can beat this price. Buy amounts are rounded up to a package, a pound, or a piece of produce.</p>' +
      "</section></div>";
  }

  function stat(label, value) {
    return '<article class="stat"><span>' + esc(label) + "</span><b>" + esc(value) + "</b></article>";
  }

  function mealCard(meal, index) {
    return (
      '<article class="meal"><header><div><span class="tag">' + esc(meal.label) + (meal.leftover ? " · leftover" : "") + " · " + meal.minutes + ' min</span><h3>' + esc(meal.name) + "</h3></div>" +
      (meal.locked ? "" : '<button type="button" class="ghost no-print" data-action="swap" data-meal="' + index + '">Another ' + esc(meal.slot) + "</button>") +
      "</header><p class=\"macros-inline\">" + Math.round(meal.totals.kcal) + " kcal · " + Math.round(meal.totals.p) + " g protein · " + Math.round(meal.totals.c) + " g carbs · " + Math.round(meal.totals.f) + " g fat</p>" +
      '<ul class="ingredients">' + meal.items.filter(function (item) { return item.id !== "water" && item.grams >= 0.2; }).map(function (item) {
        return "<li><span>" + esc(item.name) + "</span><span>" + esc(item.portion) + "</span></li>";
      }).join("") + "</ul><p class=\"method\">" + esc(meal.method) + "</p></article>"
    );
  }

  function productCard(line) {
    const bought = !!state.checks[line.id];
    return (
      '<article class="product' + (bought ? " bought" : "") + '"><label class="check"><input type="checkbox" data-action="check" data-id="' + esc(line.id) + '"' + (bought ? " checked" : "") + ' aria-label="Mark ' + esc(line.name) + ' as bought" /></label><div>' +
      "<h4>" + esc(line.name) + "</h4><p class=\"exact\">" + esc(line.product) + "</p>" +
      '<p class="buy">Buy <strong>' + esc(line.packsLabel) + "</strong> at <strong>" + esc(line.storeLabel) + "</strong> · " + esc(line.unitPriceLabel) + " · line <strong>" + money(line.lineTotal) + "</strong></p>" +
      '<p class="meta">' + esc([line.boughtText, line.eatenText, line.leftoverText].filter(Boolean).join(" ")) + "</p>" +
      '<ul class="offers">' + line.offers.map(function (offer) {
        return '<li class="' + (offer.winner ? "win" : "") + '">' + (offer.winner ? "Buy · " : "Also · ") + esc(offer.storeLabel) + " · " + esc(offer.product) + " · " + esc(offer.qtyLabel) + " · " + money(offer.tripCost) + (offer.excluded ? " · store brand, not selected" : "") + "</li>";
      }).join("") + "</ul>" +
      '<p class="uses">Used in ' + esc(line.uses.join(", ")) + "</p></div></article>"
    );
  }

  function render() {
    if (state.view === "home") renderHome();
    else if (state.view === "stop") renderStop();
    else if (state.view === "results" && state.plan && !state.plan.error) renderResults();
    else renderQuiz();
    watchReveals();
    paintScroll();
  }

  function goNext() {
    sync();
    saveAnswers();
    const problem = STEPS[state.step].validate(state.answers);
    if (problem.indexOf("stop:") === 0) {
      state.stop = problem.slice(5);
      state.view = "stop";
      state.error = "";
      render();
      return;
    }
    if (problem) {
      state.error = problem;
      render();
      return;
    }
    state.error = "";
    if (state.step === STEPS.length - 1) {
      build(false);
      return;
    }
    state.step += 1;
    state.focus = true;
    render();
  }

  function build(example) {
    const answers = example ? Larder.exampleAnswers() : state.answers;
    const plan = Larder.buildPlan(answers, example ? 4 : (Date.now() % 100000) + 1);
    if (plan.error) {
      state.error = plan.error;
      state.view = "quiz";
      render();
      return;
    }
    plan.example = !!example;
    state.plan = plan;
    state.day = 0;
    state.checks = {};
    state.view = "results";
    state.error = "";
    if (!example) savePlan();
    render();
    window.scrollTo(0, 0);
  }

  function savedPlan() {
    try { return !!localStorage.getItem(PLAN_KEY); } catch (err) { return false; }
  }

  function groceryText() {
    const lines = ["Wellfed grocery list", ""];
    state.plan.grocery.lines.forEach(function (line) {
      lines.push(line.aisle + " — " + line.name);
      lines.push(line.product);
      lines.push("Buy " + line.packsLabel + " at " + line.storeLabel + " · " + line.unitPriceLabel + " · " + money(line.lineTotal));
      lines.push([line.boughtText, line.eatenText, line.leftoverText].filter(Boolean).join(" "));
      lines.push("");
    });
    lines.push("Estimated total " + money(state.plan.grocery.total));
    return lines.join("\n");
  }

  app.addEventListener("click", function (event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    if (action === "menu") {
      state.menu = !state.menu;
      render();
      return;
    }
    state.menu = false;
    if (action === "home") {
      state.view = "home";
      state.error = "";
      state.stop = "";
      render();
      window.scrollTo(0, 0);
      return;
    }
    if (action === "start") {
      state.view = "quiz";
      state.step = 0;
      state.focus = true;
      state.error = "";
      render();
      window.scrollTo(0, 0);
      return;
    }
    if (action === "jump") {
      state.view = "home";
      render();
      const target = document.getElementById(button.dataset.target);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (action === "next") goNext();
    if (action === "back") {
      const fromStop = state.view === "stop";
      if (!fromStop) sync();
      state.view = "quiz";
      state.stop = "";
      state.error = "";
      if (!fromStop && state.step > 0) state.step -= 1;
      state.focus = true;
      render();
    }
    if (action === "goto") {
      state.step = Number(button.dataset.step);
      state.view = "quiz";
      state.focus = true;
      state.error = "";
      render();
    }
    if (action === "example") build(true);
    if (action === "edit") {
      state.view = "quiz";
      state.step = STEPS.length - 1;
      state.focus = true;
      render();
    }
    if (action === "restart") {
      state.view = "home";
      state.step = 0;
      state.plan = null;
      state.focus = false;
      state.error = "";
      render();
      window.scrollTo(0, 0);
    }
    if (action === "shuffle" && state.plan) {
      const plan = Larder.buildPlan(state.plan.answers, (state.plan.seed + 97) >>> 0);
      if (!plan.error) {
        plan.example = state.plan.example;
        state.plan = plan;
        state.checks = {};
        if (!plan.example) savePlan();
        render();
      }
    }
    if (action === "day") {
      state.day = Number(button.dataset.day);
      render();
      const planner = document.getElementById("planner");
      if (planner) planner.scrollIntoView({ block: "start" });
    }
    if (action === "swap" && state.plan) {
      Larder.swapMeal(state.plan, state.day, Number(button.dataset.meal));
      if (!state.plan.example) savePlan();
      render();
    }
    if (action === "print") window.print();
    if (action === "copy" && state.plan) {
      const text = groceryText();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          button.textContent = "Copied";
        }, function () {
          window.prompt("Copy this list:", text);
        });
      } else {
        window.prompt("Copy this list:", text);
      }
    }
    if (action === "last") {
      try {
        const plan = JSON.parse(localStorage.getItem(PLAN_KEY) || "null");
        if (plan && plan.days) {
          state.plan = plan;
          state.view = "results";
          state.day = 0;
          render();
        }
      } catch (err) {}
    }
  });

  app.addEventListener("change", function (event) {
    const node = event.target;
    if (!node.name) return;
    if (node.name === "units") {
      sync();
      setUnits(node.value);
      saveAnswers();
      render();
      return;
    }
    if (node.name === "goal") {
      sync();
      saveAnswers();
      render();
      return;
    }
    readGroup(node.name);
    saveAnswers();
    if (node.dataset.action === "check") {
      state.checks[node.dataset.id] = node.checked;
      const card = node.closest(".product");
      if (card) card.classList.toggle("bought", node.checked);
    }
  });

  app.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && event.target.tagName === "INPUT") {
      event.preventDefault();
      goNext();
    }
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let revealObserver = null;
  let scrollQueued = false;

  function paintScroll() {
    if (reduceMotion.matches) return;
    const y = window.scrollY || 0;
    document.body.classList.toggle("is-scrolled", y > 24);
    const hero = document.querySelector(".hero");
    const stage = document.querySelector(".stage");
    const marquee = document.querySelector(".marquee");
    const bg = document.querySelector(".bg");
    if (hero && stage) {
      const fade = Math.min(1, y / (stage.offsetHeight * 0.7));
      hero.style.opacity = String(1 - fade);
      hero.style.transform = "translate3d(0," + (y * 0.22).toFixed(1) + "px,0)";
    }
    if (marquee) marquee.style.opacity = String(Math.max(0, 1 - y / 260));
    if (bg) {
      const shift = Math.min(y, 800) * 0.08;
      bg.style.transform = "translate3d(0," + shift.toFixed(1) + "px,0) scale(1.06)";
    }
  }

  function watchReveals() {
    if (reduceMotion.matches) return;
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    }
    document.querySelectorAll(".band, .results .section").forEach(function (node) {
      if (!node.classList.contains("is-in")) revealObserver.observe(node);
    });
  }

  window.addEventListener("scroll", function () {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(function () {
      scrollQueued = false;
      paintScroll();
    });
  }, { passive: true });

  function startReel() {
    const stage = document.querySelector(".bg");
    if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const clips = [
      "clips/couple-dinner.mp4",
      "clips/kitchen-salad.mp4",
      "clips/restaurant.mp4",
      "clips/salad.mp4",
      "clips/grocery-bags.mp4",
      "clips/grocery-fruit.mp4",
      "clips/grocery-produce.mp4",
      "clips/grocery-shoppers.mp4",
      "clips/prep-avocado.mp4",
      "clips/prep-chop.mp4",
      "clips/prep-couple.mp4",
      "clips/prep-lettuce.mp4",
      "clips/prep-lunch.mp4",
      "clips/prep-salad.mp4",
    ];
    const videos = stage.querySelectorAll("video");
    let active = 0;
    let deck = [];
    let last = "";
    let token = 0;
    let timer = 0;

    function draw() {
      if (!deck.length) {
        deck = clips.slice();
        for (let i = deck.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const swap = deck[i];
          deck[i] = deck[j];
          deck[j] = swap;
        }
        if (deck[0] === last) {
          const swap = deck[0];
          deck[0] = deck[1];
          deck[1] = swap;
        }
      }
      last = deck.shift();
      return last;
    }

    function cue(video, src, done) {
      function ready() {
        video.removeEventListener("loadeddata", ready);
        if (video.duration > 4) {
          video.currentTime = Math.random() * Math.max(0, video.duration - 3);
        }
        const playing = video.play();
        if (playing && playing.then) playing.then(done, done);
        else done();
      }
      video.addEventListener("loadeddata", ready);
      video.src = src;
    }

    function arm(video) {
      const mine = ++token;
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        if (mine === token) advance();
      }, 8000 + Math.random() * 4000);
      video.onended = function () {
        if (mine === token) advance();
      };
    }

    function advance() {
      const mine = ++token;
      window.clearTimeout(timer);
      const incoming = 1 - active;
      cue(videos[incoming], draw(), function () {
        if (mine !== token) return;
        videos[incoming].classList.add("is-on");
        videos[active].classList.remove("is-on");
        const outgoing = videos[active];
        active = incoming;
        arm(videos[active]);
        window.setTimeout(function () { outgoing.pause(); }, 1000);
      });
    }

    cue(videos[0], draw(), function () {
      videos[0].classList.add("is-on");
      arm(videos[0]);
    });
  }

  startReel();

  const params = new URLSearchParams(location.search);
  if (params.get("demo") === "1" || params.get("walk") === "1") {
    const sample = Larder.exampleAnswers();
    state.answers = Object.assign(blank(), {
      name: sample.name,
      age: String(sample.age),
      equation: sample.equation,
      units: sample.units,
      heightFt: String(sample.heightFt),
      heightIn: String(sample.heightIn),
      weight: String(sample.weight),
      goal: sample.goal,
      pace: sample.pace,
      carbs: sample.carbs,
      job: sample.job,
      steps: sample.steps,
      workouts: String(sample.workouts),
      minutes: String(sample.minutes),
      meals: String(sample.meals),
      diet: sample.diet,
      cook: String(sample.cook),
      breakfast: sample.breakfast,
      cuisines: sample.cuisines,
      spice: String(sample.spice),
      allergies: sample.allergies,
      avoids: sample.avoids,
      treat: sample.treat,
      leftovers: sample.leftovers,
      stores: sample.stores,
      budget: String(sample.budget),
      brands: sample.brands,
      clinical: sample.clinical,
      notes: sample.notes,
    });
    for (let i = 0; i < STEPS.length; i++) {
      const problem = STEPS[i].validate(state.answers);
      if (problem) {
        document.body.dataset.walk = "fail " + i + " " + problem;
        state.error = problem;
        state.step = i;
        render();
        return;
      }
    }
    const plan = Larder.buildPlan(sample, 4);
    if (plan.error) {
      document.body.dataset.walk = "fail plan " + plan.error;
      render();
    } else {
      plan.example = true;
      state.plan = plan;
      state.view = "results";
      document.body.dataset.walk = "ok";
      render();
    }
  } else {
    render();
  }
})();
