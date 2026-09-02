import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type DishSeed = { name: string; price: number; description?: string };

const CATEGORIES: { name: string; slug: string; dishes: DishSeed[] }[] = [
  {
    name: "Small Plates",
    slug: "small-plates",
    dishes: [
      { name: "Marinated Olives", price: 7, description: "Mixed Mediterranean olives marinated in citrus, herbs, and olive oil." },
      { name: "Warm Sourdough", price: 6, description: "Freshly baked sourdough served warm with olive oil and sea salt." },
      { name: "Whipped Feta", price: 11, description: "Creamy whipped feta with honey, chili, and toasted pita." },
      { name: "Hummus Asteria", price: 10, description: "Silky hummus finished with olive oil, paprika, and warm pita." },
      { name: "Crispy Halloumi", price: 12, description: "Pan-seared halloumi with lemon, mint, and a drizzle of honey." },
      { name: "Burrata", price: 16, description: "Fresh burrata with heirloom tomatoes, basil pesto, and aged balsamic." },
    ],
  },
  {
    name: "Starters",
    slug: "starters",
    dishes: [
      { name: "Grilled Octopus", price: 22, description: "Tender char-grilled octopus with smoked paprika, capers, and lemon oil." },
      { name: "Seared Scallops", price: 24, description: "Pan-seared scallops with cauliflower purée and brown butter." },
      { name: "Roasted Eggplant", price: 15, description: "Roasted eggplant with tahini, pomegranate, and toasted pine nuts." },
      { name: "Tuna Crudo", price: 21, description: "Yellowfin tuna crudo with citrus, olive oil, and chili." },
      { name: "Asteria Greek Salad", price: 14, description: "Tomatoes, cucumber, feta, and olives with an oregano vinaigrette." },
      { name: "Charred Prawns", price: 19, description: "Charred prawns with garlic, chili, and lemon." },
    ],
  },
  {
    name: "From the Sea",
    slug: "from-the-sea",
    dishes: [
      { name: "Mediterranean Sea Bass", price: 29, description: "Whole roasted sea bass with herbs, citrus, and olive oil." },
      { name: "Grilled Salmon", price: 27, description: "Grilled salmon with a light lemon and herb dressing." },
      { name: "Charred Prawns & Orzo", price: 26, description: "Charred prawns over lemon orzo with fresh herbs." },
      { name: "Grilled Swordfish", price: 28, description: "Grilled swordfish with olive tapenade and roasted vegetables." },
    ],
  },
  {
    name: "From the Grill",
    slug: "from-the-grill",
    dishes: [
      { name: "Asteria Chicken", price: 24, description: "Herb-marinated grilled chicken with a squeeze of lemon." },
      { name: "Lamb Chops", price: 32, description: "Grilled lamb chops with rosemary and garlic." },
      { name: "Beef Tenderloin", price: 38, description: "Grilled beef tenderloin with a red wine jus." },
      { name: "Grilled Ribeye", price: 42, description: "Prime cut ribeye grilled over open flames." },
    ],
  },
  {
    name: "Pasta & Grains",
    slug: "pasta-grains",
    dishes: [
      { name: "Lemon & Herb Orzo", price: 18, description: "Orzo with lemon, fresh herbs, and shaved parmesan." },
      { name: "Wild Mushroom Linguine", price: 21, description: "Linguine with wild mushrooms, garlic, and parmesan." },
      { name: "Prawn Linguine", price: 25, description: "Linguine with prawns, cherry tomatoes, and chili." },
      { name: "Lamb Ragu Pappardelle", price: 24, description: "Hand-cut pappardelle with a slow-cooked lamb ragu." },
    ],
  },
  {
    name: "From the Garden",
    slug: "from-the-garden",
    dishes: [
      { name: "Charred Cauliflower", price: 17, description: "Charred cauliflower with tahini, herbs, and pine nuts." },
      { name: "Grilled Mediterranean Vegetables", price: 16, description: "Seasonal vegetables grilled with olive oil and herbs." },
      { name: "Roasted Vegetable Bowl", price: 19, description: "Roasted seasonal vegetables with grains and a lemon dressing." },
      { name: "Asteria Green Salad", price: 12, description: "Mixed greens with a light herb vinaigrette." },
    ],
  },
  {
    name: "Sides",
    slug: "sides",
    dishes: [
      { name: "Rosemary Potatoes", price: 7, description: "Roasted potatoes with rosemary and sea salt." },
      { name: "Grilled Asparagus", price: 8, description: "Grilled asparagus with lemon and olive oil." },
      { name: "Mediterranean Rice", price: 7, description: "Fragrant rice with herbs and toasted almonds." },
      { name: "Warm Pita", price: 5, description: "Warm pita bread, baked to order." },
      { name: "Tzatziki", price: 5, description: "Cool yogurt dip with cucumber, garlic, and dill." },
    ],
  },
  {
    name: "Desserts",
    slug: "desserts",
    dishes: [
      { name: "Baklava Cheesecake", price: 12, description: "Creamy cheesecake layered with honeyed baklava and pistachio." },
      { name: "Lemon Olive Oil Cake", price: 10, description: "Moist olive oil cake with citrus and mascarpone." },
      { name: "Greek Yogurt Panna Cotta", price: 11, description: "Silky panna cotta with honey and toasted walnuts." },
      { name: "Dark Chocolate Tart", price: 12, description: "Rich dark chocolate tart with a sea salt crust." },
      { name: "Seasonal Fruit", price: 9, description: "A selection of fresh seasonal fruit." },
    ],
  },
  {
    name: "Coffee & Tea",
    slug: "coffee-tea",
    dishes: [
      { name: "Espresso", price: 3 },
      { name: "Double Espresso", price: 4 },
      { name: "Americano", price: 4 },
      { name: "Cappuccino", price: 5 },
      { name: "Flat White", price: 5 },
      { name: "Mint Tea", price: 4 },
      { name: "Mediterranean Herbal Tea", price: 5 },
      { name: "Fresh Lemon & Ginger Tea", price: 5 },
    ],
  },
];

async function main() {
  console.log("Seeding menu categories and dishes...");

  for (let i = 0; i < CATEGORIES.length; i++) {
    const cat = CATEGORIES[i];

    const category = await prisma.menuCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: {
        name: cat.name,
        sortOrder: i,
      },
    });

    for (let j = 0; j < cat.dishes.length; j++) {
      const dish = cat.dishes[j];
      await prisma.dish.create({
        data: {
          categoryId: category.id,
          name: dish.name,
          description: dish.description,
          price: dish.price,
          sortOrder: j,
        },
      });
    }

    console.log(`  ✓ ${cat.name} (${cat.dishes.length} dishes)`);
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });