const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
require("dotenv").config();

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function createRecipe(data) {
  const { ingredients, steps, notes, ...recipeData } = data;
  return prisma.recipe.create({
    data: {
      ...recipeData,
      ingredients: { create: ingredients },
      steps: { create: steps },
      notes: { create: notes ?? [] },
    },
  });
}

async function main() {
  // Clear all child tables before parent
  await prisma.step.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.familyNote.deleteMany();
  await prisma.recipe.deleteMany();

  // ─────────────────────────────────────────────────────────────────────
  // ITALIAN — Grandma Louise
  // ─────────────────────────────────────────────────────────────────────

  await createRecipe({
    title: "Grandma Louise's Homemade Pasta Dough",
    description:
      "Hand-rolled egg pasta made on the kitchen table. The dough is worked until silky and cut into tagliatelle for Sunday gravy or Christmas dinner.",
    cultural: "Italian",
    holiday: "Christmas",
    prepTime: 90,
    notes: [
      {
        author: "Grandma Louise",
        content:
          "Never use a machine. The warmth of your hands is what makes the dough come together. My mother taught me this in Naples.",
      },
    ],
    ingredients: [
      { order: 1, amount: "400", unit: "g", name: "00 flour (plus more for dusting)" },
      { order: 2, amount: "4", unit: null, name: "large eggs, room temperature" },
      { order: 3, amount: "1", unit: "tbsp", name: "extra-virgin olive oil" },
      { order: 4, amount: "1", unit: "tsp", name: "fine sea salt" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Mound the flour on a large wooden board or clean work surface. Make a wide well in the center — wide enough to hold all the eggs without spilling." },
      { stepNumber: 2, instruction: "Crack the eggs into the well. Add the olive oil and salt. Beat the eggs gently with a fork, slowly incorporating flour from the inner walls of the well. Do not break the outer wall." },
      { stepNumber: 3, instruction: "When the mixture becomes too thick to use the fork, use your hands to bring the dough together into a rough ball. Scrape up any dried bits from the board and incorporate them." },
      { stepNumber: 4, instruction: "Knead the dough firmly for 10 to 12 minutes, pushing forward with the heel of your hand, folding, and rotating. The dough is ready when it is smooth, elastic, and springs back when you press a finger into it." },
      { stepNumber: 5, instruction: "Wrap the dough tightly in plastic wrap and rest at room temperature for at least 30 minutes. This relaxes the gluten and makes rolling possible." },
      { stepNumber: 6, instruction: "Divide the dough into four pieces. Working with one piece at a time (keep the rest wrapped), use a rolling pin to roll it as thin as possible — you should be able to see your hand through it." },
      { stepNumber: 7, instruction: "Lightly flour the sheet and fold it loosely into thirds like a letter. Cut across the folds into strips about 6mm wide for tagliatelle. Shake the strips loose and dust with flour to prevent sticking." },
      { stepNumber: 8, instruction: "Cook immediately in a large pot of heavily salted boiling water for 2 to 3 minutes, or drape over the back of a chair to dry for up to 2 hours before cooking." },
    ],
  });

  await createRecipe({
    title: "Lasagna al Forno",
    description:
      "Layered fresh pasta with slow-cooked Bolognese, béchamel, and aged Parmigiano-Reggiano. Baked until the top is bubbling and bronze. Grandma Louise's Easter centerpiece.",
    cultural: "Italian",
    holiday: "Easter",
    prepTime: 180,
    notes: [
      {
        author: "Grandma Louise",
        content:
          "Make the ragù the day before. It tastes completely different after a night in the refrigerator.",
      },
    ],
    ingredients: [
      { order: 1, amount: "1", unit: "batch", name: "fresh pasta dough (see pasta recipe), rolled into sheets" },
      { order: 2, amount: "500", unit: "g", name: "ground beef (80/20)" },
      { order: 3, amount: "250", unit: "g", name: "ground pork" },
      { order: 4, amount: "1", unit: null, name: "medium onion, finely diced" },
      { order: 5, amount: "2", unit: null, name: "carrots, finely diced" },
      { order: 6, amount: "2", unit: null, name: "celery stalks, finely diced" },
      { order: 7, amount: "4", unit: null, name: "garlic cloves, minced" },
      { order: 8, amount: "150", unit: "ml", name: "dry red wine" },
      { order: 9, amount: "400", unit: "g", name: "canned whole San Marzano tomatoes, crushed by hand" },
      { order: 10, amount: "2", unit: "tbsp", name: "tomato paste" },
      { order: 11, amount: "100", unit: "ml", name: "whole milk" },
      { order: 12, amount: "1", unit: "liter", name: "whole milk (for béchamel)" },
      { order: 13, amount: "80", unit: "g", name: "unsalted butter (for béchamel)" },
      { order: 14, amount: "80", unit: "g", name: "00 flour (for béchamel)" },
      { order: 15, amount: "1/4", unit: "tsp", name: "freshly grated nutmeg" },
      { order: 16, amount: "200", unit: "g", name: "Parmigiano-Reggiano, freshly grated" },
      { order: 17, amount: "to taste", unit: null, name: "salt and black pepper" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Make the Bolognese: heat a splash of olive oil in a heavy pot over medium-high heat. Add onion, carrot, and celery. Cook, stirring, for 8 minutes until softened and beginning to color." },
      { stepNumber: 2, instruction: "Add the garlic and cook 1 minute more. Add the ground beef and pork. Break up the meat and cook until browned all over, about 10 minutes. Season with salt and pepper." },
      { stepNumber: 3, instruction: "Add the tomato paste and stir to coat the meat. Cook for 2 minutes. Pour in the red wine and let it bubble until almost evaporated, about 3 minutes." },
      { stepNumber: 4, instruction: "Add the crushed tomatoes. Reduce heat to the lowest possible setting. Partially cover and cook for at least 2 hours, stirring occasionally. Add the milk in the last 30 minutes — this softens the acidity." },
      { stepNumber: 5, instruction: "Make the béchamel: melt the butter in a saucepan over medium heat. Add the flour and whisk constantly for 2 minutes to cook out the raw flour taste. Slowly pour in the warm milk, whisking constantly to prevent lumps. Cook, whisking, until the sauce thickens enough to coat the back of a spoon. Season with salt, white pepper, and nutmeg." },
      { stepNumber: 6, instruction: "Blanch the pasta sheets in salted boiling water for 30 seconds. Lay them on a clean damp towel to prevent sticking." },
      { stepNumber: 7, instruction: "Preheat oven to 190°C (375°F). Spread a thin layer of Bolognese on the bottom of a deep 33x23cm baking dish. Layer: pasta sheet, Bolognese, béchamel, Parmigiano. Repeat until you run out of components, ending with béchamel and a generous layer of Parmigiano." },
      { stepNumber: 8, instruction: "Bake uncovered for 40 to 45 minutes until the top is deeply golden and the edges are bubbling. Rest for 15 minutes before cutting — this is important. The lasagna needs to set." },
    ],
  });

  await createRecipe({
    title: "Stuffed Artichokes (Carciofi Ripieni)",
    description:
      "Whole artichokes packed with seasoned breadcrumbs, garlic, parsley, and Pecorino, then steamed in white wine and olive oil. The dish Grandma Louise brings to every Thanksgiving.",
    cultural: "Italian",
    holiday: "Thanksgiving",
    prepTime: 75,
    notes: [
      {
        author: "Grandma Louise",
        content:
          "This is what I bring to Thanksgiving every year. The Americans always ask for the recipe.",
      },
    ],
    ingredients: [
      { order: 1, amount: "4", unit: null, name: "large globe artichokes" },
      { order: 2, amount: "1", unit: null, name: "lemon, halved (for acidulated water)" },
      { order: 3, amount: "1.5", unit: "cups", name: "plain breadcrumbs (not panko)" },
      { order: 4, amount: "4", unit: null, name: "garlic cloves, very finely minced" },
      { order: 5, amount: "1/2", unit: "cup", name: "fresh flat-leaf parsley, finely chopped" },
      { order: 6, amount: "100", unit: "g", name: "Pecorino Romano, finely grated" },
      { order: 7, amount: "4", unit: "tbsp", name: "extra-virgin olive oil (plus more for drizzling)" },
      { order: 8, amount: "1/2", unit: "cup", name: "dry white wine" },
      { order: 9, amount: "1/2", unit: "cup", name: "water" },
      { order: 10, amount: "to taste", unit: null, name: "salt and black pepper" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Fill a large bowl with cold water and squeeze in the lemon juice, dropping the halves in too. This is acidulated water — artichokes brown immediately when cut, and the acid prevents it." },
      { stepNumber: 2, instruction: "Prepare each artichoke: snap off the tough outer leaves. Cut off the top third of the artichoke with a sharp serrated knife. Trim the stem to about 2cm, then peel it with a vegetable peeler. Using scissors, snip the sharp tip from each remaining leaf. Place immediately in the lemon water." },
      { stepNumber: 3, instruction: "Gently spread the leaves apart with your fingers — you want to open the artichoke like a flower to receive the stuffing. Use a small spoon to scoop out the fuzzy choke in the center. Work carefully: the choke is bitter and inedible." },
      { stepNumber: 4, instruction: "Mix the breadcrumbs, garlic, parsley, Pecorino, 3 tablespoons of olive oil, salt, and pepper in a bowl until evenly combined and the mixture holds together slightly when pressed." },
      { stepNumber: 5, instruction: "Pack the filling between the leaves of each artichoke, working from the outside in, and mound filling in the center cavity. Press it in firmly." },
      { stepNumber: 6, instruction: "Stand the artichokes upright in a pot or deep braising pan just large enough to hold them snugly (this keeps them upright during cooking). Pour the white wine and water around the base. Drizzle the tops with the remaining olive oil." },
      { stepNumber: 7, instruction: "Bring to a boil over medium-high heat, then reduce to a low simmer. Cover tightly and cook for 45 to 55 minutes, until a leaf pulls free easily and the base is tender when pierced with a knife. Check occasionally and add a splash of water if the pan is dry." },
      { stepNumber: 8, instruction: "Serve warm or at room temperature. To eat: pull leaves off one at a time, scrape the tender base and stuffing off with your teeth. When you reach the heart, eat it entirely — it is the best part." },
    ],
  });

  // ─────────────────────────────────────────────────────────────────────
  // DUTCH — Oma (Amsterdam)
  // ─────────────────────────────────────────────────────────────────────

  await createRecipe({
    title: "Oma's Erwtensoep (Dutch Split Pea Soup)",
    description:
      "A thick, hearty split pea soup with rookworst sausage, celeriac, leeks, and smoked pork. Called 'snert' in Dutch — traditionally eaten on Christmas Eve and cold winter days.",
    cultural: "Dutch",
    holiday: "Christmas",
    prepTime: 150,
    notes: [
      {
        author: "Oma",
        content:
          "It must be thick enough for a spoon to stand up in it. If it is not, keep cooking.",
      },
    ],
    ingredients: [
      { order: 1, amount: "500", unit: "g", name: "green split peas, rinsed" },
      { order: 2, amount: "1", unit: null, name: "smoked pork hock (about 700g)" },
      { order: 3, amount: "2", unit: null, name: "rookworst sausages (Dutch smoked sausage — or substitute kielbasa)" },
      { order: 4, amount: "1", unit: null, name: "celeriac (about 400g), peeled and diced" },
      { order: 5, amount: "3", unit: null, name: "medium potatoes, peeled and diced" },
      { order: 6, amount: "2", unit: null, name: "large leeks, white and light green parts, sliced" },
      { order: 7, amount: "3", unit: null, name: "carrots, diced" },
      { order: 8, amount: "2", unit: null, name: "celery stalks, sliced" },
      { order: 9, amount: "1", unit: null, name: "large onion, diced" },
      { order: 10, amount: "2", unit: null, name: "bay leaves" },
      { order: 11, amount: "2", unit: "liters", name: "water" },
      { order: 12, amount: "to taste", unit: null, name: "salt and white pepper" },
      { order: 13, amount: "for serving", unit: null, name: "rye bread and butter" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Place the split peas, pork hock, bay leaves, and water in a large heavy pot. Bring to a boil over high heat, skimming off any gray foam that rises to the surface." },
      { stepNumber: 2, instruction: "Reduce heat to a gentle simmer. Add the onion, carrots, celery, and celeriac. Cook partially covered for 1 hour, stirring occasionally." },
      { stepNumber: 3, instruction: "Add the potatoes and leeks. Continue simmering for another 30 to 45 minutes until the peas have completely dissolved and the soup is very thick." },
      { stepNumber: 4, instruction: "Remove the pork hock. When cool enough to handle, strip the meat from the bone, shred it, and return it to the pot. Discard the bone and bay leaves." },
      { stepNumber: 5, instruction: "Add the rookworst to the pot and simmer for 15 minutes to heat through and flavor the soup. Remove, slice into rounds, and return the slices to the pot." },
      { stepNumber: 6, instruction: "Taste and season generously with salt and white pepper. The soup should be very thick — almost porridge-like. If it is too thin, simmer uncovered until it reduces further." },
      { stepNumber: 7, instruction: "Erwtensoep is always better the next day. Refrigerate overnight and reheat gently, adding a splash of water if needed — it thickens considerably as it sits. Serve with thickly buttered rye bread." },
    ],
  });

  await createRecipe({
    title: "Paasstol (Dutch Easter Bread)",
    description:
      "An enriched yeast bread filled with homemade almond paste and candied citrus peel, shaped into a log and dusted with powdered sugar. Oma's Easter morning tradition from Amsterdam.",
    cultural: "Dutch",
    holiday: "Easter",
    prepTime: 240,
    notes: [
      {
        author: "Oma",
        content:
          "The almond paste must be homemade. The ones in the store have too much sugar and not enough almonds.",
      },
    ],
    ingredients: [
      { order: 1, amount: "500", unit: "g", name: "bread flour" },
      { order: 2, amount: "7", unit: "g", name: "instant yeast (1 sachet)" },
      { order: 3, amount: "80", unit: "g", name: "caster sugar" },
      { order: 4, amount: "1", unit: "tsp", name: "fine salt" },
      { order: 5, amount: "2", unit: null, name: "large eggs" },
      { order: 6, amount: "150", unit: "ml", name: "whole milk, warm" },
      { order: 7, amount: "100", unit: "g", name: "unsalted butter, softened" },
      { order: 8, amount: "100", unit: "g", name: "mixed candied citrus peel" },
      { order: 9, amount: "250", unit: "g", name: "ground almonds (for paste)" },
      { order: 10, amount: "200", unit: "g", name: "caster sugar (for paste)" },
      { order: 11, amount: "1", unit: null, name: "egg (for paste)" },
      { order: 12, amount: "1", unit: null, name: "lemon, zested (for paste)" },
      { order: 13, amount: "1", unit: null, name: "egg, beaten (for egg wash)" },
      { order: 14, amount: "generous", unit: null, name: "powdered sugar for dusting" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Make the almond paste first: combine ground almonds, 200g caster sugar, one egg, and the lemon zest. Mix until it comes together into a firm, slightly sticky paste. Wrap in plastic and refrigerate for at least 30 minutes." },
      { stepNumber: 2, instruction: "Make the dough: combine flour, yeast, sugar, and salt in a large bowl. Add the eggs and warm milk. Mix until a shaggy dough forms, then knead for 5 minutes." },
      { stepNumber: 3, instruction: "Add the softened butter a few pieces at a time, kneading it in fully before adding more. This takes patience — about 8 to 10 minutes of kneading. The dough will be soft and slightly tacky but should not stick to clean hands." },
      { stepNumber: 4, instruction: "Add the candied peel and knead briefly to incorporate. Shape into a ball, place in a lightly oiled bowl, cover with a damp cloth, and leave to rise in a warm place for 1 to 1.5 hours until doubled." },
      { stepNumber: 5, instruction: "Roll the almond paste into a log about 30cm long. On a floured surface, roll the dough into an oval roughly 35x25cm." },
      { stepNumber: 6, instruction: "Place the almond paste log slightly off-center on the dough. Fold the larger flap of dough over the paste. Press the edges firmly to seal — the paste must not escape during baking." },
      { stepNumber: 7, instruction: "Transfer to a parchment-lined baking sheet. Cover and leave to prove for 45 minutes. Preheat oven to 180°C (350°F)." },
      { stepNumber: 8, instruction: "Brush with beaten egg. Bake for 30 to 35 minutes until deep golden brown. Cool completely before dusting generously with powdered sugar. Slice thickly to serve." },
    ],
  });

  await createRecipe({
    title: "Stamppot Boerenkool (Kale and Potato Mash)",
    description:
      "Mashed potatoes and kale cooked together, served with rookworst and gravy. The Dutch comfort dish Oma makes for Thanksgiving because it feeds a crowd and travels well.",
    cultural: "Dutch",
    holiday: "Thanksgiving",
    prepTime: 45,
    notes: [
      {
        author: "Oma",
        content:
          "Kale is better after the first frost. We don't get frost in Phoenix so I put the kale in the freezer for an hour first.",
      },
    ],
    ingredients: [
      { order: 1, amount: "1.5", unit: "kg", name: "starchy potatoes (Russet or Yukon Gold), peeled and quartered" },
      { order: 2, amount: "500", unit: "g", name: "curly kale, stems removed, leaves roughly chopped" },
      { order: 3, amount: "2", unit: null, name: "rookworst sausages (or kielbasa)" },
      { order: 4, amount: "100", unit: "ml", name: "whole milk, warmed" },
      { order: 5, amount: "60", unit: "g", name: "unsalted butter" },
      { order: 6, amount: "to taste", unit: null, name: "salt, white pepper, and freshly grated nutmeg" },
      { order: 7, amount: "for serving", unit: null, name: "good beef gravy (jus)" },
      { order: 8, amount: "for serving", unit: null, name: "Dutch mustard" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Place the potatoes in a large pot of cold salted water. Bring to a boil and cook for 10 minutes." },
      { stepNumber: 2, instruction: "Add the kale on top of the potatoes (it will wilt down). Continue cooking for another 10 to 15 minutes until the potatoes are completely tender." },
      { stepNumber: 3, instruction: "Meanwhile, place the rookworst in a separate pan with just enough water to cover. Bring to a gentle simmer and cook for 15 minutes. Do not boil vigorously or the skin will split." },
      { stepNumber: 4, instruction: "Drain the potatoes and kale thoroughly. Return to the pot over low heat for 1 to 2 minutes to drive off excess steam — dry potatoes make better mash." },
      { stepNumber: 5, instruction: "Mash the potatoes and kale together with the warm milk and butter. The kale should be fully incorporated — you want green streaks throughout, not lumps of kale. Season generously with salt, white pepper, and nutmeg." },
      { stepNumber: 6, instruction: "Mound the stamppot onto a large platter. Make a well in the center and pour in hot gravy. Arrange the sliced rookworst on the side. Serve with mustard." },
    ],
  });

  // ─────────────────────────────────────────────────────────────────────
  // GERMAN — Father's family
  // ─────────────────────────────────────────────────────────────────────

  await createRecipe({
    title: "Weihnachtsgans (Christmas Roast Goose)",
    description:
      "Whole goose roasted with apple, onion, and marjoram stuffing, served alongside red cabbage braised in red wine and potato dumplings. The German Christmas centerpiece.",
    cultural: "German",
    holiday: "Christmas",
    prepTime: 240,
    notes: [
      {
        author: "Opa Heinrich",
        content:
          "Score the skin so the fat renders properly. Baste every thirty minutes. This is the most important step.",
      },
    ],
    ingredients: [
      { order: 1, amount: "1", unit: null, name: "whole goose (about 4.5 to 5kg), giblets removed" },
      { order: 2, amount: "3", unit: null, name: "tart apples (Granny Smith or Braeburn), peeled, cored, and quartered" },
      { order: 3, amount: "2", unit: null, name: "large onions, quartered" },
      { order: 4, amount: "4", unit: null, name: "garlic cloves" },
      { order: 5, amount: "2", unit: "tbsp", name: "dried marjoram" },
      { order: 6, amount: "1", unit: "tbsp", name: "caraway seeds" },
      { order: 7, amount: "1", unit: "head", name: "red cabbage, cored and shredded" },
      { order: 8, amount: "2", unit: null, name: "apples, peeled and grated (for cabbage)" },
      { order: 9, amount: "1", unit: null, name: "onion, finely sliced (for cabbage)" },
      { order: 10, amount: "200", unit: "ml", name: "red wine (for cabbage)" },
      { order: 11, amount: "3", unit: "tbsp", name: "red wine vinegar (for cabbage)" },
      { order: 12, amount: "2", unit: "tbsp", name: "sugar (for cabbage)" },
      { order: 13, amount: "4", unit: null, name: "cloves (for cabbage)" },
      { order: 14, amount: "2", unit: null, name: "juniper berries, crushed (for cabbage)" },
      { order: 15, amount: "1", unit: "kg", name: "starchy potatoes, boiled and riced (for dumplings)" },
      { order: 16, amount: "200", unit: "g", name: "potato starch (for dumplings)" },
      { order: 17, amount: "2", unit: null, name: "egg yolks (for dumplings)" },
      { order: 18, amount: "to taste", unit: null, name: "salt, pepper, and nutmeg" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Remove the goose from the refrigerator 1 hour before cooking. Pat completely dry inside and out with paper towels — moisture is the enemy of crispy skin. Preheat oven to 220°C (425°F)." },
      { stepNumber: 2, instruction: "Score the skin all over in a crosshatch pattern with a sharp knife, cutting through the fat but not into the meat. Season the cavity generously with salt, pepper, marjoram, and caraway seeds. Fill the cavity loosely with the apple quarters, onion, and garlic." },
      { stepNumber: 3, instruction: "Truss the legs with kitchen twine. Place breast-side up on a rack in a large roasting pan. Rub the skin with salt. Roast at 220°C for 30 minutes until the skin begins to color." },
      { stepNumber: 4, instruction: "Reduce heat to 170°C (325°F). Roast for a further 2.5 to 3 hours, basting with the rendered fat every 30 minutes and draining excess fat from the pan as needed (save it — goose fat is liquid gold for roasting potatoes). The goose is done when the juices run clear and a thermometer reads 80°C (175°F) in the thickest part of the thigh." },
      { stepNumber: 5, instruction: "Make the braised red cabbage: heat a knob of butter in a large pot. Add the sliced onion and cook until soft. Add the shredded cabbage, grated apple, red wine, vinegar, sugar, cloves, and juniper berries. Stir well, cover, and cook over low heat for 45 minutes to 1 hour, stirring occasionally, until very tender. Season with salt and pepper." },
      { stepNumber: 6, instruction: "Make the potato dumplings (Kartoffelknödel): combine the riced boiled potatoes, potato starch, egg yolks, salt, and nutmeg. Mix to a smooth dough. With floured hands, form into golf ball-sized balls." },
      { stepNumber: 7, instruction: "Cook the dumplings in gently simmering salted water for 15 to 20 minutes. They are done when they float to the surface and have done so for 5 minutes. Do not boil vigorously or they will fall apart." },
      { stepNumber: 8, instruction: "Rest the goose for 20 minutes before carving. Serve with the braised red cabbage, potato dumplings, and the pan drippings deglazed with a splash of wine for gravy." },
    ],
  });

  await createRecipe({
    title: "Osterlamm (German Easter Lamb Cake)",
    description:
      "A soft sponge cake baked in a lamb-shaped mold, dusted with powdered sugar, with a red ribbon around its neck. Every German household has the mold — it comes out at Easter every year.",
    cultural: "German",
    holiday: "Easter",
    prepTime: 75,
    notes: [
      {
        author: "Tante Brigitte",
        content:
          "Grease and flour the mold very well or the ears will stick. This is how you ruin Easter.",
      },
    ],
    ingredients: [
      { order: 1, amount: "4", unit: null, name: "large eggs, separated, room temperature" },
      { order: 2, amount: "150", unit: "g", name: "caster sugar" },
      { order: 3, amount: "1", unit: "tsp", name: "vanilla extract" },
      { order: 4, amount: "1", unit: null, name: "lemon, zested" },
      { order: 5, amount: "150", unit: "g", name: "all-purpose flour" },
      { order: 6, amount: "50", unit: "g", name: "cornstarch (Speisestärke)" },
      { order: 7, amount: "1.5", unit: "tsp", name: "baking powder" },
      { order: 8, amount: "pinch", unit: null, name: "salt" },
      { order: 9, amount: "3", unit: "tbsp", name: "neutral oil or melted clarified butter" },
      { order: 10, amount: "for the mold", unit: null, name: "softened butter and flour (to prepare the mold)" },
      { order: 11, amount: "generous", unit: null, name: "powdered sugar for dusting" },
      { order: 12, amount: "1", unit: null, name: "red ribbon for decoration" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Prepare the lamb mold: brush every crevice of the mold — including the ears — with softened butter. Dust generously with flour, shake to coat completely, and tap out any excess. Pay special attention to the ears. Preheat oven to 175°C (350°F)." },
      { stepNumber: 2, instruction: "Beat the egg yolks with 100g of the caster sugar, vanilla, and lemon zest until pale, thick, and ribbon-like — about 5 minutes with a hand mixer." },
      { stepNumber: 3, instruction: "In a separate clean bowl, beat the egg whites with the pinch of salt until foamy. Gradually add the remaining 50g of sugar and beat to stiff, glossy peaks." },
      { stepNumber: 4, instruction: "Sift together the flour, cornstarch, and baking powder. Fold the dry ingredients into the yolk mixture in three additions, alternating with the oil. Be gentle — you are building a light batter." },
      { stepNumber: 5, instruction: "Fold the beaten egg whites into the batter in three additions, using a large spatula with a light hand. The goal is to keep as much air as possible." },
      { stepNumber: 6, instruction: "Pour the batter into the prepared mold. Close the mold if it has a lid. Bake for 35 to 40 minutes until a skewer inserted through the filling hole comes out clean." },
      { stepNumber: 7, instruction: "Cool in the mold for exactly 10 minutes — no more. Then carefully open and unmold onto a wire rack. If any piece sticks, do not panic: cool completely, use a toothpick and a dusting of powdered sugar to repair." },
      { stepNumber: 8, instruction: "When completely cool, dust generously with powdered sugar so the lamb appears covered in snow. Tie the red ribbon around the neck. Place on the Easter table." },
    ],
  });

  await createRecipe({
    title: "Sauerbraten with Gingersnap Gravy",
    description:
      "Beef marinated for three days in red wine vinegar, wine, and spices, then braised until fork-tender. The gravy is finished with crushed gingersnap cookies — the sweet balancing the sour. Start on Monday for Thanksgiving Thursday.",
    cultural: "German",
    holiday: "Thanksgiving",
    prepTime: 4320,
    notes: [
      {
        author: "Opa Heinrich",
        content:
          "Start this on Monday for Thanksgiving Thursday. There are no shortcuts with sauerbraten.",
      },
    ],
    ingredients: [
      { order: 1, amount: "1.5", unit: "kg", name: "beef rump roast or bottom round" },
      { order: 2, amount: "500", unit: "ml", name: "red wine vinegar" },
      { order: 3, amount: "500", unit: "ml", name: "dry red wine" },
      { order: 4, amount: "500", unit: "ml", name: "water" },
      { order: 5, amount: "1", unit: null, name: "large onion, sliced" },
      { order: 6, amount: "2", unit: null, name: "carrots, sliced" },
      { order: 7, amount: "2", unit: null, name: "celery stalks, sliced" },
      { order: 8, amount: "4", unit: null, name: "bay leaves" },
      { order: 9, amount: "10", unit: null, name: "whole cloves" },
      { order: 10, amount: "10", unit: null, name: "whole black peppercorns" },
      { order: 11, amount: "1", unit: "tbsp", name: "sugar" },
      { order: 12, amount: "1", unit: "tsp", name: "salt (for marinade)" },
      { order: 13, amount: "2", unit: "tbsp", name: "neutral oil (for searing)" },
      { order: 14, amount: "80", unit: "g", name: "gingersnap cookies (Lebkuchen if available), crushed to crumbs" },
      { order: 15, amount: "2", unit: "tbsp", name: "brown sugar" },
      { order: 16, amount: "to taste", unit: null, name: "salt and pepper" },
      { order: 17, amount: "for serving", unit: null, name: "egg noodles or potato dumplings" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Three days before serving — make the marinade: combine red wine vinegar, red wine, water, onion, carrots, celery, bay leaves, cloves, peppercorns, sugar, and salt in a saucepan. Bring to a boil, then cool completely to room temperature." },
      { stepNumber: 2, instruction: "Place the beef in a non-reactive container (glass or ceramic — not metal). Pour the cooled marinade over it. The meat should be fully submerged. Cover and refrigerate for 3 days, turning the meat once or twice each day." },
      { stepNumber: 3, instruction: "On cooking day — remove the meat from the marinade and pat very dry. Strain the marinade and reserve the liquid. Discard the solids." },
      { stepNumber: 4, instruction: "Heat the oil in a heavy Dutch oven over high heat until smoking. Sear the beef on all sides until deeply browned, about 3 to 4 minutes per side. Do not rush this — the crust is where the flavor lives." },
      { stepNumber: 5, instruction: "Pour the reserved marinade over the seared meat. Bring to a boil, then reduce to a very low simmer. Cover tightly and braise for 2.5 to 3 hours, turning occasionally, until the meat is fork-tender." },
      { stepNumber: 6, instruction: "Remove the meat and tent loosely with foil to rest. Strain the braising liquid into a wide saucepan. Bring to a boil over high heat and reduce by about one-third." },
      { stepNumber: 7, instruction: "Whisk in the crushed gingersnap cookies and brown sugar. The cookies will thicken the gravy and add a subtle sweetness. Simmer for 5 minutes, whisking, until smooth. Taste and adjust salt, pepper, and sugar." },
      { stepNumber: 8, instruction: "Slice the sauerbraten across the grain into thick slices. Arrange on a platter and pour the gingersnap gravy generously over the top. Serve with egg noodles or potato dumplings." },
    ],
  });

  // ─────────────────────────────────────────────────────────────────────
  // MEXICAN — Aunts and cousins
  // ─────────────────────────────────────────────────────────────────────

  await createRecipe({
    title: "Bacalao a la Vizcaína (Christmas Salt Cod)",
    description:
      "Salt cod soaked for two days, then simmered with tomatoes, olives, capers, roasted peppers, and potatoes. A traditional Mexican Christmas Eve dish inherited from Spanish colonial cooking.",
    cultural: "Mexican",
    holiday: "Christmas",
    prepTime: 2880,
    notes: [
      {
        author: "Tía Carmen",
        content:
          "Change the water every eight hours when soaking. The cod should taste like fish by the end, not like salt.",
      },
    ],
    ingredients: [
      { order: 1, amount: "1", unit: "kg", name: "dried salt cod (bacalao)" },
      { order: 2, amount: "6", unit: null, name: "Roma tomatoes" },
      { order: 3, amount: "2", unit: null, name: "white onions, roughly chopped" },
      { order: 4, amount: "6", unit: null, name: "garlic cloves" },
      { order: 5, amount: "3", unit: null, name: "red bell peppers, roasted, peeled, and sliced" },
      { order: 6, amount: "1/2", unit: "cup", name: "green olives, pitted and halved" },
      { order: 7, amount: "3", unit: "tbsp", name: "capers, drained" },
      { order: 8, amount: "1/2", unit: "cup", name: "raisins" },
      { order: 9, amount: "4", unit: null, name: "medium potatoes, peeled and cubed" },
      { order: 10, amount: "2", unit: null, name: "fresh jalapeños or güero chiles, sliced (optional)" },
      { order: 11, amount: "1/2", unit: "cup", name: "extra-virgin olive oil" },
      { order: 12, amount: "2", unit: null, name: "bay leaves" },
      { order: 13, amount: "1/2", unit: "tsp", name: "dried Mexican oregano" },
      { order: 14, amount: "to taste", unit: null, name: "salt and black pepper" },
      { order: 15, amount: "for serving", unit: null, name: "crusty bread or steamed white rice" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Two days before serving — rinse the salt cod under cold water. Place in a large bowl, cover completely with cold water, and refrigerate. Change the water every 8 hours for 48 hours total. Taste a small piece before cooking — it should be pleasantly salty like well-seasoned fish, not aggressively salty." },
      { stepNumber: 2, instruction: "Drain the soaked cod. Place in a pot, cover with fresh cold water, and bring just to a gentle simmer. Do not boil. Cook for 10 minutes. Drain and cool. Remove any skin and bones, then flake the fish into large pieces. Set aside." },
      { stepNumber: 3, instruction: "Blend the tomatoes, one of the onions, and 4 garlic cloves in a blender until smooth. Set aside." },
      { stepNumber: 4, instruction: "Heat the olive oil in a large, wide cazuela or heavy pot over medium heat. Add the remaining onion and garlic and cook, stirring, for 5 minutes until softened." },
      { stepNumber: 5, instruction: "Pour in the blended tomato sauce. It will spit — stand back. Cook over medium-high heat, stirring frequently, for 10 to 15 minutes until the sauce darkens and the raw tomato smell cooks out." },
      { stepNumber: 6, instruction: "Add the roasted peppers, olives, capers, raisins, jalapeños, bay leaves, and oregano. Stir to combine. Add the cubed potatoes and enough water to almost cover everything." },
      { stepNumber: 7, instruction: "Gently fold in the flaked bacalao. Simmer uncovered over low heat for 20 to 25 minutes until the potatoes are tender and the sauce has thickened. Stir gently to avoid breaking up the fish too much." },
      { stepNumber: 8, instruction: "Taste and adjust seasoning — you will likely need very little salt because of the cod. Serve hot with crusty bread or white rice. This dish is even better the next day." },
    ],
  });

  await createRecipe({
    title: "Capirotada (Mexican Easter Bread Pudding)",
    description:
      "Layers of toasted bolillo bread soaked in a piloncillo and cinnamon syrup, with raisins, peanuts, coconut, and Cotija cheese. Eaten during Lent and Easter — every ingredient carries symbolic meaning.",
    cultural: "Mexican",
    holiday: "Easter",
    prepTime: 90,
    notes: [
      {
        author: "Tía Carmen",
        content:
          "The cheese is not a mistake. Do not leave it out. It melts into the syrup and you cannot taste it separately — you just taste richness.",
      },
    ],
    ingredients: [
      { order: 1, amount: "6", unit: null, name: "bolillo rolls (or French bread), sliced 2cm thick and dried overnight" },
      { order: 2, amount: "250", unit: "g", name: "piloncillo (Mexican raw cane sugar), chopped, or 1 cup dark brown sugar" },
      { order: 3, amount: "1", unit: "liter", name: "water" },
      { order: 4, amount: "2", unit: null, name: "cinnamon sticks" },
      { order: 5, amount: "4", unit: null, name: "whole cloves" },
      { order: 6, amount: "1", unit: null, name: "star anise" },
      { order: 7, amount: "1/2", unit: "cup", name: "raisins" },
      { order: 8, amount: "1/2", unit: "cup", name: "roasted peanuts" },
      { order: 9, amount: "1/2", unit: "cup", name: "unsweetened shredded coconut" },
      { order: 10, amount: "150", unit: "g", name: "Cotija cheese (or mild feta), crumbled" },
      { order: 11, amount: "3", unit: "tbsp", name: "unsalted butter, cut into small pieces" },
      { order: 12, amount: "1/2", unit: "cup", name: "sliced almonds (optional)" },
      { order: 13, amount: "for frying", unit: null, name: "vegetable oil" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Make the piloncillo syrup: combine the piloncillo, water, cinnamon sticks, cloves, and star anise in a saucepan. Bring to a boil, stirring until the piloncillo dissolves. Reduce heat and simmer for 15 minutes until the syrup is fragrant and slightly thickened. Strain and keep warm." },
      { stepNumber: 2, instruction: "Fry the bread: heat 2cm of vegetable oil in a skillet over medium-high heat. Fry the bread slices in batches until golden brown on both sides, about 2 minutes per side. Drain on paper towels. (Alternatively, brush with butter and toast in a 180°C oven until golden.)" },
      { stepNumber: 3, instruction: "Preheat oven to 180°C (350°F). Grease a deep baking dish." },
      { stepNumber: 4, instruction: "Build the first layer: arrange fried bread slices to cover the bottom of the dish. They can overlap slightly." },
      { stepNumber: 5, instruction: "Scatter half the raisins, peanuts, coconut, almonds, and crumbled Cotija over the bread. Dot with half the butter pieces." },
      { stepNumber: 6, instruction: "Add a second layer of bread and repeat the layering of raisins, peanuts, coconut, Cotija, and butter." },
      { stepNumber: 7, instruction: "Slowly pour the warm piloncillo syrup evenly over the entire dish. Press down gently with a spatula so the bread absorbs the liquid. Let it sit for 5 minutes, then press down again." },
      { stepNumber: 8, instruction: "Cover with foil and bake for 25 minutes. Uncover and bake for another 10 to 15 minutes until the top is set and slightly caramelized. Serve warm or at room temperature. The capirotada can be made a day ahead and reheated." },
    ],
  });

  await createRecipe({
    title: "Mole Negro Turkey",
    description:
      "Thanksgiving turkey served with a deep mole negro made from dried chiles, Mexican chocolate, plantain, sesame, and more than thirty ingredients. The dish that makes Thanksgiving make sense.",
    cultural: "Mexican",
    holiday: "Thanksgiving",
    prepTime: 480,
    notes: [
      {
        author: "Abuela Rosa",
        content:
          "The mole takes all day. It is not a weeknight recipe. But on Thanksgiving you have time, and when people taste it they understand why.",
      },
      {
        author: "Tía Carmen",
        content:
          "Toast every chile individually. Do not rush the toasting. This is where the flavor comes from.",
      },
    ],
    ingredients: [
      { order: 1, amount: "1", unit: null, name: "whole turkey (5 to 6kg), or 4kg turkey pieces" },
      { order: 2, amount: "6", unit: null, name: "dried mulato chiles, stems and seeds removed" },
      { order: 3, amount: "4", unit: null, name: "dried ancho chiles, stems and seeds removed" },
      { order: 4, amount: "4", unit: null, name: "dried pasilla chiles, stems and seeds removed" },
      { order: 5, amount: "2", unit: null, name: "dried chipotle chiles, stems and seeds removed" },
      { order: 6, amount: "1", unit: null, name: "ripe plantain, peeled and sliced" },
      { order: 7, amount: "1", unit: null, name: "white onion, quartered and charred on a dry comal" },
      { order: 8, amount: "6", unit: null, name: "garlic cloves, charred on a dry comal" },
      { order: 9, amount: "4", unit: null, name: "Roma tomatoes, charred on a dry comal" },
      { order: 10, amount: "4", unit: null, name: "tomatillos, charred on a dry comal" },
      { order: 11, amount: "1/4", unit: "cup", name: "sesame seeds, toasted until golden" },
      { order: 12, amount: "1/4", unit: "cup", name: "pepitas (pumpkin seeds), toasted" },
      { order: 13, amount: "1/4", unit: "cup", name: "raisins" },
      { order: 14, amount: "2", unit: null, name: "corn tortillas, torn and fried until crisp" },
      { order: 15, amount: "1", unit: null, name: "bolillo slice, fried until dark golden" },
      { order: 16, amount: "90", unit: "g", name: "Mexican chocolate (Ibarra or Abuelita), roughly chopped" },
      { order: 17, amount: "1", unit: "tsp", name: "dried Mexican oregano" },
      { order: 18, amount: "1/2", unit: "tsp", name: "dried thyme" },
      { order: 19, amount: "3", unit: null, name: "whole cloves" },
      { order: 20, amount: "1/2", unit: "tsp", name: "black peppercorns" },
      { order: 21, amount: "1", unit: null, name: "cinnamon stick (Mexican canela)" },
      { order: 22, amount: "1.5", unit: "liters", name: "turkey or chicken stock (warm)" },
      { order: 23, amount: "3", unit: "tbsp", name: "lard or vegetable oil (for frying)" },
      { order: 24, amount: "1.5", unit: "tbsp", name: "salt (plus more to taste)" },
      { order: 25, amount: "1", unit: "tbsp", name: "sugar (to balance — adjust to taste)" },
      { order: 26, amount: "for serving", unit: null, name: "sesame seeds and warm tortillas" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Toast the chiles: heat a dry comal or heavy skillet over medium heat. Toast each type of chile individually — press flat with a spatula for about 20 seconds per side until fragrant and slightly darkened. Do not burn them or the mole will be bitter. Place toasted chiles in a bowl and cover with hot water. Soak for 30 minutes, then drain." },
      { stepNumber: 2, instruction: "Char the aromatics: on the same dry comal over high heat, char the onion, garlic, tomatoes, and tomatillos until blackened in spots on all sides. The char is not a mistake — it is essential flavor." },
      { stepNumber: 3, instruction: "Fry the plantain and bread: heat lard in a skillet. Fry the plantain slices until golden brown on each side. Remove. In the same fat, fry the bread slice until very dark golden. Fry the tortilla pieces until crisp. Reserve all." },
      { stepNumber: 4, instruction: "Blend in batches: add the soaked chiles to a blender with enough warm stock to blend smoothly. Strain through a fine sieve and reserve. Blend the charred vegetables. Blend the plantain, bread, tortillas, sesame seeds, pepitas, raisins, chocolate, and spices with stock until very smooth." },
      { stepNumber: 5, instruction: "Cook the mole base: heat 2 tablespoons of lard in a large heavy pot over high heat until almost smoking. Pour in the chile purée — it will spit and splatter aggressively. Stir constantly and fry the paste for 5 to 8 minutes, scraping the bottom of the pot, until it darkens and thickens." },
      { stepNumber: 6, instruction: "Add the vegetable blend and the chocolate-spice blend to the pot. Stir to combine and fry together for another 5 minutes. The mole will be very thick at this point." },
      { stepNumber: 7, instruction: "Add the warm stock gradually, stirring constantly, until the mole reaches a thick, sauce-like consistency — it should coat the back of a spoon generously. Season with salt and sugar. Reduce heat to the lowest setting and simmer, stirring frequently, for 45 minutes to 1 hour. The mole will deepen in color and flavor." },
      { stepNumber: 8, instruction: "Roast or braise the turkey according to your preferred method. Carve and arrange on a platter. Pour mole generously over the turkey. Scatter sesame seeds over the top. Serve extra mole in a warm bowl on the side with tortillas. The mole can be made 3 days ahead and refrigerated — it improves with time." },
    ],
  });

  console.log("\nFamily Heritage Recipes — database seeded with full recipes!");
  console.log("  Italian:  3 recipes (Pasta Dough, Lasagna, Stuffed Artichokes)");
  console.log("  Dutch:    3 recipes (Erwtensoep, Paasstol, Stamppot)");
  console.log("  German:   3 recipes (Weihnachtsgans, Osterlamm, Sauerbraten)");
  console.log("  Mexican:  3 recipes (Bacalao, Capirotada, Mole Negro Turkey)");
  console.log("  Total: 12 complete recipes with ingredients, steps, and family notes");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
