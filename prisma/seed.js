const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
require("dotenv").config();

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" }),
});

async function createRecipe(data) {
  const { ingredients, steps, notes, ...recipeData } = data;
  return prisma.recipe.create({
    data: {
      ...recipeData,
      ingredients: { create: ingredients },
      steps:       { create: steps },
      notes:       { create: notes ?? [] },
    },
  });
}

async function main() {
  await prisma.step.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.familyNote.deleteMany();
  await prisma.recipe.deleteMany();

  // ═══════════════════════════════════════════════════════════════
  // ITALIAN — Grandma Louise
  // ═══════════════════════════════════════════════════════════════

  await createRecipe({
    title: "Grandma Louise's Homemade Pasta Dough",
    description: "Hand-rolled egg pasta made on the kitchen table. Worked until silky and cut into tagliatelle for Sunday gravy or Christmas dinner.",
    cultural: "Italian", holiday: "Christmas", category: "Main",
    prepTime: 90,
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
    notes: [{ author: "Grandma Louise", content: "Never use a machine. The warmth of your hands is what makes the dough come together. My mother taught me this in Naples." }],
    ingredients: [
      { order: 1, amount: "400", unit: "g",    name: "00 flour, plus more for dusting" },
      { order: 2, amount: "4",   unit: null,   name: "large eggs, room temperature" },
      { order: 3, amount: "1",   unit: "tbsp", name: "extra-virgin olive oil" },
      { order: 4, amount: "1",   unit: "tsp",  name: "fine sea salt" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Mound the flour on a large wooden board. Make a wide well in the center big enough to hold all the eggs without spilling." },
      { stepNumber: 2, instruction: "Crack the eggs into the well. Add olive oil and salt. Beat gently with a fork, slowly incorporating flour from the inner walls. Do not break the outer wall." },
      { stepNumber: 3, instruction: "When too thick for a fork, use your hands to bring the dough together into a rough ball. Scrape up any dried bits and incorporate them." },
      { stepNumber: 4, instruction: "Knead firmly for 10 to 12 minutes, pushing forward with the heel of your hand, folding, and rotating. Dough is ready when smooth, elastic, and springs back when pressed." },
      { stepNumber: 5, instruction: "Wrap tightly in plastic and rest at room temperature for at least 30 minutes to relax the gluten." },
      { stepNumber: 6, instruction: "Divide into four pieces. Roll each piece as thin as possible — you should be able to see your hand through it." },
      { stepNumber: 7, instruction: "Lightly flour the sheet, fold loosely into thirds, and cut into 6mm strips for tagliatelle. Shake loose and dust with flour." },
      { stepNumber: 8, instruction: "Cook in heavily salted boiling water for 2 to 3 minutes, or dry for up to 2 hours before cooking." },
    ],
  });

  await createRecipe({
    title: "Lasagna al Forno",
    description: "Layered fresh pasta with slow-cooked Bolognese, béchamel, and aged Parmigiano-Reggiano. Baked until bubbling and bronze. Grandma Louise's Easter centerpiece.",
    cultural: "Italian", holiday: "Easter", category: "Main",
    prepTime: 180,
    imageUrl: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800",
    notes: [{ author: "Grandma Louise", content: "Make the ragù the day before. It tastes completely different after a night in the refrigerator." }],
    ingredients: [
      { order: 1,  amount: "1",     unit: "batch", name: "fresh pasta dough, rolled into sheets" },
      { order: 2,  amount: "500",   unit: "g",     name: "ground beef (80/20)" },
      { order: 3,  amount: "250",   unit: "g",     name: "ground pork" },
      { order: 4,  amount: "1",     unit: null,    name: "medium onion, finely diced" },
      { order: 5,  amount: "2",     unit: null,    name: "carrots, finely diced" },
      { order: 6,  amount: "2",     unit: null,    name: "celery stalks, finely diced" },
      { order: 7,  amount: "4",     unit: null,    name: "garlic cloves, minced" },
      { order: 8,  amount: "150",   unit: "ml",    name: "dry red wine" },
      { order: 9,  amount: "400",   unit: "g",     name: "canned whole San Marzano tomatoes, crushed by hand" },
      { order: 10, amount: "2",     unit: "tbsp",  name: "tomato paste" },
      { order: 11, amount: "100",   unit: "ml",    name: "whole milk (for ragù)" },
      { order: 12, amount: "1",     unit: "liter", name: "whole milk (for béchamel)" },
      { order: 13, amount: "80",    unit: "g",     name: "unsalted butter (for béchamel)" },
      { order: 14, amount: "80",    unit: "g",     name: "00 flour (for béchamel)" },
      { order: 15, amount: "1/4",   unit: "tsp",   name: "freshly grated nutmeg" },
      { order: 16, amount: "200",   unit: "g",     name: "Parmigiano-Reggiano, freshly grated" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Heat olive oil in a heavy pot. Cook onion, carrot, and celery for 8 minutes until softened. Add garlic and cook 1 minute more." },
      { stepNumber: 2, instruction: "Add ground beef and pork. Break up and cook until browned, about 10 minutes. Season with salt and pepper." },
      { stepNumber: 3, instruction: "Add tomato paste, stir to coat, cook 2 minutes. Pour in red wine, let bubble until almost evaporated." },
      { stepNumber: 4, instruction: "Add crushed tomatoes. Reduce to lowest simmer. Partially cover and cook 2 hours. Add milk in last 30 minutes." },
      { stepNumber: 5, instruction: "Make béchamel: melt butter, whisk in flour for 2 minutes. Slowly add warm milk, whisking constantly until thick. Season with salt, pepper, and nutmeg." },
      { stepNumber: 6, instruction: "Blanch pasta sheets in salted boiling water for 30 seconds. Lay on a damp towel." },
      { stepNumber: 7, instruction: "Preheat oven to 190°C (375°F). Layer in a deep baking dish: Bolognese, pasta, béchamel, Parmigiano. Repeat, ending with béchamel and Parmigiano." },
      { stepNumber: 8, instruction: "Bake uncovered 40 to 45 minutes until deeply golden. Rest 15 minutes before cutting." },
    ],
  });

  await createRecipe({
    title: "Stuffed Artichokes (Carciofi Ripieni)",
    description: "Whole artichokes packed with seasoned breadcrumbs, garlic, parsley, and Pecorino, steamed in white wine and olive oil. The dish Grandma Louise brings to every Thanksgiving.",
    cultural: "Italian", holiday: "Thanksgiving", category: "Appetizer",
    prepTime: 75,
    imageUrl: "https://images.unsplash.com/photo-1600398138360-766b7c2e38b0?w=800",
    notes: [{ author: "Grandma Louise", content: "This is what I bring to Thanksgiving every year. The Americans always ask for the recipe." }],
    ingredients: [
      { order: 1, amount: "4",    unit: null,   name: "large globe artichokes" },
      { order: 2, amount: "1",    unit: null,   name: "lemon, halved" },
      { order: 3, amount: "1.5",  unit: "cups", name: "plain breadcrumbs" },
      { order: 4, amount: "4",    unit: null,   name: "garlic cloves, very finely minced" },
      { order: 5, amount: "1/2",  unit: "cup",  name: "fresh flat-leaf parsley, finely chopped" },
      { order: 6, amount: "100",  unit: "g",    name: "Pecorino Romano, finely grated" },
      { order: 7, amount: "4",    unit: "tbsp", name: "extra-virgin olive oil" },
      { order: 8, amount: "1/2",  unit: "cup",  name: "dry white wine" },
      { order: 9, amount: "1/2",  unit: "cup",  name: "water" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Fill a large bowl with cold water and squeeze in lemon juice. Artichokes brown instantly when cut — this prevents it." },
      { stepNumber: 2, instruction: "Snap off tough outer leaves. Cut off the top third. Trim and peel the stem. Snip sharp tips from remaining leaves with scissors. Place immediately in lemon water." },
      { stepNumber: 3, instruction: "Spread leaves apart gently. Use a small spoon to scoop out the fuzzy choke in the center. The choke is bitter and inedible — remove it completely." },
      { stepNumber: 4, instruction: "Mix breadcrumbs, garlic, parsley, Pecorino, 3 tablespoons olive oil, salt, and pepper until combined." },
      { stepNumber: 5, instruction: "Pack filling between the leaves and mound filling in the center cavity. Press in firmly." },
      { stepNumber: 6, instruction: "Stand artichokes upright in a pot just large enough to hold them snugly. Pour wine and water around the base. Drizzle tops with remaining olive oil." },
      { stepNumber: 7, instruction: "Bring to a boil, reduce to low simmer. Cover tightly and cook 45 to 55 minutes until a leaf pulls free easily." },
      { stepNumber: 8, instruction: "Serve warm or at room temperature. Pull leaves off one at a time and scrape the tender base with your teeth. The heart is the best part." },
    ],
  });

  await createRecipe({
    title: "Fritto Misto di Pesce",
    description: "A glorious Christmas Eve seafood fry — calamari, shrimp, whitebait, and scallops dredged in seasoned flour and fried until shatteringly crisp. Central to the Feast of the Seven Fishes.",
    cultural: "Italian", holiday: "Christmas", category: "Seafood",
    prepTime: 45,
    imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800",
    notes: [{ author: "Grandma Louise", content: "The oil must be very hot — 180°C minimum. Cold oil makes greasy fish. Hot oil makes crispy fish. There is no in between." }],
    ingredients: [
      { order: 1, amount: "500", unit: "g",    name: "fresh calamari, cleaned and cut into rings" },
      { order: 2, amount: "300", unit: "g",    name: "large raw shrimp, peeled and deveined" },
      { order: 3, amount: "200", unit: "g",    name: "whitebait or small smelts" },
      { order: 4, amount: "200", unit: "g",    name: "bay scallops" },
      { order: 5, amount: "2",   unit: "cups", name: "00 flour or fine semolina" },
      { order: 6, amount: "1",   unit: "tsp",  name: "fine sea salt" },
      { order: 7, amount: "1/2", unit: "tsp",  name: "white pepper" },
      { order: 8, amount: "1/2", unit: "tsp",  name: "dried oregano" },
      { order: 9, amount: "1",   unit: "liter",name: "light olive oil or vegetable oil for frying" },
      { order: 10, amount: "2",  unit: null,   name: "lemons, cut into wedges for serving" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Pat all seafood completely dry with paper towels. This is essential — moisture is the enemy of a crispy crust." },
      { stepNumber: 2, instruction: "Combine flour, salt, pepper, and oregano in a wide shallow bowl. Mix well." },
      { stepNumber: 3, instruction: "Heat oil in a deep heavy pot to 180°C (350°F). Use a thermometer — temperature is everything here." },
      { stepNumber: 4, instruction: "Working in small batches, dredge the seafood in seasoned flour, shaking off any excess. Do not crowd the pot." },
      { stepNumber: 5, instruction: "Fry calamari and shrimp for 2 to 3 minutes, whitebait for 1 to 2 minutes, scallops for 90 seconds — until golden and crisp." },
      { stepNumber: 6, instruction: "Remove with a spider or slotted spoon. Drain on a wire rack over paper towels. Never pile hot fried food directly on paper — it steams and goes soggy." },
      { stepNumber: 7, instruction: "Season immediately with flaky salt while still hot. Serve at once with lemon wedges. Fritto misto waits for no one." },
    ],
  });

  await createRecipe({
    title: "Torta Pasqualina",
    description: "A spectacular Easter pie from Liguria — flaky pastry layered with Swiss chard, fresh ricotta, and whole eggs baked inside. When you slice it, a perfectly set egg yolk is revealed in each portion.",
    cultural: "Italian", holiday: "Easter", category: "Main",
    prepTime: 120,
    imageUrl: "https://www.italiankitchenconfessions.com/wp-content/uploads/2021/03/Torta-Pasqualina-Savory-Italian-Easter-Pie-3.jpg",
    notes: [{ author: "Grandma Louise", content: "Traditionally this pie has 33 layers of pastry — one for each year of Christ's life. I make it with two. It still tastes the same." }],
    ingredients: [
      { order: 1,  amount: "500", unit: "g",    name: "Swiss chard or spinach, stems removed" },
      { order: 2,  amount: "500", unit: "g",    name: "fresh ricotta, well drained" },
      { order: 3,  amount: "100", unit: "g",    name: "Parmigiano-Reggiano, grated" },
      { order: 4,  amount: "8",   unit: null,   name: "eggs (6 whole for inside, 2 beaten for filling and wash)" },
      { order: 5,  amount: "1",   unit: null,   name: "onion, finely diced and sautéed" },
      { order: 6,  amount: "250", unit: "g",    name: "fresh marjoram leaves (or 2 tsp dried)" },
      { order: 7,  amount: "1/4", unit: "tsp",  name: "freshly grated nutmeg" },
      { order: 8,  amount: "500", unit: "g",    name: "shortcrust or puff pastry (2 sheets)" },
      { order: 9,  amount: "to taste", unit: null, name: "salt and white pepper" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Blanch the Swiss chard in boiling salted water for 2 minutes. Drain, squeeze out every drop of water, and chop finely. Excess moisture will make the pastry soggy." },
      { stepNumber: 2, instruction: "Combine ricotta, Parmigiano, 2 beaten eggs, sautéed onion, marjoram, nutmeg, salt, and pepper. Mix until smooth. Fold in the chopped chard." },
      { stepNumber: 3, instruction: "Preheat oven to 190°C (375°F). Line a deep 28cm pie dish with one sheet of pastry, letting it overhang the edges." },
      { stepNumber: 4, instruction: "Spread the ricotta and chard filling evenly over the base. Make 6 deep wells in the filling with the back of a spoon." },
      { stepNumber: 5, instruction: "Crack one whole egg carefully into each well. Season each egg with a pinch of salt." },
      { stepNumber: 6, instruction: "Lay the second pastry sheet over the top. Pinch and crimp the edges to seal completely. Brush with beaten egg. Prick the top several times with a fork." },
      { stepNumber: 7, instruction: "Bake 45 to 50 minutes until deeply golden. Cool for at least 20 minutes before slicing — the eggs need time to finish setting." },
    ],
  });

  await createRecipe({
    title: "Risotto ai Funghi Porcini",
    description: "Rich, silky risotto made with dried and fresh porcini mushrooms. The dried mushrooms provide an intense, earthy depth that fresh mushrooms alone cannot achieve. A fall and Thanksgiving staple.",
    cultural: "Italian", holiday: "Thanksgiving", category: "Main",
    prepTime: 55,
    imageUrl: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800",
    notes: [{ author: "Grandma Louise", content: "Never stop stirring. The starch only releases when the rice is in constant motion. This is not a recipe you can walk away from." }],
    ingredients: [
      { order: 1,  amount: "30",  unit: "g",    name: "dried porcini mushrooms" },
      { order: 2,  amount: "300", unit: "g",    name: "fresh cremini or porcini mushrooms, sliced" },
      { order: 3,  amount: "320", unit: "g",    name: "Carnaroli or Arborio rice" },
      { order: 4,  amount: "1",   unit: null,   name: "shallot, finely diced" },
      { order: 5,  amount: "2",   unit: null,   name: "garlic cloves, minced" },
      { order: 6,  amount: "150", unit: "ml",   name: "dry white wine" },
      { order: 7,  amount: "1.5", unit: "liters",name: "hot chicken or vegetable stock" },
      { order: 8,  amount: "60",  unit: "g",    name: "cold unsalted butter, cubed" },
      { order: 9,  amount: "80",  unit: "g",    name: "Parmigiano-Reggiano, grated" },
      { order: 10, amount: "3",   unit: "tbsp", name: "extra-virgin olive oil" },
      { order: 11, amount: "2",   unit: "tbsp", name: "fresh flat-leaf parsley, chopped" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Soak dried porcini in 250ml hot water for 20 minutes. Lift out carefully, reserving the soaking liquid. Chop the porcini. Strain the soaking liquid through a fine sieve and add to the hot stock." },
      { stepNumber: 2, instruction: "Heat olive oil in a wide heavy pan. Sauté shallot until translucent, about 3 minutes. Add garlic and cook 1 minute." },
      { stepNumber: 3, instruction: "Add fresh mushrooms and cook over high heat until golden and all moisture has evaporated, about 7 minutes. Add the chopped porcini. Season with salt." },
      { stepNumber: 4, instruction: "Add the rice to the pan. Toast, stirring constantly, for 2 minutes until the grains are coated and slightly translucent at the edges." },
      { stepNumber: 5, instruction: "Pour in the white wine. Stir until completely absorbed." },
      { stepNumber: 6, instruction: "Add the hot stock one ladle at a time, stirring constantly and only adding the next ladle when the previous one is absorbed. This takes 18 to 20 minutes." },
      { stepNumber: 7, instruction: "Remove from heat. Add cold butter and Parmigiano. Beat vigorously — this is the mantecatura, which makes risotto creamy. Rest 2 minutes, then serve immediately." },
    ],
  });

  await createRecipe({
    title: "Tiramisu",
    description: "The definitive Italian dessert — espresso-soaked ladyfingers layered with a mascarpone and egg cream, dusted with cocoa. No baking required. No shortcuts permitted.",
    cultural: "Italian", holiday: null, category: "Dessert",
    prepTime: 30,
    imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800",
    notes: [{ author: "Grandma Louise", content: "Use real espresso, not instant coffee. And use good cocoa — the kind that makes you sneeze when you dust it. That is the right cocoa." }],
    ingredients: [
      { order: 1, amount: "6",   unit: null,  name: "large egg yolks" },
      { order: 2, amount: "150", unit: "g",   name: "caster sugar" },
      { order: 3, amount: "500", unit: "g",   name: "mascarpone, room temperature" },
      { order: 4, amount: "300", unit: "ml",  name: "heavy cream, cold" },
      { order: 5, amount: "300", unit: "ml",  name: "strong espresso, cooled" },
      { order: 6, amount: "3",   unit: "tbsp",name: "dark rum or Marsala wine" },
      { order: 7, amount: "24",  unit: null,  name: "Savoiardi ladyfinger biscuits" },
      { order: 8, amount: "3",   unit: "tbsp",name: "good quality unsweetened cocoa powder" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Beat egg yolks and sugar together until pale, thick, and ribbon-like — about 5 minutes. The mixture should hold a trail when the whisk is lifted." },
      { stepNumber: 2, instruction: "Add mascarpone to the egg mixture and beat on low until just combined and smooth. Do not overbeat or it will become grainy." },
      { stepNumber: 3, instruction: "In a separate bowl, whip the cold cream to soft peaks. Gently fold the whipped cream into the mascarpone mixture in three additions." },
      { stepNumber: 4, instruction: "Combine cooled espresso and rum in a shallow bowl. Working quickly, dip each ladyfinger for exactly 2 seconds per side — they should be moist but not saturated." },
      { stepNumber: 5, instruction: "Arrange a layer of dipped ladyfingers in a deep dish. Spread half the mascarpone cream over them. Repeat with remaining ladyfingers and cream." },
      { stepNumber: 6, instruction: "Dust generously with cocoa through a fine sieve. Cover and refrigerate for at least 6 hours, preferably overnight — the tiramisu needs time to set and for flavors to meld." },
    ],
  });

  await createRecipe({
    title: "Sfogliatelle",
    description: "Naples' most iconic pastry — crispy, shell-shaped layers of paper-thin dough filled with a ricotta and semolina cream scented with orange and cinnamon. A labor of love and a masterpiece.",
    cultural: "Italian", holiday: null, category: "Dessert",
    prepTime: 300,
    imageUrl: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=800",
    notes: [{ author: "Grandma Louise", content: "This is a Sunday project. You cannot rush sfogliatelle. But when someone bites into one and the layers shatter — that is worth every minute." }],
    ingredients: [
      { order: 1,  amount: "500", unit: "g",    name: "semolina flour" },
      { order: 2,  amount: "180", unit: "ml",   name: "water" },
      { order: 3,  amount: "1",   unit: "tsp",  name: "fine salt" },
      { order: 4,  amount: "150", unit: "g",    name: "lard or shortening, softened" },
      { order: 5,  amount: "250", unit: "ml",   name: "whole milk (for filling)" },
      { order: 6,  amount: "150", unit: "g",    name: "fine semolina (for filling)" },
      { order: 7,  amount: "300", unit: "g",    name: "fresh ricotta, well drained" },
      { order: 8,  amount: "200", unit: "g",    name: "caster sugar" },
      { order: 9,  amount: "2",   unit: null,   name: "egg yolks" },
      { order: 10, amount: "1",   unit: null,   name: "orange, zested" },
      { order: 11, amount: "1",   unit: "tsp",  name: "ground cinnamon" },
      { order: 12, amount: "1/2", unit: "cup",  name: "candied citron or mixed peel, finely chopped" },
      { order: 13, amount: "for dusting", unit: null, name: "powdered sugar" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Make the dough: combine semolina flour, water, and salt. Knead until a stiff, smooth dough forms — about 10 minutes. Wrap and rest 1 hour." },
      { stepNumber: 2, instruction: "Make the filling: bring milk to a simmer. Rain in fine semolina, whisking constantly. Cook until very thick, like polenta — about 5 minutes. Transfer to a bowl and cool completely. Beat in ricotta, sugar, egg yolks, orange zest, cinnamon, and candied peel. Refrigerate." },
      { stepNumber: 3, instruction: "Using a pasta machine or rolling pin, roll the dough into a very long, very thin strip — as thin as you can get it, ideally less than 1mm." },
      { stepNumber: 4, instruction: "Spread the lard generously over the entire surface of the dough strip. Roll it up tightly into a log. Wrap in plastic and refrigerate for 1 hour." },
      { stepNumber: 5, instruction: "Preheat oven to 200°C (400°F). Cut the log into 1cm rounds. Hold a round in your palm and use your thumbs to press the center outward, forming a cone shape." },
      { stepNumber: 6, instruction: "Fill each cone with the ricotta filling using a piping bag or small spoon. Pinch the edges closed firmly." },
      { stepNumber: 7, instruction: "Place on a parchment-lined baking sheet. Bake 25 to 30 minutes until deeply golden and the layers are visibly separated and crisp." },
      { stepNumber: 8, instruction: "Dust generously with powdered sugar while still hot. Serve warm — sfogliatelle are best within an hour of baking." },
    ],
  });

  // ═══════════════════════════════════════════════════════════════
  // DUTCH — Oma (Amsterdam)
  // ═══════════════════════════════════════════════════════════════

  await createRecipe({
    title: "Oma's Erwtensoep (Dutch Split Pea Soup)",
    description: "A thick, hearty split pea soup with rookworst sausage, celeriac, leeks, and smoked pork. Called 'snert' — traditionally eaten on Christmas Eve.",
    cultural: "Dutch", holiday: "Christmas", category: "Soup",
    prepTime: 150,
    imageUrl: "https://www.thegluttonlife.com/wp-content/uploads/2020/02/DSC_0130-1024x678.jpg",
    notes: [{ author: "Oma", content: "It must be thick enough for a spoon to stand up in it. If it is not, keep cooking." }],
    ingredients: [
      { order: 1,  amount: "500", unit: "g",      name: "green split peas, rinsed" },
      { order: 2,  amount: "1",   unit: null,      name: "smoked pork hock (about 700g)" },
      { order: 3,  amount: "2",   unit: null,      name: "rookworst sausages (or kielbasa)" },
      { order: 4,  amount: "1",   unit: null,      name: "celeriac (about 400g), peeled and diced" },
      { order: 5,  amount: "3",   unit: null,      name: "medium potatoes, peeled and diced" },
      { order: 6,  amount: "2",   unit: null,      name: "large leeks, white and light green parts, sliced" },
      { order: 7,  amount: "3",   unit: null,      name: "carrots, diced" },
      { order: 8,  amount: "2",   unit: null,      name: "celery stalks, sliced" },
      { order: 9,  amount: "1",   unit: null,      name: "large onion, diced" },
      { order: 10, amount: "2",   unit: null,      name: "bay leaves" },
      { order: 11, amount: "2",   unit: "liters",  name: "water" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Place split peas, pork hock, bay leaves, and water in a large heavy pot. Bring to a boil, skimming off any gray foam." },
      { stepNumber: 2, instruction: "Reduce to a gentle simmer. Add onion, carrots, celery, and celeriac. Cook partially covered for 1 hour, stirring occasionally." },
      { stepNumber: 3, instruction: "Add potatoes and leeks. Continue simmering 30 to 45 minutes until peas have completely dissolved and soup is very thick." },
      { stepNumber: 4, instruction: "Remove pork hock. Strip the meat, shred it, and return to the pot. Discard bone and bay leaves." },
      { stepNumber: 5, instruction: "Add rookworst and simmer 15 minutes. Remove, slice into rounds, return to the pot." },
      { stepNumber: 6, instruction: "Season generously with salt and white pepper. Soup should be almost porridge-like. Simmer uncovered if too thin." },
      { stepNumber: 7, instruction: "Always better the next day. Refrigerate overnight and reheat gently. Serve with thickly buttered rye bread." },
    ],
  });

  await createRecipe({
    title: "Paasstol (Dutch Easter Bread)",
    description: "An enriched yeast bread filled with homemade almond paste and candied citrus peel. Shaped into a log and dusted with powdered sugar. Oma's Easter morning tradition.",
    cultural: "Dutch", holiday: "Easter", category: "Bread",
    prepTime: 240,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
    notes: [{ author: "Oma", content: "The almond paste must be homemade. The ones in the store have too much sugar and not enough almonds." }],
    ingredients: [
      { order: 1,  amount: "500", unit: "g",   name: "bread flour" },
      { order: 2,  amount: "7",   unit: "g",   name: "instant yeast (1 sachet)" },
      { order: 3,  amount: "80",  unit: "g",   name: "caster sugar" },
      { order: 4,  amount: "1",   unit: "tsp", name: "fine salt" },
      { order: 5,  amount: "2",   unit: null,  name: "large eggs" },
      { order: 6,  amount: "150", unit: "ml",  name: "whole milk, warm" },
      { order: 7,  amount: "100", unit: "g",   name: "unsalted butter, softened" },
      { order: 8,  amount: "100", unit: "g",   name: "mixed candied citrus peel" },
      { order: 9,  amount: "250", unit: "g",   name: "ground almonds (for paste)" },
      { order: 10, amount: "200", unit: "g",   name: "caster sugar (for paste)" },
      { order: 11, amount: "1",   unit: null,  name: "egg (for paste)" },
      { order: 12, amount: "1",   unit: null,  name: "lemon, zested (for paste)" },
      { order: 13, amount: "1",   unit: null,  name: "egg, beaten (for wash)" },
      { order: 14, amount: "generous", unit: null, name: "powdered sugar for dusting" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Make almond paste: combine ground almonds, 200g sugar, one egg, and lemon zest. Mix into a firm paste. Wrap and refrigerate 30 minutes." },
      { stepNumber: 2, instruction: "Combine flour, yeast, sugar, and salt. Add eggs and warm milk. Mix until a shaggy dough forms. Knead 5 minutes." },
      { stepNumber: 3, instruction: "Add softened butter a few pieces at a time, kneading fully before adding more — about 8 to 10 minutes. Add candied peel. Shape into a ball, leave to rise 1 to 1.5 hours until doubled." },
      { stepNumber: 4, instruction: "Roll almond paste into a 30cm log. Roll dough into an oval roughly 35x25cm." },
      { stepNumber: 5, instruction: "Place almond paste log slightly off-center. Fold the larger flap over the paste. Press edges firmly to seal." },
      { stepNumber: 6, instruction: "Transfer to parchment-lined baking sheet. Cover and prove 45 minutes. Preheat oven to 180°C." },
      { stepNumber: 7, instruction: "Brush with beaten egg. Bake 30 to 35 minutes until deep golden. Cool completely then dust generously with powdered sugar." },
    ],
  });

  await createRecipe({
    title: "Stamppot Boerenkool (Kale and Potato Mash)",
    description: "Mashed potatoes and kale cooked together, served with rookworst and gravy. The Dutch comfort dish Oma makes for Thanksgiving because it feeds a crowd and travels well.",
    cultural: "Dutch", holiday: "Thanksgiving", category: "Side",
    prepTime: 45,
    imageUrl: "https://www.internationalcuisine.com/wp-content/uploads/2017/07/Dutch-Stompot-e1500418376615.jpg",
    notes: [{ author: "Oma", content: "Kale is better after the first frost. We don't get frost in Phoenix so I put the kale in the freezer for an hour first." }],
    ingredients: [
      { order: 1, amount: "1.5", unit: "kg",  name: "starchy potatoes, peeled and quartered" },
      { order: 2, amount: "500", unit: "g",   name: "curly kale, stems removed, roughly chopped" },
      { order: 3, amount: "2",   unit: null,  name: "rookworst sausages (or kielbasa)" },
      { order: 4, amount: "100", unit: "ml",  name: "whole milk, warmed" },
      { order: 5, amount: "60",  unit: "g",   name: "unsalted butter" },
      { order: 6, amount: "to taste", unit: null, name: "salt, white pepper, and freshly grated nutmeg" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Place potatoes in cold salted water. Bring to a boil and cook 10 minutes." },
      { stepNumber: 2, instruction: "Add kale on top of the potatoes. Continue cooking 10 to 15 minutes until potatoes are completely tender." },
      { stepNumber: 3, instruction: "Simmer rookworst in a separate pan with enough water to cover for 15 minutes. Do not boil or the skin will split." },
      { stepNumber: 4, instruction: "Drain potatoes and kale thoroughly. Return to pot over low heat 1 to 2 minutes to drive off excess steam." },
      { stepNumber: 5, instruction: "Mash together with warm milk and butter. Season generously with salt, white pepper, and nutmeg." },
      { stepNumber: 6, instruction: "Mound onto a platter. Make a well in the center and pour in hot gravy. Arrange sliced rookworst alongside. Serve with mustard." },
    ],
  });

  await createRecipe({
    title: "Kerststol (Dutch Christmas Bread)",
    description: "A richer, more festive version of the stol — packed with winter dried fruits, marzipan, and warming spices, topped with flaked almonds and a blizzard of powdered sugar.",
    cultural: "Dutch", holiday: "Christmas", category: "Bread",
    prepTime: 270,
    imageUrl: "https://www.chefspencil.com/wp-content/uploads/Kerststol-Dutch-Christmas-Bread-.jpg",
    notes: [{ author: "Oma", content: "The stol improves every day it sits. Make it three days before Christmas. Wrap it well. On Christmas morning it will be perfect." }],
    ingredients: [
      { order: 1,  amount: "500", unit: "g",   name: "strong white bread flour" },
      { order: 2,  amount: "7",   unit: "g",   name: "instant yeast" },
      { order: 3,  amount: "60",  unit: "g",   name: "caster sugar" },
      { order: 4,  amount: "1",   unit: "tsp", name: "fine salt" },
      { order: 5,  amount: "1",   unit: "tsp", name: "ground cardamom" },
      { order: 6,  amount: "1",   unit: "tsp", name: "ground cinnamon" },
      { order: 7,  amount: "2",   unit: null,  name: "eggs" },
      { order: 8,  amount: "150", unit: "ml",  name: "warm milk" },
      { order: 9,  amount: "120", unit: "g",   name: "unsalted butter, softened" },
      { order: 10, amount: "200", unit: "g",   name: "mixed dried fruits (raisins, currants, mixed peel)" },
      { order: 11, amount: "100", unit: "g",   name: "dried cranberries" },
      { order: 12, amount: "250", unit: "g",   name: "marzipan or almond paste log" },
      { order: 13, amount: "50",  unit: "g",   name: "flaked almonds" },
      { order: 14, amount: "60",  unit: "g",   name: "melted butter (for brushing after baking)" },
      { order: 15, amount: "generous", unit: null, name: "powdered sugar" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Soak dried fruits in warm water or brandy for 30 minutes. Drain and pat dry." },
      { stepNumber: 2, instruction: "Mix flour, yeast, sugar, salt, cardamom, and cinnamon. Add eggs and warm milk. Knead 5 minutes. Add softened butter gradually, kneading until fully incorporated." },
      { stepNumber: 3, instruction: "Knead in the drained fruits. Shape into a ball. Cover and rise 1.5 hours until doubled." },
      { stepNumber: 4, instruction: "Roll dough into an oval. Place marzipan log slightly off-center. Fold larger half over and press to seal. Shape into a neat loaf." },
      { stepNumber: 5, instruction: "Scatter flaked almonds over the top. Cover and prove 45 minutes. Preheat oven to 180°C." },
      { stepNumber: 6, instruction: "Bake 35 to 40 minutes until golden and a skewer comes out clean. Immediately brush generously with melted butter while hot." },
      { stepNumber: 7, instruction: "Cool completely. Dust very generously with powdered sugar. Wrap tightly and rest 1 to 3 days before slicing." },
    ],
  });

  await createRecipe({
    title: "Stroopwafels",
    description: "Two thin, crisp waffle cookies sandwiched around a warm caramel syrup filling. The syrup softens the wafer when placed over a hot cup of coffee — that is the correct way to eat them.",
    cultural: "Dutch", holiday: null, category: "Dessert",
    prepTime: 90,
    imageUrl: "https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=800",
    notes: [{ author: "Oma", content: "Rest them on top of your coffee cup for one minute before eating. The steam softens the caramel. This is not optional — it is the whole point." }],
    ingredients: [
      { order: 1,  amount: "250", unit: "g",    name: "all-purpose flour" },
      { order: 2,  amount: "125", unit: "g",    name: "unsalted butter, softened" },
      { order: 3,  amount: "75",  unit: "g",    name: "caster sugar" },
      { order: 4,  amount: "1",   unit: null,   name: "egg" },
      { order: 5,  amount: "7",   unit: "g",    name: "instant yeast" },
      { order: 6,  amount: "1",   unit: "tsp",  name: "ground cinnamon" },
      { order: 7,  amount: "2",   unit: "tbsp", name: "warm milk" },
      { order: 8,  amount: "200", unit: "g",    name: "dark brown sugar (for syrup)" },
      { order: 9,  amount: "150", unit: "g",    name: "unsalted butter (for syrup)" },
      { order: 10, amount: "4",   unit: "tbsp", name: "golden syrup or light corn syrup" },
      { order: 11, amount: "1",   unit: "tsp",  name: "ground cinnamon (for syrup)" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Combine flour, yeast, sugar, cinnamon, egg, softened butter, and warm milk. Knead into a soft dough. Rest 30 minutes." },
      { stepNumber: 2, instruction: "Make the syrup: combine brown sugar, butter, golden syrup, and cinnamon in a saucepan. Stir over medium heat until butter melts and sugar dissolves. Simmer 3 minutes until thick. Set aside to cool slightly." },
      { stepNumber: 3, instruction: "Divide dough into 20 equal balls. Cook each ball in a waffle iron (or thin pizzelle iron) for about 1 to 2 minutes until golden and crisp." },
      { stepNumber: 4, instruction: "While still hot, use a thin knife or wire to split each waffle cookie in half horizontally." },
      { stepNumber: 5, instruction: "Spread the warm caramel syrup on one half and press the other half on top to sandwich. The syrup sets as it cools." },
      { stepNumber: 6, instruction: "Cool on a wire rack until the caramel firms. Store in an airtight tin. To serve properly, rest one stroopwafel on top of a hot cup of coffee for one minute." },
    ],
  });

  await createRecipe({
    title: "Poffertjes",
    description: "Tiny, fluffy Dutch pancakes made with yeast and buckwheat flour, cooked in a special dimpled pan. Served with a generous pat of butter and a snowfall of powdered sugar.",
    cultural: "Dutch", holiday: null, category: "Dessert",
    prepTime: 60,
    imageUrl: "https://images.unsplash.com/photo-1565299543923-37dd37887442?w=800",
    notes: [{ author: "Oma", content: "The buckwheat is what makes them poffertjes and not just small pancakes. Do not substitute it. The slightly nutty, earthy flavor is everything." }],
    ingredients: [
      { order: 1, amount: "125", unit: "g",   name: "buckwheat flour" },
      { order: 2, amount: "125", unit: "g",   name: "all-purpose flour" },
      { order: 3, amount: "7",   unit: "g",   name: "instant yeast" },
      { order: 4, amount: "300", unit: "ml",  name: "warm whole milk" },
      { order: 5, amount: "1",   unit: null,  name: "egg" },
      { order: 6, amount: "1",   unit: "tbsp",name: "caster sugar" },
      { order: 7, amount: "pinch",unit: null, name: "salt" },
      { order: 8, amount: "2",   unit: "tbsp",name: "unsalted butter, melted (plus more for the pan)" },
      { order: 9, amount: "for serving", unit: null, name: "unsalted butter and powdered sugar" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Whisk together both flours, yeast, sugar, and salt in a bowl." },
      { stepNumber: 2, instruction: "Add warm milk, egg, and melted butter. Whisk until a smooth batter forms. Cover and rest in a warm place for 45 minutes until slightly bubbly." },
      { stepNumber: 3, instruction: "Heat a poffertjes pan (or a mini-muffin tin) over medium heat. Brush each dimple generously with butter." },
      { stepNumber: 4, instruction: "Fill each dimple about two-thirds full with batter. Cook until bubbles appear on the surface and the bottoms are golden, about 2 minutes." },
      { stepNumber: 5, instruction: "Flip each poffertje with a skewer or chopstick. Cook 1 minute more until golden all over." },
      { stepNumber: 6, instruction: "Serve immediately in a pile with a good knob of cold butter melting over the top and a generous dusting of powdered sugar." },
    ],
  });

  // ═══════════════════════════════════════════════════════════════
  // GERMAN — Father's family
  // ═══════════════════════════════════════════════════════════════

  await createRecipe({
    title: "Weihnachtsgans (Christmas Roast Goose)",
    description: "Whole goose roasted with apple, onion, and marjoram stuffing. Served with braised red cabbage and potato dumplings. The German Christmas centerpiece.",
    cultural: "German", holiday: "Christmas", category: "Main",
    prepTime: 240,
    imageUrl: "https://ourgabledhome.com/wp-content/uploads/2024/11/roast-goose-1.jpg",
    notes: [{ author: "Opa Heinrich", content: "Score the skin so the fat renders properly. Baste every thirty minutes. This is the most important step." }],
    ingredients: [
      { order: 1,  amount: "1",   unit: null,   name: "whole goose (about 4.5kg), giblets removed" },
      { order: 2,  amount: "3",   unit: null,   name: "tart apples, peeled, cored, and quartered" },
      { order: 3,  amount: "2",   unit: null,   name: "large onions, quartered" },
      { order: 4,  amount: "2",   unit: "tbsp", name: "dried marjoram" },
      { order: 5,  amount: "1",   unit: "tbsp", name: "caraway seeds" },
      { order: 6,  amount: "1",   unit: "head", name: "red cabbage, cored and shredded" },
      { order: 7,  amount: "200", unit: "ml",   name: "red wine (for cabbage)" },
      { order: 8,  amount: "2",   unit: "tbsp", name: "sugar (for cabbage)" },
      { order: 9,  amount: "4",   unit: null,   name: "cloves (for cabbage)" },
      { order: 10, amount: "2",   unit: null,   name: "juniper berries, crushed (for cabbage)" },
      { order: 11, amount: "1",   unit: "kg",   name: "starchy potatoes, boiled and riced (for dumplings)" },
      { order: 12, amount: "200", unit: "g",    name: "potato starch (for dumplings)" },
      { order: 13, amount: "2",   unit: null,   name: "egg yolks (for dumplings)" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Remove goose from refrigerator 1 hour before cooking. Pat completely dry. Preheat oven to 220°C." },
      { stepNumber: 2, instruction: "Score the skin all over in a crosshatch pattern, cutting through fat but not into meat. Season cavity with salt, pepper, marjoram, and caraway. Fill with apple and onion." },
      { stepNumber: 3, instruction: "Truss the legs. Place breast-side up on a rack in a roasting pan. Rub skin with salt. Roast at 220°C for 30 minutes until skin begins to color." },
      { stepNumber: 4, instruction: "Reduce heat to 170°C. Roast 2.5 to 3 hours, basting with rendered fat every 30 minutes. Drain excess fat as needed. Done when juices run clear." },
      { stepNumber: 5, instruction: "Make braised red cabbage: cook onion in butter, add shredded cabbage, grated apple, red wine, vinegar, sugar, cloves, and juniper. Cook covered on low heat 45 minutes to 1 hour." },
      { stepNumber: 6, instruction: "Make potato dumplings: combine riced boiled potatoes, potato starch, egg yolks, salt, and nutmeg. Form into balls. Cook in gently simmering salted water until they float plus 5 minutes." },
      { stepNumber: 7, instruction: "Rest the goose 20 minutes before carving. Serve with red cabbage, dumplings, and pan drippings deglazed with white wine." },
    ],
  });

  await createRecipe({
    title: "Osterlamm (German Easter Lamb Cake)",
    description: "A soft sponge cake baked in a lamb-shaped mold, dusted with powdered sugar, tied with a red ribbon. Every German household has the mold — it comes out at Easter every year.",
    cultural: "German", holiday: "Easter", category: "Dessert",
    prepTime: 75,
    imageUrl: "https://mydinner.co.uk/wp-content/uploads/2021/03/EasterLambCakeFB.jpg",
    notes: [{ author: "Tante Brigitte", content: "Grease and flour the mold very well or the ears will stick. This is how you ruin Easter." }],
    ingredients: [
      { order: 1,  amount: "4",   unit: null,  name: "large eggs, separated, room temperature" },
      { order: 2,  amount: "150", unit: "g",   name: "caster sugar" },
      { order: 3,  amount: "1",   unit: "tsp", name: "vanilla extract" },
      { order: 4,  amount: "1",   unit: null,  name: "lemon, zested" },
      { order: 5,  amount: "150", unit: "g",   name: "all-purpose flour" },
      { order: 6,  amount: "50",  unit: "g",   name: "cornstarch" },
      { order: 7,  amount: "1.5", unit: "tsp", name: "baking powder" },
      { order: 8,  amount: "pinch", unit: null, name: "salt" },
      { order: 9,  amount: "3",   unit: "tbsp",name: "neutral oil or melted butter" },
      { order: 10, amount: "generous", unit: null, name: "powdered sugar for dusting" },
      { order: 11, amount: "1",   unit: null,  name: "red ribbon for decoration" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Brush every crevice of the lamb mold with softened butter. Dust with flour, shake to coat, tap out excess. Pay special attention to the ears. Preheat oven to 175°C." },
      { stepNumber: 2, instruction: "Beat egg yolks with 100g of the caster sugar, vanilla, and lemon zest until pale, thick, and ribbon-like — about 5 minutes." },
      { stepNumber: 3, instruction: "In a clean bowl, beat egg whites with a pinch of salt until foamy. Gradually add remaining 50g sugar and beat to stiff, glossy peaks." },
      { stepNumber: 4, instruction: "Sift together flour, cornstarch, and baking powder. Fold into yolk mixture in three additions, alternating with the oil." },
      { stepNumber: 5, instruction: "Fold beaten egg whites into the batter in three additions with a light hand." },
      { stepNumber: 6, instruction: "Pour into prepared mold. Bake 35 to 40 minutes until a skewer comes out clean." },
      { stepNumber: 7, instruction: "Cool in the mold exactly 10 minutes, then unmold onto a wire rack. Cool completely before dusting with powdered sugar and tying on the red ribbon." },
    ],
  });

  await createRecipe({
    title: "Sauerbraten with Gingersnap Gravy",
    description: "Beef marinated for three days in red wine vinegar, wine, and spices, then braised until fork-tender. The gravy is finished with crushed gingersnap cookies — sweet balancing sour. Start on Monday.",
    cultural: "German", holiday: "Thanksgiving", category: "Main",
    prepTime: 4320,
    imageUrl: "https://www.daringgourmet.com/wp-content/uploads/2024/07/Sauerbraten-Recipe-11.jpg",
    notes: [{ author: "Opa Heinrich", content: "Start this on Monday for Thanksgiving Thursday. There are no shortcuts with sauerbraten." }],
    ingredients: [
      { order: 1,  amount: "1.5", unit: "kg",  name: "beef rump roast or bottom round" },
      { order: 2,  amount: "500", unit: "ml",  name: "red wine vinegar" },
      { order: 3,  amount: "500", unit: "ml",  name: "dry red wine" },
      { order: 4,  amount: "500", unit: "ml",  name: "water" },
      { order: 5,  amount: "1",   unit: null,  name: "large onion, sliced" },
      { order: 6,  amount: "4",   unit: null,  name: "bay leaves" },
      { order: 7,  amount: "10",  unit: null,  name: "whole cloves" },
      { order: 8,  amount: "10",  unit: null,  name: "whole black peppercorns" },
      { order: 9,  amount: "1",   unit: "tbsp",name: "sugar" },
      { order: 10, amount: "80",  unit: "g",   name: "gingersnap cookies, crushed to crumbs" },
      { order: 11, amount: "2",   unit: "tbsp",name: "brown sugar" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Three days before: boil red wine vinegar, red wine, water, onion, bay leaves, cloves, peppercorns, and sugar. Cool completely." },
      { stepNumber: 2, instruction: "Place beef in a glass or ceramic container. Pour cooled marinade over — meat should be fully submerged. Cover and refrigerate 3 days, turning twice daily." },
      { stepNumber: 3, instruction: "Remove meat, pat very dry. Strain and reserve the marinade liquid." },
      { stepNumber: 4, instruction: "Sear beef in smoking hot oil on all sides until deeply browned, 3 to 4 minutes per side." },
      { stepNumber: 5, instruction: "Pour reserved marinade over meat. Bring to a boil, reduce to very low simmer. Cover tightly and braise 2.5 to 3 hours until fork-tender." },
      { stepNumber: 6, instruction: "Remove meat and rest under foil. Strain braising liquid into a wide saucepan. Reduce by one-third over high heat." },
      { stepNumber: 7, instruction: "Whisk in crushed gingersnaps and brown sugar. Simmer 5 minutes until smooth. Slice sauerbraten across the grain and pour gravy generously over the top." },
    ],
  });

  await createRecipe({
    title: "Lebkuchen (German Gingerbread Cookies)",
    description: "Soft, chewy German gingerbread cookies glazed with white icing or dark chocolate. Fragrant with Lebkuchengewürz — the classic blend of cinnamon, cardamom, cloves, anise, and ginger that means Christmas in Germany.",
    cultural: "German", holiday: "Christmas", category: "Dessert",
    prepTime: 60,
    imageUrl: "https://www.daringgourmet.com/wp-content/uploads/2015/12/Lebkuchen-3-cropped.jpg",
    notes: [{ author: "Tante Brigitte", content: "The dough must rest overnight in the refrigerator. The spices need time to bloom. Cookies made the same day they are mixed taste flat." }],
    ingredients: [
      { order: 1,  amount: "350", unit: "g",   name: "all-purpose flour" },
      { order: 2,  amount: "1",   unit: "tsp", name: "baking soda" },
      { order: 3,  amount: "2",   unit: "tsp", name: "ground cinnamon" },
      { order: 4,  amount: "1",   unit: "tsp", name: "ground ginger" },
      { order: 5,  amount: "1/2", unit: "tsp", name: "ground cardamom" },
      { order: 6,  amount: "1/2", unit: "tsp", name: "ground cloves" },
      { order: 7,  amount: "1/4", unit: "tsp", name: "ground anise" },
      { order: 8,  amount: "150", unit: "g",   name: "dark honey (buckwheat or forest honey)" },
      { order: 9,  amount: "100", unit: "g",   name: "dark brown sugar" },
      { order: 10, amount: "60",  unit: "g",   name: "unsalted butter" },
      { order: 11, amount: "1",   unit: null,  name: "egg" },
      { order: 12, amount: "100", unit: "g",   name: "finely ground almonds" },
      { order: 13, amount: "150", unit: "g",   name: "powdered sugar (for glaze)" },
      { order: 14, amount: "2",   unit: "tbsp",name: "lemon juice (for glaze)" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Melt honey, brown sugar, and butter together in a saucepan over low heat. Do not boil. Stir until sugar dissolves. Cool to room temperature." },
      { stepNumber: 2, instruction: "Whisk together flour, baking soda, all spices, and ground almonds." },
      { stepNumber: 3, instruction: "Beat the egg into the cooled honey mixture. Add the flour mixture and stir until a firm dough forms. Wrap and refrigerate overnight." },
      { stepNumber: 4, instruction: "Preheat oven to 175°C. Roll the dough out to 5mm thickness. Cut into rounds, hearts, stars, or rectangles." },
      { stepNumber: 5, instruction: "Bake 10 to 12 minutes until just set — they firm further as they cool. Do not overbake or they will be dry rather than chewy." },
      { stepNumber: 6, instruction: "Make glaze: whisk powdered sugar and lemon juice until smooth. Brush over warm cookies. Let set completely. Store in an airtight tin — they improve over several days." },
    ],
  });

  await createRecipe({
    title: "Käsespätzle (German Cheese Noodles)",
    description: "Germany's answer to mac and cheese — irregular egg noodles layered with caramelized onions and melted Emmental and Gruyère. A Swabian classic that is deeply comforting.",
    cultural: "German", holiday: null, category: "Main",
    prepTime: 60,
    imageUrl: "https://www.daringgourmet.com/wp-content/uploads/2016/05/Kaesespaetzle-1-square.jpg",
    notes: [{ author: "Opa Heinrich", content: "The onions must be very dark and very sweet — this takes 45 minutes of patience. The cheese is nothing without the onions." }],
    ingredients: [
      { order: 1,  amount: "400", unit: "g",   name: "all-purpose flour" },
      { order: 2,  amount: "4",   unit: null,  name: "large eggs" },
      { order: 3,  amount: "150", unit: "ml",  name: "water" },
      { order: 4,  amount: "1",   unit: "tsp", name: "fine salt" },
      { order: 5,  amount: "pinch", unit: null, name: "freshly grated nutmeg" },
      { order: 6,  amount: "3",   unit: null,  name: "large onions, thinly sliced" },
      { order: 7,  amount: "3",   unit: "tbsp",name: "unsalted butter" },
      { order: 8,  amount: "1",   unit: "tsp", name: "sugar" },
      { order: 9,  amount: "200", unit: "g",   name: "Emmental, grated" },
      { order: 10, amount: "150", unit: "g",   name: "Gruyère, grated" },
      { order: 11, amount: "2",   unit: "tbsp",name: "fresh chives, sliced" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Start the caramelized onions: melt butter in a heavy skillet over medium-low heat. Add sliced onions and sugar. Cook, stirring every few minutes, for 40 to 50 minutes until deep golden brown and jammy. Season with salt." },
      { stepNumber: 2, instruction: "Make spätzle batter: whisk together flour, eggs, water, salt, and nutmeg until a thick, smooth, elastic batter forms. It should drop from a spoon in thick ribbons." },
      { stepNumber: 3, instruction: "Bring a large pot of heavily salted water to a boil. Press the batter through a spätzle maker or a colander with large holes directly into the boiling water." },
      { stepNumber: 4, instruction: "Cook until spätzle float to the surface plus 1 minute more. Remove with a slotted spoon and drain well." },
      { stepNumber: 5, instruction: "Preheat oven to 180°C. Layer half the spätzle in a buttered baking dish. Top with half the caramelized onions and half the cheese. Repeat the layers." },
      { stepNumber: 6, instruction: "Bake 20 to 25 minutes until golden and bubbling. Scatter fresh chives over the top. Serve immediately with a green salad." },
    ],
  });

  await createRecipe({
    title: "Schwarzwälder Kirschtorte (Black Forest Cake)",
    description: "The iconic German layer cake — chocolate sponge soaked in Kirsch cherry liqueur, layered with whipped cream and sour cherries, decorated with chocolate shavings and whole cherries.",
    cultural: "German", holiday: null, category: "Dessert",
    prepTime: 120,
    imageUrl: "https://platedcravings.com/wp-content/uploads/2019/07/Black-Forest-Cake-Recipe-Wide-Plated-Cravings-1.jpg",
    notes: [{ author: "Tante Brigitte", content: "Do not be stingy with the Kirsch. It is not optional. The whole cake is built around that flavor. If you do not want to use alcohol, make a different cake." }],
    ingredients: [
      { order: 1,  amount: "6",   unit: null,   name: "large eggs" },
      { order: 2,  amount: "200", unit: "g",    name: "caster sugar" },
      { order: 3,  amount: "150", unit: "g",    name: "all-purpose flour" },
      { order: 4,  amount: "50",  unit: "g",    name: "good quality cocoa powder" },
      { order: 5,  amount: "1",   unit: "tsp",  name: "baking powder" },
      { order: 6,  amount: "60",  unit: "g",    name: "unsalted butter, melted and cooled" },
      { order: 7,  amount: "100", unit: "ml",   name: "Kirschwasser (cherry schnapps)" },
      { order: 8,  amount: "600", unit: "ml",   name: "heavy whipping cream, very cold" },
      { order: 9,  amount: "3",   unit: "tbsp", name: "powdered sugar (for cream)" },
      { order: 10, amount: "1",   unit: "tsp",  name: "vanilla extract (for cream)" },
      { order: 11, amount: "680", unit: "g",    name: "sour cherries in syrup, drained (reserve syrup)" },
      { order: 12, amount: "100", unit: "g",    name: "dark chocolate, shaved into curls" },
      { order: 13, amount: "12",  unit: null,   name: "fresh or maraschino cherries for decoration" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Preheat oven to 175°C. Beat eggs and sugar together for 8 to 10 minutes until pale, tripled in volume, and thick enough to hold a ribbon." },
      { stepNumber: 2, instruction: "Sift flour, cocoa, and baking powder together. Gently fold into the egg mixture in three additions. Fold in melted butter last." },
      { stepNumber: 3, instruction: "Pour into three 22cm greased and floured cake pans (or bake one tall cake and slice into three layers). Bake 20 to 25 minutes. Cool completely." },
      { stepNumber: 4, instruction: "Mix reserved cherry syrup with Kirschwasser. Brush generously over all three sponge layers — they should be moist but not sodden." },
      { stepNumber: 5, instruction: "Whip cold cream with powdered sugar and vanilla to firm peaks." },
      { stepNumber: 6, instruction: "Place first sponge layer on a cake stand. Spread whipped cream, scatter sour cherries. Add second layer, repeat. Place third layer on top." },
      { stepNumber: 7, instruction: "Cover the entire cake — sides and top — with the remaining whipped cream. Press chocolate shavings onto the sides and decorate the top with rosettes of cream and whole cherries." },
      { stepNumber: 8, instruction: "Refrigerate at least 4 hours before serving. The cake is better the next day." },
    ],
  });

  await createRecipe({
    title: "Christstollen (Dresden Christmas Bread)",
    description: "The iconic German Christmas bread — a rich, dense loaf packed with rum-soaked fruits, marzipan, and spices, then buried under butter and powdered sugar to form a white crust that keeps for weeks.",
    cultural: "German", holiday: "Christmas", category: "Bread",
    prepTime: 480,
    imageUrl: "https://www.daringgourmet.com/wp-content/uploads/2018/11/Stollen-1200px.jpg",
    notes: [{ author: "Tante Brigitte", content: "Make it four weeks before Christmas. The stollen keeps for months wrapped well. Every week it tastes better. This is the only Christmas bread that improves with age." }],
    ingredients: [
      { order: 1,  amount: "500", unit: "g",    name: "strong white bread flour" },
      { order: 2,  amount: "7",   unit: "g",    name: "instant yeast" },
      { order: 3,  amount: "80",  unit: "g",    name: "caster sugar" },
      { order: 4,  amount: "1",   unit: "tsp",  name: "fine salt" },
      { order: 5,  amount: "200", unit: "ml",   name: "warm whole milk" },
      { order: 6,  amount: "120", unit: "g",    name: "unsalted butter, softened" },
      { order: 7,  amount: "1",   unit: null,   name: "egg" },
      { order: 8,  amount: "300", unit: "g",    name: "mixed dried fruits (raisins, currants, mixed peel, dried cherries)" },
      { order: 9,  amount: "100", unit: "g",    name: "blanched almonds, roughly chopped" },
      { order: 10, amount: "4",   unit: "tbsp", name: "dark rum" },
      { order: 11, amount: "1",   unit: "tsp",  name: "ground cinnamon" },
      { order: 12, amount: "1/2", unit: "tsp",  name: "ground cardamom" },
      { order: 13, amount: "1/4", unit: "tsp",  name: "ground nutmeg" },
      { order: 14, amount: "1",   unit: null,   name: "lemon, zested" },
      { order: 15, amount: "250", unit: "g",    name: "marzipan log" },
      { order: 16, amount: "100", unit: "g",    name: "unsalted butter, melted (for after baking)" },
      { order: 17, amount: "200", unit: "g",    name: "powdered sugar (for coating)" },
    ],
    steps: [
      { stepNumber: 1, instruction: "The day before: soak dried fruits in rum overnight. They should absorb most of the liquid." },
      { stepNumber: 2, instruction: "Combine flour, yeast, sugar, salt, and spices. Add warm milk, egg, and softened butter. Knead 10 minutes until smooth and elastic." },
      { stepNumber: 3, instruction: "Knead in the soaked fruits, almonds, and lemon zest until evenly distributed. Cover and rise 2 hours." },
      { stepNumber: 4, instruction: "Roll dough into a thick oval. Place the marzipan log along the center. Fold one side of the dough over the marzipan, overlapping the other side slightly — the traditional stollen shape." },
      { stepNumber: 5, instruction: "Cover and prove 1 hour. Preheat oven to 170°C." },
      { stepNumber: 6, instruction: "Bake 50 to 60 minutes until deep golden brown and sounds hollow when tapped." },
      { stepNumber: 7, instruction: "While still hot, brush the entire surface very generously with melted butter — use all of it. Then immediately dust heavily with powdered sugar, pressing it in with your hands. The butter and sugar form a protective crust." },
      { stepNumber: 8, instruction: "Wrap tightly in foil once cool. Store at room temperature up to 4 weeks, re-dusting with powdered sugar before serving." },
    ],
  });

  // ═══════════════════════════════════════════════════════════════
  // MEXICAN — Tía Carmen & Abuela Rosa
  // ═══════════════════════════════════════════════════════════════

  await createRecipe({
    title: "Bacalao a la Vizcaína (Christmas Salt Cod)",
    description: "Salt cod soaked for two days, simmered with tomatoes, olives, capers, roasted peppers, and potatoes. A Mexican Christmas Eve tradition inherited from Spanish colonial cooking.",
    cultural: "Mexican", holiday: "Christmas", category: "Seafood",
    prepTime: 2880,
    imageUrl: "https://mexicanappetizersandmore.com/wp-content/uploads/Bacalao-a-la-Vizcaina-Facebook-Image.jpg",
    notes: [{ author: "Tía Carmen", content: "Change the water every eight hours when soaking. The cod should taste like fish by the end, not like salt." }],
    ingredients: [
      { order: 1,  amount: "1",   unit: "kg",   name: "dried salt cod (bacalao)" },
      { order: 2,  amount: "6",   unit: null,   name: "Roma tomatoes" },
      { order: 3,  amount: "2",   unit: null,   name: "white onions, roughly chopped" },
      { order: 4,  amount: "6",   unit: null,   name: "garlic cloves" },
      { order: 5,  amount: "3",   unit: null,   name: "red bell peppers, roasted, peeled, and sliced" },
      { order: 6,  amount: "1/2", unit: "cup",  name: "green olives, pitted and halved" },
      { order: 7,  amount: "3",   unit: "tbsp", name: "capers, drained" },
      { order: 8,  amount: "1/2", unit: "cup",  name: "raisins" },
      { order: 9,  amount: "4",   unit: null,   name: "medium potatoes, peeled and cubed" },
      { order: 10, amount: "1/2", unit: "cup",  name: "extra-virgin olive oil" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Two days before: rinse salt cod, cover with cold water, refrigerate. Change water every 8 hours for 48 hours. Taste before cooking — pleasantly salty, not aggressively so." },
      { stepNumber: 2, instruction: "Drain cod. Simmer in fresh water for 10 minutes. Drain, cool, remove skin and bones. Flake into large pieces." },
      { stepNumber: 3, instruction: "Blend tomatoes, one onion, and 4 garlic cloves until smooth. Set aside." },
      { stepNumber: 4, instruction: "Heat olive oil. Cook remaining onion and garlic 5 minutes. Pour in blended tomato sauce. Cook 10 to 15 minutes over medium-high heat, stirring frequently, until darkened." },
      { stepNumber: 5, instruction: "Add roasted peppers, olives, capers, raisins, and cubed potatoes. Add enough water to almost cover." },
      { stepNumber: 6, instruction: "Gently fold in the flaked bacalao. Simmer uncovered on low heat 20 to 25 minutes until potatoes are tender and sauce thickened." },
      { stepNumber: 7, instruction: "Taste and adjust seasoning — you will likely need very little salt. Better the next day. Serve with crusty bread." },
    ],
  });

  await createRecipe({
    title: "Capirotada (Mexican Easter Bread Pudding)",
    description: "Layers of toasted bolillo bread soaked in piloncillo and cinnamon syrup, with raisins, peanuts, coconut, and Cotija cheese. Eaten during Lent and Easter — every ingredient is symbolic.",
    cultural: "Mexican", holiday: "Easter", category: "Dessert",
    prepTime: 90,
    imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800",
    notes: [{ author: "Tía Carmen", content: "The cheese is not a mistake. Do not leave it out. It melts into the syrup and you cannot taste it separately — you just taste richness." }],
    ingredients: [
      { order: 1,  amount: "6",   unit: null,   name: "bolillo rolls, sliced 2cm thick and dried overnight" },
      { order: 2,  amount: "250", unit: "g",    name: "piloncillo, chopped, or 1 cup dark brown sugar" },
      { order: 3,  amount: "1",   unit: "liter",name: "water" },
      { order: 4,  amount: "2",   unit: null,   name: "cinnamon sticks" },
      { order: 5,  amount: "1/2", unit: "cup",  name: "raisins" },
      { order: 6,  amount: "1/2", unit: "cup",  name: "roasted peanuts" },
      { order: 7,  amount: "1/2", unit: "cup",  name: "unsweetened shredded coconut" },
      { order: 8,  amount: "150", unit: "g",    name: "Cotija cheese, crumbled" },
      { order: 9,  amount: "3",   unit: "tbsp", name: "unsalted butter, cut into pieces" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Make piloncillo syrup: combine piloncillo, water, cinnamon sticks, and cloves. Boil, stirring, until dissolved. Simmer 15 minutes until slightly thickened. Strain and keep warm." },
      { stepNumber: 2, instruction: "Fry bread slices in vegetable oil until golden on both sides. Drain on paper towels." },
      { stepNumber: 3, instruction: "Preheat oven to 180°C. Grease a deep baking dish." },
      { stepNumber: 4, instruction: "Layer fried bread in the dish. Scatter half the raisins, peanuts, coconut, and Cotija over the bread. Dot with half the butter." },
      { stepNumber: 5, instruction: "Add a second layer of bread. Repeat with remaining raisins, peanuts, coconut, Cotija, and butter." },
      { stepNumber: 6, instruction: "Pour warm piloncillo syrup evenly over the entire dish. Press down gently. Let sit 5 minutes, press again." },
      { stepNumber: 7, instruction: "Cover with foil. Bake 25 minutes. Uncover and bake 10 to 15 minutes until set and slightly caramelized. Serve warm or at room temperature." },
    ],
  });

  await createRecipe({
    title: "Mole Negro Turkey",
    description: "Thanksgiving turkey served with a deep mole negro — dried chiles, Mexican chocolate, plantain, sesame, and more than thirty ingredients. The dish that makes Thanksgiving make sense.",
    cultural: "Mexican", holiday: "Thanksgiving", category: "Main",
    prepTime: 480,
    imageUrl: "https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=800",
    notes: [
      { author: "Abuela Rosa", content: "The mole takes all day. It is not a weeknight recipe. But on Thanksgiving you have time, and when people taste it they understand why." },
      { author: "Tía Carmen",  content: "Toast every chile individually. Do not rush the toasting. This is where the flavor comes from." },
    ],
    ingredients: [
      { order: 1,  amount: "1",   unit: null,    name: "whole turkey (5 to 6kg)" },
      { order: 2,  amount: "6",   unit: null,    name: "dried mulato chiles, stems and seeds removed" },
      { order: 3,  amount: "4",   unit: null,    name: "dried ancho chiles, stems and seeds removed" },
      { order: 4,  amount: "4",   unit: null,    name: "dried pasilla chiles, stems and seeds removed" },
      { order: 5,  amount: "2",   unit: null,    name: "dried chipotle chiles" },
      { order: 6,  amount: "1",   unit: null,    name: "ripe plantain, peeled and sliced" },
      { order: 7,  amount: "1",   unit: null,    name: "white onion, quartered and charred" },
      { order: 8,  amount: "6",   unit: null,    name: "garlic cloves, charred" },
      { order: 9,  amount: "4",   unit: null,    name: "Roma tomatoes, charred" },
      { order: 10, amount: "1/4", unit: "cup",   name: "sesame seeds, toasted" },
      { order: 11, amount: "1/4", unit: "cup",   name: "pepitas, toasted" },
      { order: 12, amount: "90",  unit: "g",     name: "Mexican chocolate (Ibarra or Abuelita), chopped" },
      { order: 13, amount: "1.5", unit: "liters",name: "warm turkey or chicken stock" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Toast each type of chile individually on a dry comal — press flat for 20 seconds per side until fragrant. Do not burn. Soak in hot water 30 minutes, then drain." },
      { stepNumber: 2, instruction: "Char the onion, garlic, and tomatoes directly on a hot comal until blackened in spots. The char is essential flavor." },
      { stepNumber: 3, instruction: "Fry plantain and bread in lard until golden. Fry tortilla pieces until crisp." },
      { stepNumber: 4, instruction: "Blend in batches: chiles with stock, charred vegetables, and plantain-bread-spice-chocolate mixture until very smooth." },
      { stepNumber: 5, instruction: "Fry the chile purée in hot lard in a heavy pot, stirring constantly for 5 to 8 minutes. It will spit aggressively. The paste must darken." },
      { stepNumber: 6, instruction: "Add remaining blends. Add warm stock gradually, stirring constantly, until thick sauce consistency. Season with salt and sugar. Simmer on lowest heat 45 minutes to 1 hour." },
      { stepNumber: 7, instruction: "Roast turkey by your preferred method. Carve, arrange on a platter, pour mole generously over. Scatter sesame seeds. Serve extra mole in a warm bowl with tortillas." },
    ],
  });

  await createRecipe({
    title: "Tamales de Puerco (Pork Tamales)",
    description: "Tender masa dough filled with slow-braised chile pork, wrapped in corn husks and steamed for two hours. A Christmas Eve tradition — the whole family gathers to spread masa and assemble tamales the night before.",
    cultural: "Mexican", holiday: "Christmas", category: "Main",
    prepTime: 360,
    imageUrl: "https://www.isabeleats.com/wp-content/uploads/2024/11/pozole-featured-small-24-1.jpg",
    notes: [{ author: "Abuela Rosa", content: "Tamales are not a one-person recipe. You need hands. Call the family. Put on music. Making tamales is the celebration before the celebration." }],
    ingredients: [
      { order: 1,  amount: "1",   unit: "kg",   name: "pork shoulder, cut into large chunks" },
      { order: 2,  amount: "5",   unit: null,   name: "dried guajillo chiles, seeded" },
      { order: 3,  amount: "3",   unit: null,   name: "dried ancho chiles, seeded" },
      { order: 4,  amount: "4",   unit: null,   name: "garlic cloves" },
      { order: 5,  amount: "1",   unit: null,   name: "white onion, quartered" },
      { order: 6,  amount: "1",   unit: "tsp",  name: "dried Mexican oregano" },
      { order: 7,  amount: "1",   unit: "tsp",  name: "ground cumin" },
      { order: 8,  amount: "500", unit: "g",    name: "dried corn husks, soaked in warm water 2 hours" },
      { order: 9,  amount: "750", unit: "g",    name: "masa harina (Maseca)" },
      { order: 10, amount: "500", unit: "ml",   name: "warm pork broth (from cooking the pork)" },
      { order: 11, amount: "200", unit: "g",    name: "lard or vegetable shortening" },
      { order: 12, amount: "1",   unit: "tsp",  name: "baking powder" },
      { order: 13, amount: "1.5", unit: "tsp",  name: "salt (for masa)" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Cover pork with water in a pot. Add half the onion, 2 garlic cloves, salt, and pepper. Bring to a boil, then simmer covered for 1.5 hours until very tender. Reserve the broth. Shred the pork." },
      { stepNumber: 2, instruction: "Toast the dried chiles in a dry skillet 20 seconds per side. Soak in hot water 20 minutes. Blend with remaining garlic, onion, oregano, cumin, and enough soaking water to form a smooth sauce." },
      { stepNumber: 3, instruction: "Fry the chile sauce in a hot pan with lard for 5 minutes, stirring, until it darkens. Add shredded pork. Simmer 15 minutes. Taste and season. Cool slightly." },
      { stepNumber: 4, instruction: "Make the masa: beat lard with baking powder until light and fluffy. Add masa harina, warm pork broth, and salt. Beat until a soft, spreadable dough forms. Test: a small ball dropped in cold water should float." },
      { stepNumber: 5, instruction: "Assembly: shake excess water from a corn husk. Spread a thin layer of masa (about 3mm) over the wide end of the husk, leaving a border at the sides and bottom." },
      { stepNumber: 6, instruction: "Place a spoonful of pork filling in the center of the masa. Fold the sides of the husk inward over the filling, then fold the bottom up. Stack seam-side down in a steamer basket." },
      { stepNumber: 7, instruction: "Steam for 1.5 to 2 hours, checking water level and adding boiling water as needed. Tamales are done when the masa pulls cleanly away from the husk. Rest 10 minutes before unwrapping." },
    ],
  });

  await createRecipe({
    title: "Pozole Rojo (Red Pork and Hominy Soup)",
    description: "A deeply flavored red chile broth with slow-cooked pork and plump hominy corn. Served with a full spread of garnishes — shredded cabbage, radishes, dried oregano, and lime. A Christmas and New Year's Eve tradition.",
    cultural: "Mexican", holiday: "Christmas", category: "Soup",
    prepTime: 180,
    imageUrl: "https://www.isabeleats.com/wp-content/uploads/2024/11/pozole-featured-small-24-1.jpg",
    notes: [{ author: "Tía Carmen", content: "The garnishes are not optional. They are half the recipe. Put everything on the table and let people build their own bowl." }],
    ingredients: [
      { order: 1,  amount: "1",   unit: "kg",  name: "pork shoulder, bone-in if possible" },
      { order: 2,  amount: "800", unit: "g",   name: "canned hominy, drained and rinsed" },
      { order: 3,  amount: "5",   unit: null,  name: "dried guajillo chiles, stemmed and seeded" },
      { order: 4,  amount: "3",   unit: null,  name: "dried ancho chiles, stemmed and seeded" },
      { order: 5,  amount: "1",   unit: null,  name: "white onion, halved" },
      { order: 6,  amount: "6",   unit: null,  name: "garlic cloves" },
      { order: 7,  amount: "1",   unit: "tsp", name: "dried Mexican oregano" },
      { order: 8,  amount: "2",   unit: null,  name: "bay leaves" },
      { order: 9,  amount: "2",   unit: "liters", name: "water" },
      { order: 10, amount: "for garnish", unit: null, name: "shredded cabbage, sliced radishes, dried oregano, lime wedges, diced white onion, tostadas" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Place pork in a large pot with water, half the onion, 3 garlic cloves, bay leaves, and salt. Bring to a boil, skim foam, then simmer covered for 1.5 to 2 hours until very tender." },
      { stepNumber: 2, instruction: "Toast dried chiles on a dry comal for 20 seconds per side. Soak in 500ml hot water for 20 minutes." },
      { stepNumber: 3, instruction: "Blend soaked chiles with remaining garlic, onion, and oregano, using the soaking water. Strain through a fine sieve." },
      { stepNumber: 4, instruction: "Remove pork from broth. Shred the meat, discarding bone and fat. Strain and reserve the broth." },
      { stepNumber: 5, instruction: "Fry the chile purée in hot lard in the pot for 5 minutes, stirring constantly. Add the pork broth and bring to a simmer." },
      { stepNumber: 6, instruction: "Add the shredded pork and drained hominy. Simmer together for 30 minutes. Taste and adjust salt." },
      { stepNumber: 7, instruction: "Ladle into deep bowls. Set out all garnishes in separate bowls on the table. Each person builds their own." },
    ],
  });

  await createRecipe({
    title: "Chiles en Nogada",
    description: "Roasted poblano chiles stuffed with a fragrant picadillo of pork, fruit, and spices, topped with a cool walnut cream sauce and scattered with pomegranate seeds and parsley. Green, white, and red — the colors of the Mexican flag.",
    cultural: "Mexican", holiday: "Thanksgiving", category: "Main",
    prepTime: 180,
    imageUrl: "https://www.royalresorts.com/blog/wp-content/uploads/2023/08/chiles-en-nogada.jpg",
    notes: [{ author: "Abuela Rosa", content: "This dish celebrates the harvest. The pomegranate seeds must be fresh — not a garnish you skip. They are what makes this dish what it is." }],
    ingredients: [
      { order: 1,  amount: "8",   unit: null,   name: "large poblano chiles" },
      { order: 2,  amount: "400", unit: "g",    name: "ground pork" },
      { order: 3,  amount: "1",   unit: null,   name: "white onion, finely diced" },
      { order: 4,  amount: "3",   unit: null,   name: "garlic cloves, minced" },
      { order: 5,  amount: "2",   unit: null,   name: "peaches or pears, peeled and diced" },
      { order: 6,  amount: "2",   unit: null,   name: "apples, peeled and diced" },
      { order: 7,  amount: "1/2", unit: "cup",  name: "raisins" },
      { order: 8,  amount: "1/2", unit: "cup",  name: "blanched almonds, roughly chopped" },
      { order: 9,  amount: "2",   unit: null,   name: "tomatoes, diced" },
      { order: 10, amount: "1",   unit: "tsp",  name: "ground cinnamon" },
      { order: 11, amount: "1/4", unit: "tsp",  name: "ground cloves" },
      { order: 12, amount: "200", unit: "g",    name: "fresh walnuts, soaked in milk 1 hour and peeled" },
      { order: 13, amount: "200", unit: "g",    name: "fresh goat cheese or cream cheese" },
      { order: 14, amount: "100", unit: "ml",   name: "heavy cream" },
      { order: 15, amount: "1",   unit: null,   name: "pomegranate, seeds removed" },
      { order: 16, amount: "1/2", unit: "cup",  name: "fresh flat-leaf parsley leaves" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Roast poblanos over an open flame or under the broiler, turning, until charred all over. Place in a plastic bag for 15 minutes. Peel off the charred skin — do not rinse, you lose flavor. Make a slit down one side and carefully remove seeds, keeping the chile intact." },
      { stepNumber: 2, instruction: "Make the picadillo: cook onion and garlic in oil until soft. Add ground pork and cook until browned. Add tomatoes, fruit, raisins, almonds, cinnamon, cloves, salt, and pepper. Cook over medium heat for 20 minutes until mixture is fragrant and almost dry. Cool slightly." },
      { stepNumber: 3, instruction: "Make the nogada sauce: blend soaked, peeled walnuts, goat cheese, cream, and a pinch of salt until completely smooth and white. It should be thick enough to coat the back of a spoon. Taste — it should be creamy and mildly sweet." },
      { stepNumber: 4, instruction: "Carefully fill each poblano with the picadillo, pressing gently to fill without tearing. Arrange on a serving platter." },
      { stepNumber: 5, instruction: "Spoon the cold nogada sauce generously over each chile. Scatter pomegranate seeds over the top. Finish with fresh parsley leaves." },
      { stepNumber: 6, instruction: "Serve at room temperature — not hot, not cold. This dish is served the day it is made." },
    ],
  });

  await createRecipe({
    title: "Tres Leches Cake",
    description: "A light sponge cake soaked in three kinds of milk — whole milk, evaporated milk, and sweetened condensed milk — until every bite is impossibly moist. Topped with whipped cream and a dusting of cinnamon.",
    cultural: "Mexican", holiday: null, category: "Dessert",
    prepTime: 90,
    imageUrl: "https://www.laylita.com/recipes/wp-content/uploads/2024/09/Traditional-tres-leches-cake-recipe.jpg",
    notes: [{ author: "Tía Carmen", content: "Do not skip the overnight rest in the refrigerator. The cake absorbs the milk while it sleeps. In the morning it is a different cake than what you baked." }],
    ingredients: [
      { order: 1,  amount: "5",   unit: null,   name: "large eggs, separated" },
      { order: 2,  amount: "200", unit: "g",    name: "caster sugar" },
      { order: 3,  amount: "200", unit: "g",    name: "all-purpose flour" },
      { order: 4,  amount: "1",   unit: "tsp",  name: "baking powder" },
      { order: 5,  amount: "1",   unit: "tsp",  name: "vanilla extract" },
      { order: 6,  amount: "1/3", unit: "cup",  name: "whole milk" },
      { order: 7,  amount: "400", unit: "ml",   name: "sweetened condensed milk" },
      { order: 8,  amount: "370", unit: "ml",   name: "evaporated milk" },
      { order: 9,  amount: "1",   unit: "cup",  name: "whole milk (for three-milk soak)" },
      { order: 10, amount: "500", unit: "ml",   name: "heavy cream, cold" },
      { order: 11, amount: "3",   unit: "tbsp", name: "powdered sugar" },
      { order: 12, amount: "1",   unit: "tsp",  name: "ground cinnamon, for dusting" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Preheat oven to 175°C. Beat egg yolks with sugar until pale and thick. Beat in vanilla. Fold in flour and baking powder alternating with whole milk." },
      { stepNumber: 2, instruction: "Beat egg whites to stiff peaks. Fold gently into the batter in three additions." },
      { stepNumber: 3, instruction: "Pour into a greased 33x23cm baking dish. Bake 25 to 30 minutes until golden and a skewer comes out clean. Cool completely in the pan." },
      { stepNumber: 4, instruction: "Mix the three milks together: sweetened condensed milk, evaporated milk, and whole milk." },
      { stepNumber: 5, instruction: "Pierce the cooled cake all over with a fork. Pour the milk mixture slowly and evenly over the entire surface. The cake will absorb it all." },
      { stepNumber: 6, instruction: "Cover and refrigerate overnight — or at least 4 hours." },
      { stepNumber: 7, instruction: "Whip cold cream with powdered sugar to firm peaks. Spread over the top of the cake. Dust generously with cinnamon. Serve cold, directly from the pan." },
    ],
  });

  await createRecipe({
    title: "Churros con Chocolate",
    description: "Crispy fried dough dusted with cinnamon sugar, served with a thick, dark Mexican-style drinking chocolate for dipping. A beloved Mexican sweet found at every fair, every market, and now every holiday table.",
    cultural: "Mexican", holiday: null, category: "Dessert",
    prepTime: 45,
    imageUrl: "https://www.holajalapeno.com/wp-content/uploads/2021/12/homemade-churros.jpg",
    notes: [{ author: "Abuela Rosa", content: "The chocolate must be thick — thick enough to coat the churro and not drip. If it drips, it is hot chocolate, not churro chocolate. Keep cooking it." }],
    ingredients: [
      { order: 1,  amount: "250", unit: "ml",   name: "water" },
      { order: 2,  amount: "1",   unit: "tbsp", name: "caster sugar" },
      { order: 3,  amount: "1/2", unit: "tsp",  name: "fine salt" },
      { order: 4,  amount: "1",   unit: "tbsp", name: "vegetable oil (for dough)" },
      { order: 5,  amount: "200", unit: "g",    name: "all-purpose flour" },
      { order: 6,  amount: "1",   unit: "liter",name: "vegetable oil for frying" },
      { order: 7,  amount: "100", unit: "g",    name: "caster sugar (for coating)" },
      { order: 8,  amount: "2",   unit: "tsp",  name: "ground cinnamon (for coating)" },
      { order: 9,  amount: "200", unit: "g",    name: "Mexican chocolate (Ibarra) or dark chocolate, chopped" },
      { order: 10, amount: "400", unit: "ml",   name: "whole milk" },
      { order: 11, amount: "2",   unit: "tbsp", name: "cornstarch" },
      { order: 12, amount: "2",   unit: "tbsp", name: "caster sugar (for chocolate)" },
      { order: 13, amount: "1/2", unit: "tsp",  name: "ground cinnamon (for chocolate)" },
    ],
    steps: [
      { stepNumber: 1, instruction: "Make the chocolate: whisk cornstarch into a little of the cold milk until dissolved. Heat remaining milk in a saucepan with sugar and cinnamon. When hot, whisk in the cornstarch mixture. Add chocolate and stir constantly over medium heat until thick and glossy. Keep warm." },
      { stepNumber: 2, instruction: "Make the dough: bring water, sugar, salt, and oil to a boil. Remove from heat and add flour all at once. Beat vigorously with a wooden spoon until the dough comes together into a smooth ball that leaves the sides of the pan." },
      { stepNumber: 3, instruction: "Transfer dough to a piping bag fitted with a large star tip (the star creates the ridges that hold the cinnamon sugar)." },
      { stepNumber: 4, instruction: "Heat oil to 180°C in a deep pot. Pipe 15cm lengths of dough directly into the hot oil, cutting with scissors." },
      { stepNumber: 5, instruction: "Fry in batches of 3 to 4 for 3 to 4 minutes, turning once, until deeply golden and crisp all over." },
      { stepNumber: 6, instruction: "Drain on paper towels for 30 seconds, then immediately roll in the cinnamon sugar mixture while still hot." },
      { stepNumber: 7, instruction: "Serve at once with the warm thick chocolate in a cup alongside for dipping." },
    ],
  });

  console.log("\n✓ Four Tables — database seeded successfully!");
  console.log("\nRecipes by culture:");
  console.log("  🇮🇹 Italian:  8 recipes");
  console.log("  🇳🇱 Dutch:    7 recipes");
  console.log("  🇩🇪 German:   8 recipes");
  console.log("  🇲🇽 Mexican:  9 recipes");
  console.log("\n  Total: 32 complete recipes with ingredients, steps, and family notes");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });