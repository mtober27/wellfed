/* Example U.S. shelf prices for named products. Not a live store feed. */
(function (root) {
  const ORDER = ["walmart", "kroger", "aldi", "target", "wholefoods", "traderjoes", "costco"];
  const O = ["omnivore"];
  const F = ["omnivore", "pescatarian"];
  const V = ["omnivore", "pescatarian", "vegetarian"];
  const A = ["omnivore", "pescatarian", "vegetarian", "vegan"];

  function L(store, tier, product, brand, pack, grams, price, perLb) {
    return {
      store: store,
      tier: tier,
      product: product,
      brand: brand,
      pack: pack,
      grams: grams,
      price: price,
      perLb: !!perLb,
    };
  }

  function perLb(names, brands, prices) {
    return ORDER.map(function (store, i) {
      return L(store, "value", names[i], brands[i], "sold by the pound", 453.6, prices[i], true);
    });
  }

  function eachPack(names, brands, pack, grams, prices) {
    return ORDER.map(function (store, i) {
      return L(store, "value", names[i], brands[i], pack, grams, prices[i], false);
    });
  }

  const PRODUCE = ["Marketside", "Kroger", "Aldi", "Good & Gather", "365 by Whole Foods Market", "Trader Joe's", "Kirkland Signature"];

  function namedProduce(item) {
    return PRODUCE.map(function (brand) {
      return brand + " " + item;
    });
  }

  const INGREDIENTS = {};

  function add(spec) {
    spec.avoids = spec.avoids || [];
    spec.allergens = spec.allergens || [];
    spec.cookYield = spec.cookYield == null ? 1 : spec.cookYield;
    spec.household = spec.household || null;
    spec.skipGrocery = !!spec.skipGrocery;
    INGREDIENTS[spec.id] = spec;
  }

  add({
    id: "chickenBreast",
    name: "Chicken breast",
    aisle: "Meat",
    cookYield: 0.75,
    diets: O,
    avoids: ["chicken"],
    per100: { kcal: 165, p: 31, c: 0, f: 3.6, fiber: 0 },
    household: { label: "oz cooked", grams: 28.35 },
    listings: [
      L("walmart", "value", "Great Value Boneless Skinless Chicken Breasts, Frozen", "Great Value", "2.5 lb bag", 1134, 6.98),
      L("walmart", "name", "Tyson Boneless Skinless Chicken Breasts, Frozen", "Tyson", "2.5 lb bag", 1134, 8.96),
      L("kroger", "value", "Kroger Boneless Skinless Chicken Breasts", "Kroger", "sold by the pound", 453.6, 2.99, true),
      L("kroger", "name", "Simple Truth Natural Boneless Skinless Chicken Breasts", "Simple Truth", "sold by the pound", 453.6, 4.79, true),
      L("aldi", "value", "Kirkwood Boneless Skinless Chicken Breast Fillets", "Kirkwood", "3 lb bag", 1361, 8.15),
      L("target", "value", "Good & Gather Boneless Skinless Chicken Breasts", "Good & Gather", "sold by the pound", 453.6, 3.89, true),
      L("target", "name", "Tyson Boneless Skinless Chicken Breasts, Frozen", "Tyson", "2.5 lb bag", 1134, 9.24),
      L("wholefoods", "value", "365 by Whole Foods Market Boneless Skinless Chicken Breast", "365 by Whole Foods Market", "sold by the pound", 453.6, 6.49, true),
      L("wholefoods", "name", "Whole Foods Market Air-Chilled Boneless Skinless Chicken Breast", "Whole Foods Market", "sold by the pound", 453.6, 8.99, true),
      L("traderjoes", "name", "Trader Joe's Organic Free Range Chicken Breast", "Trader Joe's", "sold by the pound", 453.6, 7.49, true),
      L("costco", "value", "Kirkland Signature Boneless Skinless Chicken Breast", "Kirkland Signature", "6 lb bag", 2722, 18.99),
    ],
  });

  add({
    id: "turkeyBreast",
    name: "Turkey breast",
    aisle: "Meat",
    cookYield: 0.78,
    diets: O,
    avoids: ["turkey"],
    per100: { kcal: 135, p: 30, c: 0, f: 1.5, fiber: 0 },
    household: { label: "oz cooked", grams: 28.35 },
    listings: [
      L("walmart", "value", "Jennie-O Extra Lean Oven Roasted Turkey Breast", "Jennie-O", "16 oz package", 454, 5.48),
      L("walmart", "name", "Applegate Naturals Oven Roasted Turkey Breast", "Applegate", "7 oz package", 198, 6.49),
      L("kroger", "value", "Kroger Oven Roasted Turkey Breast", "Kroger", "16 oz package", 454, 5.99),
      L("kroger", "name", "Boar's Head Ovengold Turkey Breast", "Boar's Head", "sold by the pound", 453.6, 12.99, true),
      L("aldi", "value", "Never Any! Oven Roasted Turkey Breast", "Never Any!", "9 oz package", 255, 4.85),
      L("target", "value", "Good & Gather Oven Roasted Turkey Breast", "Good & Gather", "16 oz package", 454, 5.79),
      L("target", "name", "Applegate Naturals Oven Roasted Turkey Breast", "Applegate", "7 oz package", 198, 6.79),
      L("wholefoods", "value", "365 by Whole Foods Market Oven Roasted Turkey Breast", "365 by Whole Foods Market", "6 oz package", 170, 5.99),
      L("wholefoods", "name", "Applegate Organics Roasted Turkey Breast", "Applegate", "6 oz package", 170, 7.49),
      L("traderjoes", "name", "Trader Joe's Oven Roasted Turkey Breast", "Trader Joe's", "7 oz package", 198, 4.99),
      L("costco", "value", "Kirkland Signature Oven Roasted Turkey Breast", "Kirkland Signature", "2 lb package", 907, 9.99),
    ],
  });

  add({
    id: "groundTurkey",
    name: "Ground turkey",
    aisle: "Meat",
    cookYield: 0.75,
    diets: O,
    avoids: ["turkey"],
    per100: { kcal: 203, p: 27.4, c: 0, f: 10.4, fiber: 0 },
    household: { label: "oz cooked", grams: 28.35 },
    listings: [
      L("walmart", "value", "Great Value 93% Lean Ground Turkey", "Great Value", "1 lb package", 454, 3.48),
      L("walmart", "name", "Jennie-O Lean Ground Turkey, 93% Lean", "Jennie-O", "1 lb package", 454, 4.28),
      L("kroger", "value", "Kroger 93% Lean Ground Turkey", "Kroger", "1 lb package", 454, 3.99),
      L("kroger", "name", "Simple Truth 93% Lean Ground Turkey", "Simple Truth", "1 lb package", 454, 5.49),
      L("aldi", "value", "Kirkwood 93% Lean Ground Turkey", "Kirkwood", "1 lb package", 454, 3.29),
      L("target", "value", "Good & Gather 93% Lean Ground Turkey", "Good & Gather", "1 lb package", 454, 3.99),
      L("target", "name", "Jennie-O Lean Ground Turkey, 93% Lean", "Jennie-O", "1 lb package", 454, 4.79),
      L("wholefoods", "value", "365 by Whole Foods Market 93% Lean Ground Turkey", "365 by Whole Foods Market", "1 lb package", 454, 6.49),
      L("wholefoods", "name", "Whole Foods Market No-Antibiotics Ground Turkey", "Whole Foods Market", "1 lb package", 454, 7.99),
      L("traderjoes", "name", "Trader Joe's Organic Ground Turkey", "Trader Joe's", "1 lb package", 454, 5.99),
      L("costco", "value", "Kirkland Signature Ground Turkey, 93% Lean", "Kirkland Signature", "3 lb package", 1361, 10.99),
    ],
  });

  add({
    id: "leanBeef",
    name: "Sirloin steak",
    aisle: "Meat",
    cookYield: 0.75,
    diets: O,
    avoids: ["beef"],
    per100: { kcal: 183, p: 30, c: 0, f: 6.5, fiber: 0 },
    household: { label: "oz cooked", grams: 28.35 },
    listings: [
      L("walmart", "value", "Marketside USDA Choice Beef Sirloin Steak", "Marketside", "sold by the pound", 453.6, 8.47, true),
      L("walmart", "name", "Certified Angus Beef Sirloin Steak", "Certified Angus Beef", "sold by the pound", 453.6, 10.98, true),
      L("kroger", "value", "Kroger Beef Sirloin Steak", "Kroger", "sold by the pound", 453.6, 8.99, true),
      L("kroger", "name", "Simple Truth Natural Beef Sirloin Steak", "Simple Truth", "sold by the pound", 453.6, 11.49, true),
      L("aldi", "value", "Kirkwood USDA Choice Beef Sirloin Steak", "Kirkwood", "sold by the pound", 453.6, 7.89, true),
      L("target", "value", "Good & Gather Beef Sirloin Steak", "Good & Gather", "sold by the pound", 453.6, 8.99, true),
      L("target", "name", "Good & Gather USDA Choice Beef Sirloin", "Good & Gather", "sold by the pound", 453.6, 9.99, true),
      L("wholefoods", "value", "365 by Whole Foods Market Beef Sirloin Steak", "365 by Whole Foods Market", "sold by the pound", 453.6, 11.99, true),
      L("wholefoods", "name", "Whole Foods Market Beef Sirloin, Grass-Fed", "Whole Foods Market", "sold by the pound", 453.6, 14.99, true),
      L("traderjoes", "name", "Trader Joe's Beef Sirloin Steak", "Trader Joe's", "sold by the pound", 453.6, 9.99, true),
      L("costco", "value", "Kirkland Signature USDA Choice Beef Sirloin", "Kirkland Signature", "sold by the pound", 453.6, 8.99, true),
    ],
  });

  add({
    id: "porkTenderloin",
    name: "Pork tenderloin",
    aisle: "Meat",
    cookYield: 0.75,
    diets: O,
    avoids: ["pork"],
    per100: { kcal: 143, p: 26, c: 0, f: 3.5, fiber: 0 },
    household: { label: "oz cooked", grams: 28.35 },
    listings: [
      L("walmart", "value", "Smithfield All Natural Pork Tenderloin", "Smithfield", "1.15 lb package", 522, 5.97),
      L("walmart", "name", "Smithfield Prime Fresh Pork Tenderloin", "Smithfield", "1.5 lb package", 680, 7.94),
      L("kroger", "value", "Kroger Pork Tenderloin", "Kroger", "sold by the pound", 453.6, 3.99, true),
      L("kroger", "name", "Simple Truth Pork Tenderloin", "Simple Truth", "sold by the pound", 453.6, 5.49, true),
      L("aldi", "value", "Kirkwood Pork Tenderloin", "Kirkwood", "about 1.5 lb package", 680, 5.49),
      L("target", "value", "Good & Gather Pork Tenderloin", "Good & Gather", "sold by the pound", 453.6, 4.49, true),
      L("target", "name", "Good & Gather All Natural Pork Tenderloin", "Good & Gather", "sold by the pound", 453.6, 5.29, true),
      L("wholefoods", "value", "365 by Whole Foods Market Pork Tenderloin", "365 by Whole Foods Market", "sold by the pound", 453.6, 6.99, true),
      L("wholefoods", "name", "Whole Foods Market Pork Tenderloin, No Antibiotics Ever", "Whole Foods Market", "sold by the pound", 453.6, 8.99, true),
      L("traderjoes", "name", "Trader Joe's All Natural Pork Tenderloin", "Trader Joe's", "about 1.25 lb package", 567, 6.99),
      L("costco", "value", "Kirkland Signature Pork Tenderloin", "Kirkland Signature", "2-pack, about 3 lb", 1361, 11.99),
    ],
  });

  add({
    id: "salmon",
    name: "Salmon",
    aisle: "Seafood",
    cookYield: 0.85,
    diets: F,
    avoids: ["fish"],
    allergens: ["fish"],
    per100: { kcal: 206, p: 22.1, c: 0, f: 12.4, fiber: 0 },
    household: { label: "oz cooked", grams: 28.35 },
    listings: [
      L("walmart", "value", "Great Value Atlantic Salmon Fillets, Frozen", "Great Value", "2 lb bag", 907, 9.98),
      L("walmart", "name", "Morey's Seasoned Atlantic Salmon", "Morey's", "12 oz package", 340, 8.48),
      L("kroger", "value", "Kroger Atlantic Salmon Fillet", "Kroger", "sold by the pound", 453.6, 9.99, true),
      L("kroger", "name", "Simple Truth Atlantic Salmon Fillet", "Simple Truth", "sold by the pound", 453.6, 12.99, true),
      L("aldi", "value", "Fremont Fish Market Atlantic Salmon Fillets", "Fremont Fish Market", "12 oz package", 340, 6.99),
      L("target", "value", "Good & Gather Atlantic Salmon Fillet", "Good & Gather", "sold by the pound", 453.6, 9.99, true),
      L("target", "name", "Good & Gather Skin-On Atlantic Salmon", "Good & Gather", "12 oz package", 340, 8.99),
      L("wholefoods", "value", "365 by Whole Foods Market Atlantic Salmon Fillet", "365 by Whole Foods Market", "sold by the pound", 453.6, 11.99, true),
      L("wholefoods", "name", "Whole Foods Market Salmon Fillet, Responsibly Farmed", "Whole Foods Market", "sold by the pound", 453.6, 14.99, true),
      L("traderjoes", "name", "Trader Joe's Atlantic Salmon Fillets, Frozen", "Trader Joe's", "1 lb bag", 454, 7.99),
      L("costco", "value", "Kirkland Signature Atlantic Salmon, Skin-On", "Kirkland Signature", "3 lb package", 1361, 26.99),
    ],
  });

  add({
    id: "shrimp",
    name: "Shrimp",
    aisle: "Seafood",
    cookYield: 0.8,
    diets: F,
    avoids: ["shellfish"],
    allergens: ["shellfish"],
    per100: { kcal: 99, p: 24, c: 0.2, f: 0.3, fiber: 0 },
    household: { label: "oz cooked", grams: 28.35 },
    listings: [
      L("walmart", "value", "Great Value Raw Medium Shrimp, Frozen", "Great Value", "12 oz bag", 340, 5.98),
      L("walmart", "name", "SeaPak Jumbo Butterfly Shrimp", "SeaPak", "10 oz box", 283, 6.48),
      L("kroger", "value", "Kroger Raw Medium Shrimp, Frozen", "Kroger", "12 oz bag", 340, 6.49),
      L("kroger", "name", "Simple Truth Raw Shrimp, Frozen", "Simple Truth", "12 oz bag", 340, 7.99),
      L("aldi", "value", "Fremont Fish Market Raw Shrimp, Frozen", "Fremont Fish Market", "12 oz bag", 340, 5.25),
      L("target", "value", "Good & Gather Raw Medium Shrimp, Frozen", "Good & Gather", "12 oz bag", 340, 6.29),
      L("target", "name", "Good & Gather Raw Easy Peel Shrimp", "Good & Gather", "16 oz bag", 454, 8.99),
      L("wholefoods", "value", "365 by Whole Foods Market Raw Shrimp, Frozen", "365 by Whole Foods Market", "12 oz bag", 340, 8.99),
      L("wholefoods", "name", "Whole Foods Market Raw Shrimp, Responsibly Farmed", "Whole Foods Market", "sold by the pound", 453.6, 12.99, true),
      L("traderjoes", "name", "Trader Joe's Raw Wild Blue Shrimp, Frozen", "Trader Joe's", "1 lb bag", 454, 9.99),
      L("costco", "value", "Kirkland Signature Raw Shrimp, Frozen", "Kirkland Signature", "2 lb bag", 907, 14.99),
    ],
  });

  add({
    id: "tuna",
    name: "Tuna",
    aisle: "Canned & Jarred",
    diets: F,
    avoids: ["fish"],
    allergens: ["fish"],
    per100: { kcal: 116, p: 25.5, c: 0, f: 0.8, fiber: 0 },
    household: { label: "can, drained", grams: 112 },
    listings: [
      L("walmart", "value", "Great Value Chunk Light Tuna in Water", "Great Value", "5 oz can, about 4 oz drained", 112, 0.88),
      L("walmart", "name", "StarKist Chunk Light Tuna in Water", "StarKist", "5 oz can, about 4 oz drained", 112, 1.18),
      L("kroger", "value", "Kroger Chunk Light Tuna in Water", "Kroger", "5 oz can, about 4 oz drained", 112, 0.99),
      L("kroger", "name", "StarKist Chunk Light Tuna in Water", "StarKist", "5 oz can, about 4 oz drained", 112, 1.29),
      L("aldi", "value", "Northern Catch Chunk Light Tuna in Water", "Northern Catch", "5 oz can, about 4 oz drained", 112, 0.79),
      L("target", "value", "Good & Gather Chunk Light Tuna in Water", "Good & Gather", "5 oz can, about 4 oz drained", 112, 0.99),
      L("target", "name", "StarKist Chunk Light Tuna in Water", "StarKist", "5 oz can, about 4 oz drained", 112, 1.29),
      L("wholefoods", "value", "365 by Whole Foods Market Chunk Light Tuna in Water", "365 by Whole Foods Market", "5 oz can, about 4 oz drained", 112, 1.69),
      L("wholefoods", "name", "Wild Planet Skipjack Wild Tuna", "Wild Planet", "5 oz can, about 4 oz drained", 112, 3.19),
      L("traderjoes", "name", "Trader Joe's Chunk Light Skipjack Tuna in Water", "Trader Joe's", "5 oz can, about 4 oz drained", 112, 1.49),
      L("costco", "value", "Kirkland Signature Chunk Light Tuna in Water", "Kirkland Signature", "8-pack of 5 oz cans", 896, 8.99),
    ],
  });

  add({
    id: "egg",
    name: "Eggs",
    aisle: "Dairy & Eggs",
    diets: V,
    avoids: ["eggs"],
    allergens: ["egg"],
    per100: { kcal: 143, p: 12.6, c: 0.7, f: 9.5, fiber: 0 },
    household: { label: "large eggs", grams: 50 },
    listings: [
      L("walmart", "value", "Great Value Large White Eggs", "Great Value", "12 count", 600, 3.24),
      L("walmart", "name", "Eggland's Best Large Eggs", "Eggland's Best", "12 count", 600, 4.48),
      L("kroger", "value", "Kroger Large White Eggs", "Kroger", "12 count", 600, 3.49),
      L("kroger", "name", "Simple Truth Cage-Free Large Eggs", "Simple Truth", "12 count", 600, 4.79),
      L("aldi", "value", "Goldhen Large Eggs", "Goldhen", "12 count", 600, 2.69),
      L("target", "value", "Good & Gather Large Eggs", "Good & Gather", "12 count", 600, 3.59),
      L("target", "name", "Good & Gather Cage-Free Large Eggs", "Good & Gather", "12 count", 600, 4.69),
      L("wholefoods", "value", "365 by Whole Foods Market Large Brown Eggs", "365 by Whole Foods Market", "12 count", 600, 4.49),
      L("wholefoods", "name", "Vital Farms Pasture-Raised Large Eggs", "Vital Farms", "12 count", 600, 7.99),
      L("traderjoes", "name", "Trader Joe's Large Cage Free Eggs", "Trader Joe's", "12 count", 600, 3.49),
      L("costco", "value", "Kirkland Signature Cage Free Large Eggs", "Kirkland Signature", "24 count", 1200, 5.99),
    ],
  });

  add({
    id: "tofu",
    name: "Firm tofu",
    aisle: "Produce",
    diets: A,
    avoids: ["soy"],
    allergens: ["soy"],
    per100: { kcal: 144, p: 17.3, c: 2.8, f: 8.7, fiber: 2.3 },
    household: { label: "oz", grams: 28.35 },
    listings: [
      L("walmart", "value", "House Foods Premium Firm Tofu", "House Foods", "16 oz package", 454, 1.98),
      L("walmart", "name", "Nasoya Firm Tofu", "Nasoya", "14 oz package", 397, 2.48),
      L("kroger", "value", "Simple Truth Organic Firm Tofu", "Simple Truth", "14 oz package", 397, 2.29),
      L("kroger", "name", "House Foods Premium Firm Tofu", "House Foods", "16 oz package", 454, 2.49),
      L("aldi", "value", "Earth Grown Organic Firm Tofu", "Earth Grown", "14 oz package", 397, 1.69),
      L("target", "value", "Good & Gather Firm Tofu", "Good & Gather", "16 oz package", 454, 1.99),
      L("target", "name", "House Foods Premium Firm Tofu", "House Foods", "16 oz package", 454, 2.39),
      L("wholefoods", "value", "365 by Whole Foods Market Organic Firm Tofu", "365 by Whole Foods Market", "16 oz package", 454, 2.19),
      L("wholefoods", "name", "House Foods Organic Firm Tofu", "House Foods", "16 oz package", 454, 2.69),
      L("traderjoes", "name", "Trader Joe's Organic Firm Tofu", "Trader Joe's", "14 oz package", 397, 1.99),
      L("costco", "value", "House Foods Firm Tofu", "House Foods", "4-pack, 16 oz each", 1814, 6.49),
    ],
  });

  add({
    id: "greekYogurt",
    name: "Nonfat Greek yogurt",
    aisle: "Dairy & Eggs",
    diets: V,
    avoids: ["dairy"],
    allergens: ["milk"],
    per100: { kcal: 59, p: 10.3, c: 3.6, f: 0.4, fiber: 0 },
    household: { label: "cups", grams: 240 },
    listings: [
      L("walmart", "value", "Great Value Plain Nonfat Greek Yogurt", "Great Value", "32 oz tub", 907, 3.84),
      L("walmart", "name", "Fage Total 0% Plain Greek Yogurt", "Fage", "32 oz tub", 907, 6.48),
      L("kroger", "value", "Kroger Plain Nonfat Greek Yogurt", "Kroger", "32 oz tub", 907, 4.29),
      L("kroger", "name", "Fage Total 0% Plain Greek Yogurt", "Fage", "32 oz tub", 907, 6.79),
      L("aldi", "value", "Friendly Farms Plain Nonfat Greek Yogurt", "Friendly Farms", "32 oz tub", 907, 3.45),
      L("target", "value", "Good & Gather Plain Nonfat Greek Yogurt", "Good & Gather", "32 oz tub", 907, 4.19),
      L("target", "name", "Chobani Plain Non-Fat Greek Yogurt", "Chobani", "32 oz tub", 907, 5.99),
      L("wholefoods", "value", "365 by Whole Foods Market Plain Nonfat Greek Yogurt", "365 by Whole Foods Market", "32 oz tub", 907, 4.99),
      L("wholefoods", "name", "Fage Total 0% Plain Greek Yogurt", "Fage", "32 oz tub", 907, 6.99),
      L("traderjoes", "name", "Trader Joe's Plain Nonfat Greek Yogurt", "Trader Joe's", "32 oz tub", 907, 4.49),
      L("costco", "value", "Kirkland Signature Plain Nonfat Greek Yogurt", "Kirkland Signature", "48 oz tub", 1361, 5.99),
    ],
  });

  add({
    id: "cottage",
    name: "Low-fat cottage cheese",
    aisle: "Dairy & Eggs",
    diets: V,
    avoids: ["dairy"],
    allergens: ["milk"],
    per100: { kcal: 84, p: 11.6, c: 4.3, f: 2.3, fiber: 0 },
    household: { label: "cups", grams: 226 },
    listings: [
      L("walmart", "value", "Great Value Lowfat Cottage Cheese, 2%", "Great Value", "24 oz tub", 680, 2.78),
      L("walmart", "name", "Daisy Low Fat Cottage Cheese, 2%", "Daisy", "24 oz tub", 680, 3.98),
      L("kroger", "value", "Kroger Lowfat Cottage Cheese, 2%", "Kroger", "24 oz tub", 680, 2.99),
      L("kroger", "name", "Breakstone's 2% Cottage Cheese", "Breakstone's", "22 oz tub", 624, 4.29),
      L("aldi", "value", "Friendly Farms Lowfat Cottage Cheese", "Friendly Farms", "24 oz tub", 680, 2.49),
      L("target", "value", "Good & Gather Lowfat Cottage Cheese, 2%", "Good & Gather", "24 oz tub", 680, 2.89),
      L("target", "name", "Daisy Low Fat Cottage Cheese, 2%", "Daisy", "24 oz tub", 680, 3.99),
      L("wholefoods", "value", "365 by Whole Foods Market Lowfat Cottage Cheese", "365 by Whole Foods Market", "16 oz tub", 454, 3.29),
      L("wholefoods", "name", "Good Culture Low-Fat Classic Cottage Cheese", "Good Culture", "16 oz tub", 454, 4.99),
      L("traderjoes", "name", "Trader Joe's Lowfat Cottage Cheese", "Trader Joe's", "16 oz tub", 454, 2.99),
      L("costco", "value", "Daisy Low Fat Cottage Cheese, 2%", "Daisy", "3 lb tub", 1361, 5.49),
    ],
  });

  add({
    id: "whey",
    name: "Whey protein",
    aisle: "Breakfast & Protein",
    diets: V,
    avoids: ["dairy"],
    allergens: ["milk"],
    per100: { kcal: 367, p: 80, c: 6, f: 3, fiber: 0 },
    household: { label: "scoops", grams: 30 },
    listings: [
      L("walmart", "value", "Equate High Performance Whey Protein Powder, Vanilla", "Equate", "2 lb tub", 907, 19.98),
      L("walmart", "name", "Optimum Nutrition Gold Standard 100% Whey, Vanilla", "Optimum Nutrition", "2 lb tub", 907, 34.98),
      L("kroger", "value", "Kroger Whey Protein Powder, Vanilla", "Kroger", "2 lb tub", 907, 22.99),
      L("kroger", "name", "Optimum Nutrition Gold Standard 100% Whey, Double Rich Chocolate", "Optimum Nutrition", "2 lb tub", 907, 36.99),
      L("aldi", "value", "Elevation Protein Powder, Whey", "Elevation", "1.8 lb tub", 816, 16.99),
      L("target", "value", "Good & Gather Whey Protein Powder", "Good & Gather", "2 lb tub", 907, 21.99),
      L("target", "name", "Premier Protein 100% Whey Powder, Vanilla", "Premier Protein", "1.5 lb tub", 680, 22.49),
      L("wholefoods", "value", "365 by Whole Foods Market Whey Protein Powder, Vanilla", "365 by Whole Foods Market", "1 lb tub", 454, 16.99),
      L("wholefoods", "name", "Garden of Life Sport Grass-Fed Whey, Vanilla", "Garden of Life", "1.7 lb tub", 771, 39.99),
      L("traderjoes", "name", "Trader Joe's Whey Protein Powder, Vanilla", "Trader Joe's", "1 lb tub", 454, 14.99),
      L("costco", "value", "Kirkland Signature Whey Protein Isolate, Vanilla", "Kirkland Signature", "5.4 lb bag", 2449, 42.99),
    ],
  });

  add({
    id: "peaProtein",
    name: "Pea protein",
    aisle: "Breakfast & Protein",
    diets: A,
    per100: { kcal: 380, p: 80, c: 5, f: 6, fiber: 2 },
    household: { label: "scoops", grams: 30 },
    listings: [
      L("walmart", "value", "Orgain Organic Protein Plant Based Powder, Vanilla", "Orgain", "1.4 lb tub", 635, 26.98),
      L("walmart", "name", "OWYN Plant Protein Powder, Vanilla", "OWYN", "1.2 lb tub", 544, 24.98),
      L("kroger", "value", "Simple Truth Organic Plant Protein, Vanilla", "Simple Truth", "1.2 lb tub", 544, 22.99),
      L("kroger", "name", "Orgain Organic Protein Plant Based Powder, Vanilla", "Orgain", "1.4 lb tub", 635, 28.99),
      L("aldi", "value", "Earth Grown Organic Plant Protein Powder", "Earth Grown", "1 lb tub", 454, 14.99),
      L("target", "value", "Good & Gather Plant Protein Powder, Vanilla", "Good & Gather", "1.2 lb tub", 544, 18.99),
      L("target", "name", "Orgain Organic Protein Plant Based Powder, Vanilla", "Orgain", "1.4 lb tub", 635, 27.99),
      L("wholefoods", "value", "365 by Whole Foods Market Pea Protein Powder", "365 by Whole Foods Market", "1 lb tub", 454, 16.99),
      L("wholefoods", "name", "Orgain Organic Protein Plant Based Powder, Vanilla", "Orgain", "1.4 lb tub", 635, 29.99),
      L("traderjoes", "name", "Trader Joe's Organic Pea Protein Powder", "Trader Joe's", "1 lb tub", 454, 14.99),
      L("costco", "value", "Orgain Organic Protein Plant Based Powder", "Orgain", "2.7 lb tub", 1225, 39.99),
    ],
  });

  add({
    id: "cheddar",
    name: "Cheddar cheese",
    aisle: "Dairy & Eggs",
    diets: V,
    avoids: ["dairy"],
    allergens: ["milk"],
    per100: { kcal: 403, p: 23, c: 1.3, f: 33, fiber: 0 },
    household: { label: "oz", grams: 28.35 },
    listings: [
      L("walmart", "value", "Great Value Mild Cheddar Cheese Block", "Great Value", "8 oz block", 227, 2.22),
      L("walmart", "name", "Tillamook Medium Cheddar Cheese", "Tillamook", "8 oz block", 227, 3.98),
      L("kroger", "value", "Kroger Mild Cheddar Cheese", "Kroger", "8 oz block", 227, 2.49),
      L("kroger", "name", "Tillamook Medium Cheddar Cheese", "Tillamook", "8 oz block", 227, 4.29),
      L("aldi", "value", "Happy Farms Mild Cheddar Cheese", "Happy Farms", "8 oz block", 227, 1.89),
      L("target", "value", "Good & Gather Mild Cheddar Cheese", "Good & Gather", "8 oz block", 227, 2.39),
      L("target", "name", "Tillamook Medium Cheddar", "Tillamook", "8 oz block", 227, 4.19),
      L("wholefoods", "value", "365 by Whole Foods Market Mild Cheddar", "365 by Whole Foods Market", "8 oz block", 227, 3.49),
      L("wholefoods", "name", "Tillamook Medium Cheddar Cheese", "Tillamook", "8 oz block", 227, 4.79),
      L("traderjoes", "name", "Trader Joe's Mild Cheddar Cheese", "Trader Joe's", "8 oz block", 227, 2.99),
      L("costco", "value", "Kirkland Signature Mild Cheddar Cheese", "Kirkland Signature", "2 lb block", 907, 6.49),
    ],
  });

  add({
    id: "blackBeans",
    name: "Black beans",
    aisle: "Canned & Jarred",
    diets: A,
    avoids: ["beans"],
    per100: { kcal: 132, p: 8.9, c: 23.7, f: 0.5, fiber: 8.7 },
    household: { label: "cups, drained", grams: 172 },
    listings: [
      L("walmart", "value", "Great Value Black Beans", "Great Value", "15 oz can, about 8.5 oz drained", 240, 0.78),
      L("walmart", "name", "Bush's Best Black Beans", "Bush's Best", "15 oz can, about 8.5 oz drained", 240, 1.18),
      L("kroger", "value", "Kroger Black Beans", "Kroger", "15 oz can, about 8.5 oz drained", 240, 0.89),
      L("kroger", "name", "Bush's Best Black Beans", "Bush's Best", "15 oz can, about 8.5 oz drained", 240, 1.29),
      L("aldi", "value", "Dakota's Pride Black Beans", "Dakota's Pride", "15 oz can, about 8.5 oz drained", 240, 0.65),
      L("target", "value", "Good & Gather Black Beans", "Good & Gather", "15 oz can, about 8.5 oz drained", 240, 0.85),
      L("target", "name", "Bush's Best Black Beans", "Bush's Best", "15 oz can, about 8.5 oz drained", 240, 1.29),
      L("wholefoods", "value", "365 by Whole Foods Market Organic Black Beans", "365 by Whole Foods Market", "15 oz can, about 8.5 oz drained", 240, 1.19),
      L("wholefoods", "name", "Eden Organic Black Beans, No Salt Added", "Eden", "15 oz can, about 8.5 oz drained", 240, 2.19),
      L("traderjoes", "name", "Trader Joe's Organic Black Beans", "Trader Joe's", "15 oz can, about 8.5 oz drained", 240, 0.99),
      L("costco", "value", "Kirkland Signature Organic Black Beans", "Kirkland Signature", "8-pack of 15 oz cans", 1920, 7.49),
    ],
  });

  add({
    id: "lentils",
    name: "Lentils",
    aisle: "Grains & Pasta",
    cookYield: 2.5,
    diets: A,
    avoids: ["beans"],
    per100: { kcal: 116, p: 9, c: 20.1, f: 0.4, fiber: 7.9 },
    household: { label: "cups cooked", grams: 198 },
    listings: [
      L("walmart", "value", "Great Value Dry Lentils", "Great Value", "16 oz bag", 454, 1.48),
      L("walmart", "name", "Goya Dry Lentils", "Goya", "16 oz bag", 454, 1.78),
      L("kroger", "value", "Kroger Dry Lentils", "Kroger", "16 oz bag", 454, 1.59),
      L("kroger", "name", "Goya Lentils", "Goya", "16 oz bag", 454, 1.89),
      L("aldi", "value", "Dakota's Pride Dry Lentils", "Dakota's Pride", "16 oz bag", 454, 1.19),
      L("target", "value", "Good & Gather Dry Lentils", "Good & Gather", "16 oz bag", 454, 1.49),
      L("target", "name", "Goya Dry Lentils", "Goya", "16 oz bag", 454, 1.89),
      L("wholefoods", "value", "365 by Whole Foods Market Organic Green Lentils", "365 by Whole Foods Market", "16 oz bag", 454, 2.29),
      L("wholefoods", "name", "Bob's Red Mill Green Lentils", "Bob's Red Mill", "28 oz bag", 794, 4.49),
      L("traderjoes", "name", "Trader Joe's Organic Lentils", "Trader Joe's", "16 oz bag", 454, 1.79),
      L("costco", "value", "Kirkland Signature Dry Lentils", "Kirkland Signature", "4 lb bag", 1814, 4.99),
    ],
  });

  add({
    id: "chickpeas",
    name: "Chickpeas",
    aisle: "Canned & Jarred",
    diets: A,
    avoids: ["beans"],
    per100: { kcal: 164, p: 8.9, c: 27.4, f: 2.6, fiber: 7.6 },
    household: { label: "cups, drained", grams: 164 },
    listings: [
      L("walmart", "value", "Great Value Garbanzo Beans", "Great Value", "15.5 oz can, about 8.5 oz drained", 240, 0.78),
      L("walmart", "name", "Bush's Best Garbanzo Beans", "Bush's Best", "16 oz can, about 9 oz drained", 255, 1.24),
      L("kroger", "value", "Kroger Garbanzo Beans", "Kroger", "15.5 oz can, about 8.5 oz drained", 240, 0.89),
      L("kroger", "name", "Bush's Best Chickpeas", "Bush's Best", "16 oz can, about 9 oz drained", 255, 1.29),
      L("aldi", "value", "Dakota's Pride Chickpeas", "Dakota's Pride", "15.5 oz can, about 8.5 oz drained", 240, 0.65),
      L("target", "value", "Good & Gather Chickpeas", "Good & Gather", "15.5 oz can, about 8.5 oz drained", 240, 0.85),
      L("target", "name", "Bush's Best Garbanzo Beans", "Bush's Best", "16 oz can, about 9 oz drained", 255, 1.29),
      L("wholefoods", "value", "365 by Whole Foods Market Organic Chickpeas", "365 by Whole Foods Market", "15 oz can, about 8.5 oz drained", 240, 1.19),
      L("wholefoods", "name", "Eden Organic Garbanzo Beans, No Salt Added", "Eden", "15 oz can, about 8.5 oz drained", 240, 2.29),
      L("traderjoes", "name", "Trader Joe's Organic Garbanzo Beans", "Trader Joe's", "15.5 oz can, about 8.5 oz drained", 240, 0.99),
      L("costco", "value", "Kirkland Signature Organic Chickpeas", "Kirkland Signature", "8-pack of 15 oz cans", 1920, 7.99),
    ],
  });

  add({
    id: "edamame",
    name: "Shelled edamame",
    aisle: "Frozen",
    diets: A,
    avoids: ["soy"],
    allergens: ["soy"],
    per100: { kcal: 121, p: 11.9, c: 8.9, f: 5.2, fiber: 5.2 },
    household: { label: "cups", grams: 155 },
    listings: [
      L("walmart", "value", "Great Value Shelled Edamame, Frozen", "Great Value", "12 oz bag", 340, 1.98),
      L("walmart", "name", "Seapoint Farms Shelled Edamame, Frozen", "Seapoint Farms", "10 oz bag", 283, 2.48),
      L("kroger", "value", "Simple Truth Shelled Edamame, Frozen", "Simple Truth", "10 oz bag", 283, 2.29),
      L("kroger", "name", "Seapoint Farms Shelled Edamame", "Seapoint Farms", "10 oz bag", 283, 2.79),
      L("aldi", "value", "Season's Choice Shelled Edamame, Frozen", "Season's Choice", "12 oz bag", 340, 1.69),
      L("target", "value", "Good & Gather Shelled Edamame, Frozen", "Good & Gather", "12 oz bag", 340, 1.99),
      L("target", "name", "Seapoint Farms Shelled Edamame", "Seapoint Farms", "10 oz bag", 283, 2.69),
      L("wholefoods", "value", "365 by Whole Foods Market Organic Shelled Edamame", "365 by Whole Foods Market", "10 oz bag", 283, 2.49),
      L("wholefoods", "name", "Seapoint Farms Organic Shelled Edamame", "Seapoint Farms", "10 oz bag", 283, 3.29),
      L("traderjoes", "name", "Trader Joe's Shelled Edamame, Frozen", "Trader Joe's", "16 oz bag", 454, 2.49),
      L("costco", "value", "Seapoint Farms Shelled Edamame", "Seapoint Farms", "4 lb bag", 1814, 8.99),
    ],
  });

  add({
    id: "oats",
    name: "Rolled oats",
    aisle: "Grains & Pasta",
    diets: A,
    allergens: ["gluten"],
    per100: { kcal: 379, p: 13.2, c: 67.7, f: 6.5, fiber: 10.6 },
    household: { label: "cups dry", grams: 80 },
    listings: [
      L("walmart", "value", "Great Value Old Fashioned Oats", "Great Value", "42 oz canister", 1191, 4.48),
      L("walmart", "name", "Quaker Old Fashioned Oats", "Quaker", "42 oz canister", 1191, 5.98),
      L("kroger", "value", "Kroger Old Fashioned Oats", "Kroger", "42 oz canister", 1191, 4.99),
      L("kroger", "name", "Quaker Old Fashioned Oats", "Quaker", "42 oz canister", 1191, 6.29),
      L("aldi", "value", "Millville Old Fashioned Oats", "Millville", "42 oz canister", 1191, 3.65),
      L("target", "value", "Good & Gather Old Fashioned Oats", "Good & Gather", "42 oz canister", 1191, 4.29),
      L("target", "name", "Quaker Old Fashioned Oats", "Quaker", "42 oz canister", 1191, 5.89),
      L("wholefoods", "value", "365 by Whole Foods Market Organic Old Fashioned Rolled Oats", "365 by Whole Foods Market", "42 oz canister", 1191, 5.99),
      L("wholefoods", "name", "Bob's Red Mill Extra Thick Rolled Oats", "Bob's Red Mill", "32 oz bag", 907, 6.49),
      L("traderjoes", "name", "Trader Joe's Rolled Oats", "Trader Joe's", "32 oz canister", 907, 3.99),
      L("costco", "value", "Kirkland Signature Organic Old Fashioned Oats", "Kirkland Signature", "4 lb bag", 1814, 7.99),
    ],
  });

  add({
    id: "brownRice",
    name: "Brown rice",
    aisle: "Grains & Pasta",
    cookYield: 3,
    diets: A,
    per100: { kcal: 123, p: 2.7, c: 25.6, f: 1, fiber: 1.6 },
    household: { label: "cups cooked", grams: 158 },
    listings: [
      L("walmart", "value", "Great Value Long Grain Brown Rice", "Great Value", "2 lb bag", 907, 1.84),
      L("walmart", "name", "Uncle Ben's Natural Whole Grain Brown Rice", "Ben's Original", "2 lb bag", 907, 3.28),
      L("kroger", "value", "Kroger Long Grain Brown Rice", "Kroger", "2 lb bag", 907, 1.99),
      L("kroger", "name", "Ben's Original Whole Grain Brown Rice", "Ben's Original", "2 lb bag", 907, 3.49),
      L("aldi", "value", "Earthly Grains Brown Rice", "Earthly Grains", "2 lb bag", 907, 1.55),
      L("target", "value", "Good & Gather Long Grain Brown Rice", "Good & Gather", "2 lb bag", 907, 1.89),
      L("target", "name", "Ben's Original Whole Grain Brown Rice", "Ben's Original", "2 lb bag", 907, 3.39),
      L("wholefoods", "value", "365 by Whole Foods Market Organic Long Grain Brown Rice", "365 by Whole Foods Market", "2 lb bag", 907, 3.49),
      L("wholefoods", "name", "Lundberg Organic Long Grain Brown Rice", "Lundberg", "2 lb bag", 907, 4.99),
      L("traderjoes", "name", "Trader Joe's Organic Brown Rice", "Trader Joe's", "2 lb bag", 907, 2.49),
      L("costco", "value", "Kirkland Signature Brown Rice", "Kirkland Signature", "12 lb bag", 5443, 9.99),
    ],
  });

  add({
    id: "quinoa",
    name: "Quinoa",
    aisle: "Grains & Pasta",
    cookYield: 3,
    diets: A,
    per100: { kcal: 120, p: 4.4, c: 21.3, f: 1.9, fiber: 2.8 },
    household: { label: "cups cooked", grams: 185 },
    listings: [
      L("walmart", "value", "Great Value Quinoa", "Great Value", "16 oz bag", 454, 3.48),
      L("walmart", "name", "Bob's Red Mill Organic Quinoa", "Bob's Red Mill", "26 oz bag", 737, 7.98),
      L("kroger", "value", "Simple Truth Organic Quinoa", "Simple Truth", "16 oz bag", 454, 4.29),
      L("kroger", "name", "Bob's Red Mill Organic Quinoa", "Bob's Red Mill", "26 oz bag", 737, 8.49),
      L("aldi", "value", "Simply Nature Organic Quinoa", "Simply Nature", "16 oz bag", 454, 3.29),
      L("target", "value", "Good & Gather Quinoa", "Good & Gather", "16 oz bag", 454, 3.69),
      L("target", "name", "Bob's Red Mill Tri-Color Quinoa", "Bob's Red Mill", "16 oz bag", 454, 5.99),
      L("wholefoods", "value", "365 by Whole Foods Market Organic Quinoa", "365 by Whole Foods Market", "16 oz bag", 454, 4.49),
      L("wholefoods", "name", "Alter Eco Organic Rainbow Quinoa", "Alter Eco", "16 oz bag", 454, 6.49),
      L("traderjoes", "name", "Trader Joe's Organic Quinoa", "Trader Joe's", "16 oz bag", 454, 3.99),
      L("costco", "value", "Kirkland Signature Organic Quinoa", "Kirkland Signature", "4.5 lb bag", 2041, 9.99),
    ],
  });

  add({
    id: "sweetPotato",
    name: "Sweet potato",
    aisle: "Produce",
    diets: A,
    per100: { kcal: 90, p: 2, c: 20.7, f: 0.2, fiber: 3.3 },
    household: { label: "cups cooked", grams: 200 },
    listings: perLb(namedProduce("Sweet Potatoes"), PRODUCE, [1.18, 1.28, 0.99, 1.24, 1.99, 1.29, 0.98]),
  });

  add({
    id: "potato",
    name: "Potato",
    aisle: "Produce",
    diets: A,
    per100: { kcal: 93, p: 2.5, c: 21.2, f: 0.1, fiber: 2.2 },
    household: { label: "cups cooked", grams: 156 },
    listings: [
      L("walmart", "value", "Marketside Russet Potatoes", "Marketside", "5 lb bag", 2268, 4.48),
      L("kroger", "value", "Kroger Russet Potatoes", "Kroger", "5 lb bag", 2268, 4.99),
      L("aldi", "value", "Russet Potatoes", "Aldi", "5 lb bag", 2268, 3.89),
      L("target", "value", "Good & Gather Russet Potatoes", "Good & Gather", "5 lb bag", 2268, 4.79),
      L("wholefoods", "value", "365 by Whole Foods Market Organic Russet Potatoes", "365 by Whole Foods Market", "3 lb bag", 1361, 4.99),
      L("traderjoes", "name", "Trader Joe's Russet Potatoes", "Trader Joe's", "3 lb bag", 1361, 3.49),
      L("costco", "value", "Kirkland Signature Russet Potatoes", "Kirkland Signature", "10 lb bag", 4536, 6.99),
    ],
  });

  add({
    id: "pasta",
    name: "Spaghetti",
    aisle: "Grains & Pasta",
    cookYield: 2.4,
    diets: A,
    allergens: ["gluten"],
    per100: { kcal: 157, p: 5.8, c: 30.6, f: 0.9, fiber: 1.8 },
    household: { label: "cups cooked", grams: 140 },
    listings: [
      L("walmart", "value", "Great Value Spaghetti", "Great Value", "16 oz box", 454, 0.98),
      L("walmart", "name", "Barilla Spaghetti", "Barilla", "16 oz box", 454, 1.64),
      L("kroger", "value", "Kroger Spaghetti", "Kroger", "16 oz box", 454, 1.09),
      L("kroger", "name", "Barilla Spaghetti", "Barilla", "16 oz box", 454, 1.79),
      L("aldi", "value", "Reggano Spaghetti", "Reggano", "16 oz box", 454, 0.85),
      L("target", "value", "Good & Gather Spaghetti", "Good & Gather", "16 oz box", 454, 1.09),
      L("target", "name", "Barilla Spaghetti", "Barilla", "16 oz box", 454, 1.69),
      L("wholefoods", "value", "365 by Whole Foods Market Spaghetti", "365 by Whole Foods Market", "16 oz box", 454, 1.49),
      L("wholefoods", "name", "De Cecco Spaghetti No. 12", "De Cecco", "16 oz box", 454, 2.49),
      L("traderjoes", "name", "Trader Joe's Italian Spaghetti", "Trader Joe's", "16 oz box", 454, 0.99),
      L("costco", "value", "Garofalo Spaghetti", "Garofalo", "5 lb box", 2268, 6.99),
    ],
  });

  add({
    id: "sourdough",
    name: "Sourdough bread",
    aisle: "Bakery",
    diets: A,
    allergens: ["gluten"],
    per100: { kcal: 272, p: 10.7, c: 51.9, f: 2.4, fiber: 2.4 },
    household: { label: "slices", grams: 38 },
    listings: [
      L("walmart", "value", "Marketside Sliced Sourdough Bread", "Marketside", "24 oz loaf", 680, 2.98),
      L("walmart", "name", "Pepperidge Farm Farmhouse Sourdough Bread", "Pepperidge Farm", "24 oz loaf", 680, 4.28),
      L("kroger", "value", "Kroger Sliced Sourdough", "Kroger", "24 oz loaf", 680, 3.29),
      L("kroger", "name", "Private Selection Sourdough Bread", "Private Selection", "24 oz loaf", 680, 4.49),
      L("aldi", "value", "Specially Selected Sliced Sourdough", "Specially Selected", "24 oz loaf", 680, 2.69),
      L("target", "value", "Good & Gather Sliced Sourdough", "Good & Gather", "22 oz loaf", 624, 3.19),
      L("target", "name", "Good & Gather San Francisco Style Sourdough", "Good & Gather", "24 oz loaf", 680, 3.79),
      L("wholefoods", "value", "365 by Whole Foods Market Sliced Sourdough", "365 by Whole Foods Market", "24 oz loaf", 680, 3.99),
      L("wholefoods", "name", "Whole Foods Market Bakery Sourdough", "Whole Foods Market", "24 oz loaf", 680, 4.99),
      L("traderjoes", "name", "Trader Joe's San Francisco Style Sourdough", "Trader Joe's", "24 oz loaf", 680, 3.49),
      L("costco", "value", "Kirkland Signature Sourdough Loaf", "Kirkland Signature", "2-pack, 32 oz each", 1814, 5.99),
    ],
  });

  add({
    id: "flourTortilla",
    name: "Flour tortillas",
    aisle: "Bakery",
    diets: A,
    allergens: ["gluten"],
    per100: { kcal: 306, p: 8.2, c: 51, f: 8, fiber: 2.4 },
    household: { label: "tortillas", grams: 49 },
    listings: [
      L("walmart", "value", "Great Value Flour Burrito Tortillas", "Great Value", "8 count, 17.5 oz", 496, 1.98),
      L("walmart", "name", "Mission Super Soft Flour Tortillas, Burrito Size", "Mission", "8 count", 496, 2.98),
      L("kroger", "value", "Kroger Flour Tortillas, Burrito Size", "Kroger", "8 count", 496, 2.19),
      L("kroger", "name", "Mission Flour Tortillas, Burrito", "Mission", "8 count", 496, 3.29),
      L("aldi", "value", "Pueblo Lindo Flour Tortillas", "Pueblo Lindo", "10 count", 453, 1.65),
      L("target", "value", "Good & Gather Flour Tortillas, Burrito Size", "Good & Gather", "8 count", 496, 2.09),
      L("target", "name", "Mission Flour Tortillas, Burrito Size", "Mission", "8 count", 496, 3.19),
      L("wholefoods", "value", "365 by Whole Foods Market Flour Tortillas", "365 by Whole Foods Market", "8 count", 454, 2.99),
      L("wholefoods", "name", "Maria and Ricardo's Flour Tortillas", "Maria and Ricardo's", "8 count", 397, 3.99),
      L("traderjoes", "name", "Trader Joe's Flour Tortillas", "Trader Joe's", "10 count", 397, 2.29),
      L("costco", "value", "Kirkland Signature Flour Tortillas", "Kirkland Signature", "20 count", 1134, 4.99),
    ],
  });

  add({
    id: "cornTortilla",
    name: "Corn tortillas",
    aisle: "Bakery",
    diets: A,
    per100: { kcal: 218, p: 5.7, c: 44.6, f: 2.9, fiber: 6.3 },
    household: { label: "tortillas", grams: 26 },
    listings: [
      L("walmart", "value", "Mission White Corn Tortillas", "Mission", "30 count", 780, 2.48),
      L("walmart", "name", "Guerrero White Corn Tortillas", "Guerrero", "80 count", 1814, 4.98),
      L("kroger", "value", "Kroger White Corn Tortillas", "Kroger", "30 count", 780, 2.29),
      L("kroger", "name", "Mission White Corn Tortillas", "Mission", "30 count", 780, 2.79),
      L("aldi", "value", "Pueblo Lindo White Corn Tortillas", "Pueblo Lindo", "30 count", 680, 1.89),
      L("target", "value", "Good & Gather White Corn Tortillas", "Good & Gather", "30 count", 780, 2.19),
      L("target", "name", "Mission White Corn Tortillas", "Mission", "30 count", 780, 2.69),
      L("wholefoods", "value", "365 by Whole Foods Market Organic Yellow Corn Tortillas", "365 by Whole Foods Market", "12 count", 312, 2.49),
      L("wholefoods", "name", "Mi Rancho Organic White Corn Tortillas", "Mi Rancho", "12 count", 340, 3.49),
      L("traderjoes", "name", "Trader Joe's Corn Tortillas", "Trader Joe's", "12 count", 312, 1.49),
      L("costco", "value", "Kirkland Signature Corn Tortillas", "Kirkland Signature", "40 count", 1040, 3.99),
    ],
  });

  add({
    id: "banana",
    name: "Banana",
    aisle: "Produce",
    diets: A,
    per100: { kcal: 89, p: 1.1, c: 22.8, f: 0.3, fiber: 2.6 },
    household: { label: "medium bananas", grams: 118 },
    listings: perLb(namedProduce("Bananas"), PRODUCE, [0.56, 0.62, 0.48, 0.64, 0.79, 0.69, 0.46]),
  });

  add({
    id: "blueberries",
    name: "Blueberries",
    aisle: "Produce",
    diets: A,
    per100: { kcal: 57, p: 0.7, c: 14.5, f: 0.3, fiber: 2.4 },
    household: { label: "cups", grams: 148 },
    listings: [
      L("walmart", "value", "Marketside Blueberries", "Marketside", "18 oz clamshell", 510, 4.98),
      L("walmart", "name", "Driscoll's Blueberries", "Driscoll's", "11 oz clamshell", 312, 3.98),
      L("kroger", "value", "Kroger Blueberries", "Kroger", "18 oz clamshell", 510, 5.49),
      L("kroger", "name", "Driscoll's Blueberries", "Driscoll's", "11 oz clamshell", 312, 4.49),
      L("aldi", "value", "Friendly Farms Blueberries", "Friendly Farms", "12 oz clamshell", 340, 2.89),
      L("target", "value", "Good & Gather Blueberries", "Good & Gather", "18 oz clamshell", 510, 4.99),
      L("target", "name", "Driscoll's Blueberries", "Driscoll's", "11 oz clamshell", 312, 4.29),
      L("wholefoods", "value", "365 by Whole Foods Market Organic Blueberries", "365 by Whole Foods Market", "6 oz clamshell", 170, 3.99),
      L("wholefoods", "name", "Driscoll's Organic Blueberries", "Driscoll's", "6 oz clamshell", 170, 4.99),
      L("traderjoes", "name", "Trader Joe's Blueberries", "Trader Joe's", "12 oz clamshell", 340, 3.99),
      L("costco", "value", "Kirkland Signature Blueberries", "Kirkland Signature", "18 oz clamshell, 2-pack", 1020, 6.99),
    ],
  });

  add({
    id: "apple",
    name: "Apple",
    aisle: "Produce",
    diets: A,
    per100: { kcal: 52, p: 0.3, c: 13.8, f: 0.2, fiber: 2.4 },
    household: { label: "medium apples", grams: 182 },
    listings: perLb(namedProduce("Gala Apples"), PRODUCE, [1.48, 1.68, 1.29, 1.58, 2.29, 1.49, 1.18]),
  });

  add({
    id: "broccoli",
    name: "Broccoli",
    aisle: "Produce",
    diets: A,
    per100: { kcal: 35, p: 2.4, c: 7.2, f: 0.4, fiber: 3.3 },
    household: { label: "cups", grams: 91 },
    listings: perLb(namedProduce("Broccoli Crowns"), PRODUCE, [1.68, 1.88, 1.49, 1.78, 2.49, 1.99, 1.48]),
  });

  add({
    id: "spinach",
    name: "Baby spinach",
    aisle: "Produce",
    diets: A,
    per100: { kcal: 23, p: 2.9, c: 3.6, f: 0.4, fiber: 2.2 },
    household: { label: "cups", grams: 30 },
    listings: [
      L("walmart", "value", "Marketside Baby Spinach", "Marketside", "10 oz clamshell", 283, 2.98),
      L("walmart", "name", "Fresh Express Baby Spinach", "Fresh Express", "5 oz clamshell", 142, 2.48),
      L("kroger", "value", "Kroger Baby Spinach", "Kroger", "10 oz clamshell", 283, 3.29),
      L("kroger", "name", "Simple Truth Organic Baby Spinach", "Simple Truth", "5 oz clamshell", 142, 3.49),
      L("aldi", "value", "Little Salad Bar Baby Spinach", "Little Salad Bar", "8 oz box", 227, 1.89),
      L("target", "value", "Good & Gather Baby Spinach", "Good & Gather", "10 oz clamshell", 283, 2.99),
      L("target", "name", "Good & Gather Organic Baby Spinach", "Good & Gather", "5 oz clamshell", 142, 3.29),
      L("wholefoods", "value", "365 by Whole Foods Market Organic Baby Spinach", "365 by Whole Foods Market", "5 oz clamshell", 142, 2.99),
      L("wholefoods", "name", "Earthbound Farm Organic Baby Spinach", "Earthbound Farm", "5 oz clamshell", 142, 3.99),
      L("traderjoes", "name", "Trader Joe's Baby Spinach", "Trader Joe's", "6 oz clamshell", 170, 2.29),
      L("costco", "value", "Organicgirl Baby Spinach", "Organicgirl", "1 lb clamshell", 454, 4.99),
    ],
  });

  add({
    id: "mixedGreens",
    name: "Mixed greens",
    aisle: "Produce",
    diets: A,
    per100: { kcal: 17, p: 1.5, c: 3, f: 0.2, fiber: 1.5 },
    household: { label: "cups", grams: 36 },
    listings: [
      L("walmart", "value", "Marketside Spring Mix", "Marketside", "5 oz clamshell", 142, 2.48),
      L("walmart", "name", "Fresh Express Spring Mix", "Fresh Express", "5 oz clamshell", 142, 2.98),
      L("kroger", "value", "Kroger Spring Mix", "Kroger", "5 oz clamshell", 142, 2.79),
      L("kroger", "name", "Simple Truth Organic Spring Mix", "Simple Truth", "5 oz clamshell", 142, 3.49),
      L("aldi", "value", "Little Salad Bar Spring Mix", "Little Salad Bar", "5 oz clamshell", 142, 1.99),
      L("target", "value", "Good & Gather Spring Mix", "Good & Gather", "5 oz clamshell", 142, 2.69),
      L("target", "name", "Good & Gather Organic Spring Mix", "Good & Gather", "5 oz clamshell", 142, 3.29),
      L("wholefoods", "value", "365 by Whole Foods Market Organic Spring Mix", "365 by Whole Foods Market", "5 oz clamshell", 142, 3.49),
      L("wholefoods", "name", "Earthbound Farm Organic Spring Mix", "Earthbound Farm", "5 oz clamshell", 142, 3.99),
      L("traderjoes", "name", "Trader Joe's Herb Salad Mix", "Trader Joe's", "5 oz clamshell", 142, 2.49),
      L("costco", "value", "Organicgirl Spring Mix", "Organicgirl", "1 lb clamshell", 454, 5.49),
    ],
  });

  add({
    id: "bellPepper",
    name: "Bell pepper",
    aisle: "Produce",
    diets: A,
    per100: { kcal: 31, p: 1, c: 6, f: 0.3, fiber: 2.1 },
    household: { label: "peppers", grams: 119 },
    listings: eachPack(namedProduce("Red Bell Peppers"), PRODUCE, "1 pepper, about 4 oz", 119, [0.98, 1.18, 0.79, 1.09, 1.69, 0.99, 0.89]),
  });

  add({
    id: "onion",
    name: "Onion",
    aisle: "Produce",
    diets: A,
    avoids: ["onions"],
    per100: { kcal: 40, p: 1.1, c: 9.3, f: 0.1, fiber: 1.7 },
    household: { label: "cups chopped", grams: 160 },
    listings: perLb(namedProduce("Yellow Onions"), PRODUCE, [0.98, 1.08, 0.72, 0.99, 1.49, 0.89, 0.68]),
  });

  add({
    id: "tomato",
    name: "Tomato",
    aisle: "Produce",
    diets: A,
    per100: { kcal: 18, p: 0.9, c: 3.9, f: 0.2, fiber: 1.2 },
    household: { label: "medium tomatoes", grams: 123 },
    listings: perLb(namedProduce("Roma Tomatoes"), PRODUCE, [1.48, 1.68, 1.24, 1.58, 2.49, 1.69, 1.28]),
  });

  add({
    id: "carrot",
    name: "Carrots",
    aisle: "Produce",
    diets: A,
    per100: { kcal: 41, p: 0.9, c: 9.6, f: 0.2, fiber: 2.8 },
    household: { label: "cups", grams: 128 },
    listings: [
      L("walmart", "value", "Marketside Whole Carrots", "Marketside", "2 lb bag", 907, 1.68),
      L("kroger", "value", "Kroger Whole Carrots", "Kroger", "2 lb bag", 907, 1.79),
      L("aldi", "value", "Whole Carrots", "Aldi", "2 lb bag", 907, 1.29),
      L("target", "value", "Good & Gather Whole Carrots", "Good & Gather", "2 lb bag", 907, 1.69),
      L("wholefoods", "value", "365 by Whole Foods Market Organic Carrots", "365 by Whole Foods Market", "2 lb bag", 907, 2.29),
      L("traderjoes", "name", "Trader Joe's Organic Carrots", "Trader Joe's", "2 lb bag", 907, 1.79),
      L("costco", "value", "Kirkland Signature Carrots", "Kirkland Signature", "5 lb bag", 2268, 3.49),
    ],
  });

  add({
    id: "avocado",
    name: "Avocado",
    aisle: "Produce",
    diets: A,
    avoids: ["avocado"],
    per100: { kcal: 160, p: 2, c: 8.5, f: 14.7, fiber: 6.7 },
    household: { label: "avocados", grams: 170 },
    listings: eachPack(namedProduce("Hass Avocados"), PRODUCE, "1 avocado", 170, [1.18, 1.28, 0.89, 1.25, 1.99, 1.29, 0.99]),
  });

  add({
    id: "mushrooms",
    name: "Mushrooms",
    aisle: "Produce",
    diets: A,
    avoids: ["mushrooms"],
    per100: { kcal: 22, p: 3.1, c: 3.3, f: 0.3, fiber: 1 },
    household: { label: "cups sliced", grams: 70 },
    listings: [
      L("walmart", "value", "Marketside Sliced White Mushrooms", "Marketside", "8 oz package", 227, 2.18),
      L("kroger", "value", "Kroger Sliced White Mushrooms", "Kroger", "8 oz package", 227, 2.29),
      L("aldi", "value", "Sliced White Mushrooms", "Aldi", "8 oz package", 227, 1.79),
      L("target", "value", "Good & Gather Sliced Mushrooms", "Good & Gather", "8 oz package", 227, 2.19),
      L("wholefoods", "value", "365 by Whole Foods Market Organic Sliced Mushrooms", "365 by Whole Foods Market", "8 oz package", 227, 2.99),
      L("traderjoes", "name", "Trader Joe's Sliced White Mushrooms", "Trader Joe's", "8 oz package", 227, 1.99),
      L("costco", "value", "Kirkland Signature Sliced Mushrooms", "Kirkland Signature", "24 oz package", 680, 4.49),
    ],
  });

  add({
    id: "cilantro",
    name: "Cilantro",
    aisle: "Produce",
    diets: A,
    avoids: ["cilantro"],
    per100: { kcal: 23, p: 2.1, c: 3.7, f: 0.5, fiber: 2.8 },
    household: { label: "cups chopped", grams: 16 },
    listings: eachPack(
      ["Marketside Fresh Cilantro", "Kroger Fresh Cilantro", "Fresh Cilantro", "Good & Gather Cilantro", "365 by Whole Foods Market Organic Cilantro", "Trader Joe's Cilantro", "Kirkland Signature Cilantro"],
      PRODUCE,
      "1 bunch",
      30,
      [0.88, 0.98, 0.72, 0.89, 1.49, 0.79, 0.69]
    ),
  });

  add({
    id: "garlic",
    name: "Garlic",
    aisle: "Produce",
    diets: A,
    per100: { kcal: 149, p: 6.4, c: 33.1, f: 0.5, fiber: 2.1 },
    household: { label: "cloves", grams: 5 },
    listings: eachPack(namedProduce("Garlic"), PRODUCE, "1 bulb", 40, [0.58, 0.68, 0.45, 0.62, 0.99, 0.59, 0.42]),
  });

  add({
    id: "oliveOil",
    name: "Olive oil",
    aisle: "Oils & Spreads",
    diets: A,
    per100: { kcal: 884, p: 0, c: 0, f: 100, fiber: 0 },
    household: { label: "tbsp", grams: 13.5 },
    listings: [
      L("walmart", "value", "Great Value Extra Virgin Olive Oil", "Great Value", "17 fl oz bottle", 458, 6.48),
      L("walmart", "name", "California Olive Ranch Extra Virgin Olive Oil", "California Olive Ranch", "16.9 fl oz bottle", 455, 9.97),
      L("kroger", "value", "Kroger Extra Virgin Olive Oil", "Kroger", "17 fl oz bottle", 458, 6.99),
      L("kroger", "name", "Simple Truth Organic Extra Virgin Olive Oil", "Simple Truth", "16.9 fl oz bottle", 455, 8.99),
      L("aldi", "value", "Carlini Extra Virgin Olive Oil", "Carlini", "16.9 fl oz bottle", 455, 4.89),
      L("target", "value", "Good & Gather Extra Virgin Olive Oil", "Good & Gather", "16.9 fl oz bottle", 455, 6.79),
      L("target", "name", "California Olive Ranch Destinations Extra Virgin Olive Oil", "California Olive Ranch", "16.9 fl oz bottle", 455, 9.99),
      L("wholefoods", "value", "365 by Whole Foods Market Extra Virgin Olive Oil", "365 by Whole Foods Market", "16.9 fl oz bottle", 455, 7.99),
      L("wholefoods", "name", "California Olive Ranch Extra Virgin Olive Oil", "California Olive Ranch", "16.9 fl oz bottle", 455, 10.99),
      L("traderjoes", "name", "Trader Joe's Extra Virgin Olive Oil", "Trader Joe's", "16.9 fl oz bottle", 455, 5.99),
      L("costco", "value", "Kirkland Signature Organic Extra Virgin Olive Oil", "Kirkland Signature", "2 L bottle", 1832, 16.99),
    ],
  });

  add({
    id: "peanutButter",
    name: "Peanut butter",
    aisle: "Oils & Spreads",
    diets: A,
    avoids: ["peanuts"],
    allergens: ["peanut"],
    per100: { kcal: 588, p: 25, c: 20, f: 50, fiber: 6 },
    household: { label: "tbsp", grams: 16 },
    listings: [
      L("walmart", "value", "Great Value Creamy Peanut Butter", "Great Value", "16 oz jar", 454, 1.94),
      L("walmart", "name", "Jif Creamy Peanut Butter", "Jif", "16 oz jar", 454, 2.98),
      L("kroger", "value", "Kroger Creamy Peanut Butter", "Kroger", "16 oz jar", 454, 2.19),
      L("kroger", "name", "Jif Creamy Peanut Butter", "Jif", "16 oz jar", 454, 3.29),
      L("aldi", "value", "Peanut Delight Creamy Peanut Butter", "Peanut Delight", "16 oz jar", 454, 1.65),
      L("target", "value", "Good & Gather Creamy Peanut Butter", "Good & Gather", "16 oz jar", 454, 1.99),
      L("target", "name", "Jif Creamy Peanut Butter", "Jif", "16 oz jar", 454, 3.19),
      L("wholefoods", "value", "365 by Whole Foods Market Creamy Peanut Butter", "365 by Whole Foods Market", "16 oz jar", 454, 2.99),
      L("wholefoods", "name", "Santa Cruz Organic Creamy Peanut Butter", "Santa Cruz Organic", "16 oz jar", 454, 4.99),
      L("traderjoes", "name", "Trader Joe's Creamy Salted Peanut Butter", "Trader Joe's", "16 oz jar", 454, 2.49),
      L("costco", "value", "Kirkland Signature Creamy Peanut Butter", "Kirkland Signature", "2-pack, 40 oz each", 2268, 9.99),
    ],
  });

  add({
    id: "almonds",
    name: "Almonds",
    aisle: "Oils & Spreads",
    diets: A,
    avoids: ["tree-nuts"],
    allergens: ["tree-nut"],
    per100: { kcal: 579, p: 21.2, c: 21.6, f: 49.9, fiber: 12.5 },
    household: { label: "oz", grams: 28.35 },
    listings: [
      L("walmart", "value", "Great Value Whole Natural Almonds", "Great Value", "16 oz bag", 454, 6.48),
      L("walmart", "name", "Blue Diamond Whole Natural Almonds", "Blue Diamond", "16 oz bag", 454, 7.98),
      L("kroger", "value", "Kroger Whole Natural Almonds", "Kroger", "16 oz bag", 454, 6.99),
      L("kroger", "name", "Blue Diamond Whole Natural Almonds", "Blue Diamond", "14 oz bag", 397, 7.49),
      L("aldi", "value", "Southern Grove Whole Almonds", "Southern Grove", "16 oz bag", 454, 5.49),
      L("target", "value", "Good & Gather Whole Almonds", "Good & Gather", "16 oz bag", 454, 6.29),
      L("target", "name", "Blue Diamond Whole Natural Almonds", "Blue Diamond", "16 oz bag", 454, 7.99),
      L("wholefoods", "value", "365 by Whole Foods Market Whole Raw Almonds", "365 by Whole Foods Market", "16 oz bag", 454, 8.99),
      L("wholefoods", "name", "Barney Bakery Whole Natural Almonds", "Barney", "16 oz bag", 454, 10.99),
      L("traderjoes", "name", "Trader Joe's Raw Almonds", "Trader Joe's", "16 oz bag", 454, 5.99),
      L("costco", "value", "Kirkland Signature Whole Almonds", "Kirkland Signature", "3 lb bag", 1361, 12.99),
    ],
  });

  add({
    id: "hummus",
    name: "Hummus",
    aisle: "Dairy & Eggs",
    diets: A,
    avoids: ["beans"],
    allergens: ["sesame"],
    per100: { kcal: 166, p: 7.9, c: 14.3, f: 9.6, fiber: 6 },
    household: { label: "tbsp", grams: 15 },
    listings: [
      L("walmart", "value", "Marketside Classic Hummus", "Marketside", "10 oz tub", 283, 2.48),
      L("walmart", "name", "Sabra Classic Hummus", "Sabra", "10 oz tub", 283, 3.98),
      L("kroger", "value", "Kroger Classic Hummus", "Kroger", "10 oz tub", 283, 2.79),
      L("kroger", "name", "Sabra Classic Hummus", "Sabra", "10 oz tub", 283, 4.29),
      L("aldi", "value", "Park Street Deli Classic Hummus", "Park Street Deli", "10 oz tub", 283, 2.19),
      L("target", "value", "Good & Gather Classic Hummus", "Good & Gather", "10 oz tub", 283, 2.59),
      L("target", "name", "Sabra Classic Hummus", "Sabra", "10 oz tub", 283, 3.99),
      L("wholefoods", "value", "365 by Whole Foods Market Classic Hummus", "365 by Whole Foods Market", "10 oz tub", 283, 3.29),
      L("wholefoods", "name", "Lilly's Foods Classic Hummus", "Lilly's", "8 oz tub", 227, 3.99),
      L("traderjoes", "name", "Trader Joe's Mediterranean Hummus", "Trader Joe's", "10 oz tub", 283, 2.49),
      L("costco", "value", "Kirkland Signature Classic Hummus", "Kirkland Signature", "2-pack, 16 oz each", 907, 6.49),
    ],
  });

  add({
    id: "chia",
    name: "Chia seeds",
    aisle: "Grains & Pasta",
    diets: A,
    per100: { kcal: 486, p: 16.5, c: 42.1, f: 30.7, fiber: 34.4 },
    household: { label: "tbsp", grams: 12 },
    listings: [
      L("walmart", "value", "Great Value Chia Seeds", "Great Value", "12 oz bag", 340, 4.98),
      L("walmart", "name", "BetterBody Foods Organic Chia Seeds", "BetterBody Foods", "2 lb bag", 907, 9.98),
      L("kroger", "value", "Simple Truth Organic Chia Seeds", "Simple Truth", "12 oz bag", 340, 5.49),
      L("kroger", "name", "Bob's Red Mill Chia Seeds", "Bob's Red Mill", "16 oz bag", 454, 7.99),
      L("aldi", "value", "Simply Nature Organic Chia Seeds", "Simply Nature", "12 oz bag", 340, 3.99),
      L("target", "value", "Good & Gather Chia Seeds", "Good & Gather", "12 oz bag", 340, 4.79),
      L("target", "name", "BetterBody Foods Organic Chia Seeds", "BetterBody Foods", "15 oz bag", 425, 6.99),
      L("wholefoods", "value", "365 by Whole Foods Market Organic Chia Seeds", "365 by Whole Foods Market", "15 oz bag", 425, 6.49),
      L("wholefoods", "name", "Navitas Organics Chia Seeds", "Navitas", "8 oz bag", 227, 6.99),
      L("traderjoes", "name", "Trader Joe's Chia Seeds", "Trader Joe's", "16 oz bag", 454, 4.99),
      L("costco", "value", "Kirkland Signature Organic Chia Seeds", "Kirkland Signature", "3 lb bag", 1361, 9.99),
    ],
  });

  add({
    id: "sunflowerButter",
    name: "Sunflower seed butter",
    aisle: "Oils & Spreads",
    diets: A,
    per100: { kcal: 560, p: 20, c: 20, f: 47, fiber: 5 },
    household: { label: "tbsp", grams: 16 },
    listings: [
      L("walmart", "value", "SunButter Natural Sunflower Butter", "SunButter", "16 oz jar", 454, 6.48),
      L("walmart", "name", "SunButter No Sugar Added Sunflower Butter", "SunButter", "16 oz jar", 454, 7.28),
      L("kroger", "value", "SunButter Sunflower Butter", "SunButter", "16 oz jar", 454, 6.99),
      L("kroger", "name", "SunButter Organic Sunflower Butter", "SunButter", "16 oz jar", 454, 8.49),
      L("aldi", "value", "Simply Nature Sunflower Seed Butter", "Simply Nature", "16 oz jar", 454, 4.99),
      L("target", "value", "Good & Gather Sunflower Seed Butter", "Good & Gather", "16 oz jar", 454, 5.79),
      L("target", "name", "SunButter Natural Sunflower Butter", "SunButter", "16 oz jar", 454, 6.99),
      L("wholefoods", "value", "365 by Whole Foods Market Sunflower Seed Butter", "365 by Whole Foods Market", "16 oz jar", 454, 6.49),
      L("wholefoods", "name", "SunButter Organic Sunflower Butter", "SunButter", "16 oz jar", 454, 8.99),
      L("traderjoes", "name", "Trader Joe's Sunflower Seed Butter", "Trader Joe's", "16 oz jar", 454, 4.99),
      L("costco", "value", "SunButter Sunflower Butter", "SunButter", "2-pack, 16 oz", 908, 11.99),
    ],
  });

  add({
    id: "coconutMilk",
    name: "Coconut milk",
    aisle: "Canned & Jarred",
    diets: A,
    per100: { kcal: 197, p: 2, c: 2.8, f: 21.3, fiber: 0 },
    household: { label: "cups", grams: 240 },
    listings: [
      L("walmart", "value", "Great Value Coconut Milk", "Great Value", "13.5 fl oz can", 400, 1.48),
      L("walmart", "name", "Thai Kitchen Unsweetened Coconut Milk", "Thai Kitchen", "13.66 fl oz can", 403, 2.28),
      L("kroger", "value", "Kroger Coconut Milk", "Kroger", "13.5 fl oz can", 400, 1.59),
      L("kroger", "name", "Thai Kitchen Coconut Milk", "Thai Kitchen", "13.66 fl oz can", 403, 2.49),
      L("aldi", "value", "Thai-style Coconut Milk", "Aldi", "13.5 fl oz can", 400, 1.19),
      L("target", "value", "Good & Gather Coconut Milk", "Good & Gather", "13.5 fl oz can", 400, 1.49),
      L("target", "name", "Thai Kitchen Unsweetened Coconut Milk", "Thai Kitchen", "13.66 fl oz can", 403, 2.39),
      L("wholefoods", "value", "365 by Whole Foods Market Organic Coconut Milk", "365 by Whole Foods Market", "13.5 fl oz can", 400, 2.19),
      L("wholefoods", "name", "Native Forest Organic Classic Coconut Milk", "Native Forest", "13.5 fl oz can", 400, 2.99),
      L("traderjoes", "name", "Trader Joe's Organic Coconut Milk", "Trader Joe's", "13.5 fl oz can", 400, 1.69),
      L("costco", "value", "Thai Kitchen Coconut Milk", "Thai Kitchen", "6-pack of 13.66 fl oz cans", 2418, 9.99),
    ],
  });

  add({
    id: "milk",
    name: "2% milk",
    aisle: "Dairy & Eggs",
    diets: V,
    avoids: ["dairy"],
    allergens: ["milk"],
    per100: { kcal: 50, p: 3.3, c: 4.8, f: 2, fiber: 0 },
    household: { label: "cups", grams: 244 },
    listings: [
      L("walmart", "value", "Great Value 2% Reduced Fat Milk", "Great Value", "1 gallon", 3890, 3.18),
      L("walmart", "name", "Fairlife 2% Ultra-Filtered Milk", "Fairlife", "52 fl oz bottle", 1540, 4.58),
      L("kroger", "value", "Kroger 2% Reduced Fat Milk", "Kroger", "1 gallon", 3890, 3.29),
      L("kroger", "name", "Simple Truth Organic 2% Milk", "Simple Truth", "1 gallon", 3890, 5.99),
      L("aldi", "value", "Friendly Farms 2% Reduced Fat Milk", "Friendly Farms", "1 gallon", 3890, 2.55),
      L("target", "value", "Good & Gather 2% Reduced Fat Milk", "Good & Gather", "1 gallon", 3890, 3.39),
      L("target", "name", "Horizon Organic 2% Milk", "Horizon", "half gallon", 1890, 4.79),
      L("wholefoods", "value", "365 by Whole Foods Market Organic 2% Milk", "365 by Whole Foods Market", "1 gallon", 3890, 6.49),
      L("wholefoods", "name", "Straus Family Creamery Organic 2% Milk", "Straus", "half gallon", 1890, 5.99),
      L("traderjoes", "name", "Trader Joe's Organic 2% Reduced Fat Milk", "Trader Joe's", "1 gallon", 3890, 5.49),
      L("costco", "value", "Kirkland Signature 2% Milk", "Kirkland Signature", "2 gallons", 7780, 6.29),
    ],
  });

  add({
    id: "soyMilk",
    name: "Unsweetened soy milk",
    aisle: "Beverages",
    diets: A,
    avoids: ["soy"],
    allergens: ["soy"],
    per100: { kcal: 38, p: 3.4, c: 1.4, f: 1.8, fiber: 0.4 },
    household: { label: "cups", grams: 243 },
    listings: [
      L("walmart", "value", "Great Value Unsweetened Original Soymilk", "Great Value", "half gallon", 1890, 2.48),
      L("walmart", "name", "Silk Unsweetened Original Soymilk", "Silk", "half gallon", 1890, 3.48),
      L("kroger", "value", "Simple Truth Unsweetened Soymilk", "Simple Truth", "half gallon", 1890, 2.79),
      L("kroger", "name", "Silk Unsweetened Soymilk", "Silk", "half gallon", 1890, 3.69),
      L("aldi", "value", "Friendly Farms Unsweetened Soymilk", "Friendly Farms", "half gallon", 1890, 2.19),
      L("target", "value", "Good & Gather Unsweetened Soymilk", "Good & Gather", "half gallon", 1890, 2.59),
      L("target", "name", "Silk Unsweetened Original Soymilk", "Silk", "half gallon", 1890, 3.59),
      L("wholefoods", "value", "365 by Whole Foods Market Organic Unsweetened Soymilk", "365 by Whole Foods Market", "half gallon", 1890, 2.99),
      L("wholefoods", "name", "WestSoy Organic Unsweetened Soymilk", "WestSoy", "half gallon", 1890, 3.79),
      L("traderjoes", "name", "Trader Joe's Unsweetened Organic Soy Beverage", "Trader Joe's", "half gallon", 1890, 2.49),
      L("costco", "value", "Kirkland Signature Organic Soy Beverage, Unsweetened", "Kirkland Signature", "12-pack of 32 fl oz", 11340, 14.99),
    ],
  });

  add({
    id: "tamari",
    name: "Gluten-free tamari",
    aisle: "Condiments",
    diets: A,
    avoids: ["soy"],
    allergens: ["soy"],
    per100: { kcal: 60, p: 10.5, c: 5.6, f: 0.1, fiber: 0.8 },
    household: { label: "tbsp", grams: 16 },
    listings: [
      L("walmart", "value", "San-J Tamari Gluten Free Soy Sauce", "San-J", "10 fl oz bottle", 295, 4.28),
      L("walmart", "name", "Kikkoman Gluten-Free Tamari Soy Sauce", "Kikkoman", "10 fl oz bottle", 295, 4.88),
      L("kroger", "value", "Kikkoman Gluten-Free Tamari", "Kikkoman", "10 fl oz bottle", 295, 4.99),
      L("kroger", "name", "San-J Tamari Gluten Free Soy Sauce", "San-J", "20 fl oz bottle", 590, 7.49),
      L("aldi", "value", "Fusia Gluten Free Soy Sauce", "Fusia", "10 fl oz bottle", 295, 2.49),
      L("target", "value", "Good & Gather Gluten Free Soy Sauce", "Good & Gather", "10 fl oz bottle", 295, 2.79),
      L("target", "name", "San-J Tamari Gluten Free Soy Sauce", "San-J", "10 fl oz bottle", 295, 4.49),
      L("wholefoods", "value", "365 by Whole Foods Market Tamari", "365 by Whole Foods Market", "20 fl oz bottle", 590, 4.99),
      L("wholefoods", "name", "San-J Organic Tamari Gluten Free Soy Sauce", "San-J", "10 fl oz bottle", 295, 4.99),
      L("traderjoes", "name", "Trader Joe's Organic Gluten Free Tamari", "Trader Joe's", "17.6 fl oz bottle", 520, 2.99),
      L("costco", "value", "Kikkoman Tamari Gluten-Free Soy Sauce", "Kikkoman", "20 fl oz bottle", 590, 5.49),
    ],
  });

  add({
    id: "marinara",
    name: "Marinara sauce",
    aisle: "Canned & Jarred",
    diets: A,
    per100: { kcal: 50, p: 1.5, c: 8, f: 1.2, fiber: 1.6 },
    household: { label: "cups", grams: 245 },
    listings: [
      L("walmart", "value", "Great Value Traditional Pasta Sauce", "Great Value", "24 oz jar", 680, 1.18),
      L("walmart", "name", "Rao's Homemade Marinara Sauce", "Rao's", "24 oz jar", 680, 7.98),
      L("kroger", "value", "Kroger Marinara Pasta Sauce", "Kroger", "24 oz jar", 680, 1.39),
      L("kroger", "name", "Rao's Homemade Marinara", "Rao's", "24 oz jar", 680, 8.49),
      L("aldi", "value", "Reggano Marinara Pasta Sauce", "Reggano", "24 oz jar", 680, 1.15),
      L("target", "value", "Good & Gather Marinara Sauce", "Good & Gather", "24 oz jar", 680, 1.39),
      L("target", "name", "Rao's Homemade Marinara Sauce", "Rao's", "24 oz jar", 680, 8.29),
      L("wholefoods", "value", "365 by Whole Foods Market Organic Marinara", "365 by Whole Foods Market", "25 oz jar", 709, 2.69),
      L("wholefoods", "name", "Rao's Homemade Marinara Sauce", "Rao's", "24 oz jar", 680, 8.99),
      L("traderjoes", "name", "Trader Joe's Organic Marinara", "Trader Joe's", "25 oz jar", 709, 1.99),
      L("costco", "value", "Rao's Homemade Marinara Sauce", "Rao's", "2-pack, 32 oz", 1814, 12.99),
    ],
  });

  add({
    id: "salsa",
    name: "Salsa",
    aisle: "Condiments",
    diets: A,
    per100: { kcal: 36, p: 1.5, c: 7, f: 0.2, fiber: 1.6 },
    household: { label: "tbsp", grams: 16 },
    listings: [
      L("walmart", "value", "Great Value Mild Salsa", "Great Value", "24 oz jar", 680, 2.18),
      L("walmart", "name", "Pace Mild Picante Sauce", "Pace", "16 oz jar", 454, 2.48),
      L("kroger", "value", "Kroger Mild Salsa", "Kroger", "24 oz jar", 680, 2.39),
      L("kroger", "name", "Pace Mild Picante Sauce", "Pace", "16 oz jar", 454, 2.79),
      L("aldi", "value", "Casa Mamita Mild Salsa", "Casa Mamita", "24 oz jar", 680, 1.89),
      L("target", "value", "Good & Gather Mild Salsa", "Good & Gather", "24 oz jar", 680, 2.29),
      L("target", "name", "Pace Mild Picante Sauce", "Pace", "16 oz jar", 454, 2.69),
      L("wholefoods", "value", "365 by Whole Foods Market Organic Mild Salsa", "365 by Whole Foods Market", "16 oz jar", 454, 2.99),
      L("wholefoods", "name", "Frontera Mild Salsa", "Frontera", "16 oz jar", 454, 3.99),
      L("traderjoes", "name", "Trader Joe's Salsa Autentica", "Trader Joe's", "12 oz jar", 340, 1.99),
      L("costco", "value", "Kirkland Signature Organic Salsa", "Kirkland Signature", "38 oz jar", 1077, 5.49),
    ],
  });

  add({
    id: "maple",
    name: "Maple syrup",
    aisle: "Condiments",
    diets: A,
    per100: { kcal: 260, p: 0, c: 67, f: 0.1, fiber: 0 },
    household: { label: "tbsp", grams: 20 },
    listings: [
      L("walmart", "value", "Great Value Pure Maple Syrup", "Great Value", "12 fl oz bottle", 354, 5.98),
      L("walmart", "name", "Pearl Milling Company Original Syrup", "Pearl Milling Company", "24 fl oz bottle", 710, 3.98),
      L("kroger", "value", "Kroger Pure Maple Syrup", "Kroger", "8 fl oz bottle", 236, 4.99),
      L("kroger", "name", "Simple Truth Organic Pure Maple Syrup", "Simple Truth", "8 fl oz bottle", 236, 6.49),
      L("aldi", "value", "Specially Selected Pure Maple Syrup", "Specially Selected", "12 fl oz bottle", 354, 5.49),
      L("target", "value", "Good & Gather Pure Maple Syrup", "Good & Gather", "8 fl oz bottle", 236, 4.79),
      L("target", "name", "Good & Gather Organic Pure Maple Syrup", "Good & Gather", "8 fl oz bottle", 236, 6.29),
      L("wholefoods", "value", "365 by Whole Foods Market Organic Maple Syrup", "365 by Whole Foods Market", "12 fl oz bottle", 354, 7.99),
      L("wholefoods", "name", "Coombs Family Farms Organic Maple Syrup", "Coombs", "12 fl oz bottle", 354, 9.99),
      L("traderjoes", "name", "Trader Joe's Organic Maple Syrup", "Trader Joe's", "8 fl oz bottle", 236, 3.99),
      L("costco", "value", "Kirkland Signature Organic Maple Syrup", "Kirkland Signature", "33.8 fl oz bottle", 1000, 11.99),
    ],
  });

  add({
    id: "cumin",
    name: "Ground cumin",
    aisle: "Spices",
    diets: A,
    per100: { kcal: 375, p: 17.8, c: 44.2, f: 22.3, fiber: 10.5 },
    household: { label: "tsp", grams: 2.1 },
    listings: [
      L("walmart", "value", "Great Value Ground Cumin", "Great Value", "2.5 oz bottle", 71, 2.48),
      L("walmart", "name", "McCormick Ground Cumin", "McCormick", "1.5 oz bottle", 43, 4.12),
      L("kroger", "value", "Kroger Ground Cumin", "Kroger", "2 oz bottle", 57, 2.79),
      L("kroger", "name", "McCormick Ground Cumin", "McCormick", "1.5 oz bottle", 43, 4.49),
      L("aldi", "value", "Stonemill Ground Cumin", "Stonemill", "1.9 oz bottle", 54, 1.29),
      L("target", "value", "Good & Gather Ground Cumin", "Good & Gather", "1.75 oz bottle", 50, 2.19),
      L("target", "name", "McCormick Ground Cumin", "McCormick", "1.5 oz bottle", 43, 4.29),
      L("wholefoods", "value", "365 by Whole Foods Market Ground Cumin", "365 by Whole Foods Market", "1.9 oz bottle", 54, 3.49),
      L("wholefoods", "name", "Simply Organic Ground Cumin", "Simply Organic", "2.31 oz bottle", 65, 6.49),
      L("traderjoes", "name", "Trader Joe's Ground Cumin", "Trader Joe's", "1.9 oz bottle", 54, 1.99),
      L("costco", "value", "Kirkland Signature Organic Ground Cumin", "Kirkland Signature", "8.5 oz bottle", 241, 6.49),
    ],
  });

  add({
    id: "chiliPowder",
    name: "Chili powder",
    aisle: "Spices",
    diets: A,
    per100: { kcal: 282, p: 13.5, c: 49.7, f: 14.3, fiber: 34 },
    household: { label: "tsp", grams: 2.6 },
    listings: [
      L("walmart", "value", "Great Value Chili Powder", "Great Value", "2.5 oz bottle", 71, 2.48),
      L("walmart", "name", "McCormick Chili Powder", "McCormick", "2.5 oz bottle", 71, 4.12),
      L("kroger", "value", "Kroger Chili Powder", "Kroger", "2.5 oz bottle", 71, 2.79),
      L("kroger", "name", "McCormick Chili Powder", "McCormick", "2.5 oz bottle", 71, 4.49),
      L("aldi", "value", "Stonemill Chili Powder", "Stonemill", "2.5 oz bottle", 71, 1.29),
      L("target", "value", "Good & Gather Chili Powder", "Good & Gather", "2.5 oz bottle", 71, 2.19),
      L("target", "name", "McCormick Chili Powder", "McCormick", "2.5 oz bottle", 71, 4.29),
      L("wholefoods", "value", "365 by Whole Foods Market Chili Powder", "365 by Whole Foods Market", "2.3 oz bottle", 65, 3.49),
      L("wholefoods", "name", "Simply Organic Chili Powder", "Simply Organic", "2.89 oz bottle", 82, 6.49),
      L("traderjoes", "name", "Trader Joe's Chili Powder", "Trader Joe's", "2.2 oz bottle", 62, 1.99),
      L("costco", "value", "Kirkland Signature Chili Powder", "Kirkland Signature", "12 oz bottle", 340, 5.99),
    ],
  });

  add({
    id: "lemon",
    name: "Lemon",
    aisle: "Produce",
    cookYield: 0.35,
    diets: A,
    per100: { kcal: 22, p: 0.4, c: 6.9, f: 0.2, fiber: 0.3 },
    household: { label: "tbsp juice", grams: 15 },
    listings: eachPack(namedProduce("Lemons"), PRODUCE, "1 lemon", 84, [0.58, 0.68, 0.45, 0.65, 0.99, 0.49, 0.42]),
  });

  add({
    id: "pepper",
    name: "Black pepper",
    aisle: "Spices",
    diets: A,
    per100: { kcal: 251, p: 10.4, c: 63.9, f: 3.3, fiber: 25.3 },
    household: { label: "tsp", grams: 2.3 },
    listings: [
      L("walmart", "value", "Great Value Ground Black Pepper", "Great Value", "3 oz bottle", 85, 2.48),
      L("walmart", "name", "McCormick Pure Ground Black Pepper", "McCormick", "3 oz bottle", 85, 4.98),
      L("kroger", "value", "Kroger Ground Black Pepper", "Kroger", "3 oz bottle", 85, 2.79),
      L("kroger", "name", "McCormick Pure Ground Black Pepper", "McCormick", "3 oz bottle", 85, 5.29),
      L("aldi", "value", "Stonemill Ground Black Pepper", "Stonemill", "1.8 oz bottle", 51, 1.19),
      L("target", "value", "Good & Gather Ground Black Pepper", "Good & Gather", "2.5 oz bottle", 71, 2.29),
      L("target", "name", "McCormick Pure Ground Black Pepper", "McCormick", "3 oz bottle", 85, 5.19),
      L("wholefoods", "value", "365 by Whole Foods Market Ground Black Pepper", "365 by Whole Foods Market", "2.3 oz bottle", 65, 3.99),
      L("wholefoods", "name", "Simply Organic Ground Black Pepper", "Simply Organic", "2.31 oz bottle", 65, 6.99),
      L("traderjoes", "name", "Trader Joe's Ground Black Pepper", "Trader Joe's", "2.2 oz bottle", 62, 1.99),
      L("costco", "value", "Kirkland Signature Ground Black Pepper", "Kirkland Signature", "12.7 oz bottle", 360, 6.49),
    ],
  });

  add({
    id: "salt",
    name: "Iodized salt",
    aisle: "Spices",
    diets: A,
    per100: { kcal: 0, p: 0, c: 0, f: 0, fiber: 0 },
    household: { label: "tsp", grams: 6 },
    listings: [
      L("walmart", "value", "Great Value Iodized Salt", "Great Value", "26 oz canister", 737, 0.72),
      L("walmart", "name", "Morton Iodized Salt", "Morton", "26 oz canister", 737, 1.14),
      L("kroger", "value", "Kroger Iodized Salt", "Kroger", "26 oz canister", 737, 0.89),
      L("kroger", "name", "Morton Iodized Salt", "Morton", "26 oz canister", 737, 1.24),
      L("aldi", "value", "Stonemill Iodized Salt", "Stonemill", "26 oz canister", 737, 0.55),
      L("target", "value", "Good & Gather Iodized Salt", "Good & Gather", "26 oz canister", 737, 0.79),
      L("target", "name", "Morton Iodized Salt", "Morton", "26 oz canister", 737, 1.19),
      L("wholefoods", "value", "365 by Whole Foods Market Iodized Salt", "365 by Whole Foods Market", "26 oz canister", 737, 1.49),
      L("wholefoods", "name", "Morton Iodized Salt", "Morton", "26 oz canister", 737, 1.69),
      L("traderjoes", "name", "Trader Joe's Iodized Salt", "Trader Joe's", "26 oz canister", 737, 0.99),
      L("costco", "value", "Morton Iodized Salt", "Morton", "4 lb box", 1814, 2.49),
    ],
  });

  add({
    id: "water",
    name: "Water",
    aisle: "Beverages",
    diets: A,
    per100: { kcal: 0, p: 0, c: 0, f: 0, fiber: 0 },
    listings: [],
    skipGrocery: true,
  });

  root.LARDER_INGREDIENTS = INGREDIENTS;
})(typeof globalThis !== "undefined" ? globalThis : this);
