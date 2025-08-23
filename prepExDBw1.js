import { Client } from "pg";

// Database connection configuration
const config = {
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "prepExDBw1",
  port: 5432,
};

const client = new Client(config);

async function seedDatabase(client) {
  const CREATE_RECIPES_TABLE = `
    CREATE TABLE IF NOT EXISTS RECIPES (
    recipe_id SERIAL PRIMARY KEY,
    recipe_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL
)`;

  const CREATE_RECIPE_STEPS = `
    CREATE TABLE IF NOT EXISTS RECIPE_STEPS (
    recipe_id INT NOT NULL,
    step_number INT NOT NULL,
    step_content TEXT NOT NULL,
    CONSTRAINT PK_RECIPE_STEPS PRIMARY KEY (recipe_id, step_number),
    FOREIGN KEY (recipe_id) REFERENCES RECIPES(recipe_id) ON DELETE CASCADE
)`;

  const CREATE_INGREDIENTS_TABLE = `
    CREATE TABLE IF NOT EXISTS INGREDIENTS (
    ingredient_id SERIAL PRIMARY KEY,
    ingredient_name VARCHAR(100) UNIQUE NOT NULL
)`;

  const CREATE_RECIPE_STEP_INGREDIENTS_TABLE = `
    CREATE TABLE IF NOT EXISTS RECIPE_STEP_INGREDIENTS (
    recipe_id INT NOT NULL,
    step_number INT NOT NULL,
    ingredient_id INT NOT NULL,
    amount DECIMAL(10,2),
    unit VARCHAR(20),
    CONSTRAINT PK_RECIPE_STEP_INGREDIENTS PRIMARY KEY (recipe_id, step_number, ingredient_id),
    CONSTRAINT FK_RECIPE_STEP FOREIGN KEY (recipe_id, step_number) REFERENCES RECIPE_STEPS(recipe_id, step_number) ON DELETE CASCADE,
    CONSTRAINT FK_INGREDIENTS FOREIGN KEY (ingredient_id) REFERENCES INGREDIENTS(ingredient_id) ON DELETE CASCADE
)`;

  try {
    await client.connect();
    console.log("Connected to PostgreSQL database!");
    const recipes = [
      {
        recipe_id: 1,
        recipe_name: "Simple Cheese Pizza",
        category: "Italian",
      },
      {
        recipe_id: 2,
        recipe_name: "Vegan Quinoa Salad",
        category: "Vegetarian",
      },
      {
        recipe_id: 3,
        recipe_name: "Chicken Tikka Masala",
        category: "Indian",
      },
      {
        recipe_id: 4,
        recipe_name: "Keto Avocado Smoothie",
        category: "Keto",
      },
      {
        recipe_id: 5,
        recipe_name: "Chocolate Fudge Cake",
        category: "Dessert, Cake",
      },
    ];

    const recipeSteps = [
      {
        step_number: 1,
        recipe_id: 1,
        step_content: "Preheat oven to 475°F (245°C).",
      },
      {
        step_number: 2,
        recipe_id: 1,
        step_content:
          "Mix flour, yeast, sugar, salt, olive oil, and warm water to form dough.",
      },
      {
        step_number: 3,
        recipe_id: 1,
        step_content: "Roll out dough and spread tomato sauce evenly.",
      },
      {
        step_number: 4,
        recipe_id: 1,
        step_content:
          "Sprinkle cheese on top and bake for 12-15 minutes until crust is golden.",
      },
      {
        step_number: 5,
        recipe_id: 1,
        step_content: "Remove from oven, slice, and serve hot.",
      },
      {
        step_number: 1,
        recipe_id: 2,
        step_content:
          "Rinse quinoa and cook according to package instructions.",
      },
      {
        step_number: 2,
        recipe_id: 2,
        step_content: "Chop cucumber, tomatoes, and red onion finely.",
      },
      {
        step_number: 3,
        recipe_id: 2,
        step_content:
          "Mix cooked quinoa with chopped vegetables and lemon dressing.",
      },
      {
        step_number: 4,
        recipe_id: 2,
        step_content: "Season with salt and pepper to taste.",
      },
      {
        step_number: 5,
        recipe_id: 2,
        step_content: "Chill in refrigerator before serving.",
      },
      {
        step_number: 1,
        recipe_id: 3,
        step_content:
          "Marinate chicken with yogurt and spices for at least 1 hour.",
      },
      {
        step_number: 2,
        recipe_id: 3,
        step_content: "Cook onions and tomatoes with spices to make sauce.",
      },
      {
        step_number: 3,
        recipe_id: 3,
        step_content:
          "Grill or pan-fry marinated chicken until cooked through.",
      },
      {
        step_number: 4,
        recipe_id: 3,
        step_content: "Combine chicken with sauce and simmer for 10 minutes.",
      },
      {
        step_number: 5,
        recipe_id: 3,
        step_content: "Garnish with cilantro and serve with rice or naan.",
      },
      {
        step_number: 1,
        recipe_id: 4,
        step_content:
          "Blend avocado, spinach, almond milk, and protein powder until smooth.",
      },
      {
        step_number: 2,
        recipe_id: 4,
        step_content: "Add ice cubes and blend again for a chilled texture.",
      },
      {
        step_number: 3,
        recipe_id: 4,
        step_content: "Pour into glass and sprinkle chia seeds on top.",
      },
      {
        step_number: 4,
        recipe_id: 4,
        step_content: "Serve immediately for best taste and nutrition.",
      },
      {
        step_number: 5,
        recipe_id: 4,
        step_content: "Optional: add a squeeze of lime for extra flavor.",
      },
      {
        step_number: 1,
        recipe_id: 5,
        step_content: "Preheat oven to 350°F (175°C).",
      },
      {
        step_number: 2,
        recipe_id: 5,
        step_content:
          "Mix cocoa powder, sugar, flour, eggs, and butter to form batter.",
      },
      {
        step_number: 3,
        recipe_id: 5,
        step_content: "Pour batter into greased cake pan.",
      },
      {
        step_number: 4,
        recipe_id: 5,
        step_content:
          "Bake for 30-35 minutes or until a toothpick comes out clean.",
      },
      {
        step_number: 5,
        recipe_id: 5,
        step_content: "Let cool, frost with chocolate fudge icing, and serve.",
      },
    ];

    const recipeIngredients = [
      {
        step_number: 1,
        recipe_id: 2,
        ingredient_id: 1,
        ingredient: "All Purpose Flour",
        amount: 2.5,
        unit: "cups",
      },
      {
        step_number: 2,
        recipe_id: 1,
        ingredient_id: 2,
        ingredient: "Yeast",
        amount: 1,
        unit: "packet",
      },
      {
        step_number: 1,
        recipe_id: 1,
        ingredient_id: 3,
        ingredient: "Sugar",
        amount: 1.5,
        unit: "tsp",
      },
      {
        step_number: 2,
        recipe_id: 1,
        ingredient_id: 4,
        ingredient: "Salt",
        amount: 0.75,
        unit: "tsp",
      },
      {
        step_number: 2,
        recipe_id: 1,
        ingredient_id: 5,
        ingredient: "Olive Oil",
        amount: 2,
        unit: "tbsp",
      },
      {
        step_number: 3,
        recipe_id: 1,
        ingredient_id: 6,
        ingredient: "Tomato Sauce",
        amount: 1,
        unit: "cup",
      },
      {
        step_number: 4,
        recipe_id: 1,
        ingredient_id: 7,
        ingredient: "Cheese",
        amount: 1.25,
        unit: "cups",
      },
      {
        step_number: 1,
        recipe_id: 2,
        ingredient_id: 8,
        ingredient: "Quinoa",
        amount: 1,
        unit: "cup",
      },
      {
        step_number: 2,
        recipe_id: 2,
        ingredient_id: 9,
        ingredient: "Cucumber",
        amount: 0.5,
        unit: "cup",
      },
      {
        step_number: 2,
        recipe_id: 2,
        ingredient_id: 10,
        ingredient: "Tomatoes",
        amount: 0.5,
        unit: "cup",
      },
      {
        step_number: 2,
        recipe_id: 2,
        ingredient_id: 11,
        ingredient: "Red Onion",
        amount: 0.25,
        unit: "cup",
      },
      {
        step_number: 3,
        recipe_id: 2,
        ingredient_id: 12,
        ingredient: "Lemon Juice",
        amount: 2,
        unit: "tbsp",
      },
      {
        step_number: 1,
        recipe_id: 3,
        ingredient_id: 13,
        ingredient: "Chicken",
        amount: 500,
        unit: "g",
      },
      {
        step_number: 1,
        recipe_id: 3,
        ingredient_id: 14,
        ingredient: "Yogurt",
        amount: 0.5,
        unit: "cup",
      },
      {
        step_number: 1,
        recipe_id: 3,
        ingredient_id: 15,
        ingredient: "Garam Masala",
        amount: 2,
        unit: "tsp",
      },
      {
        step_number: 2,
        recipe_id: 3,
        ingredient_id: 16,
        ingredient: "Onion",
        amount: 1,
        unit: "medium",
      },
      {
        step_number: 2,
        recipe_id: 3,
        ingredient_id: 10,
        ingredient: "Tomatoes",
        amount: 2,
        unit: "medium",
      },
      {
        step_number: 1,
        recipe_id: 4,
        ingredient_id: 18,
        ingredient: "Avocado",
        amount: 1,
        unit: "whole",
      },
      {
        step_number: 1,
        recipe_id: 4,
        ingredient_id: 19,
        ingredient: "Spinach",
        amount: 1,
        unit: "cup",
      },
      {
        step_number: 1,
        recipe_id: 4,
        ingredient_id: 20,
        ingredient: "Almond Milk",
        amount: 1,
        unit: "cup",
      },
      {
        step_number: 2,
        recipe_id: 4,
        ingredient_id: 21,
        ingredient: "Protein Powder",
        amount: 1,
        unit: "scoop",
      },
      {
        step_number: 2,
        recipe_id: 5,
        ingredient_id: 22,
        ingredient: "Cocoa Powder",
        amount: 0.75,
        unit: "cup",
      },
      {
        step_number: 2,
        recipe_id: 5,
        ingredient_id: 3,
        ingredient: "Sugar",
        amount: 1.5,
        unit: "cups",
      },
      {
        step_number: 2,
        recipe_id: 5,
        ingredient_id: 24,
        ingredient: "Flour",
        amount: 1.5,
        unit: "cups",
      },
      {
        step_number: 2,
        recipe_id: 5,
        ingredient_id: 17,
        ingredient: "Eggs",
        amount: 3,
        unit: "whole",
      },
      {
        step_number: 2,
        recipe_id: 5,
        ingredient_id: 23,
        ingredient: "Butter",
        amount: 0.5,
        unit: "cup",
      },
    ];

    // Create tables
    await client.query(CREATE_RECIPES_TABLE);
    console.log("RECIPES table created successfully");

    await client.query(CREATE_RECIPE_STEPS);
    console.log("RECIPE STEPS table created successfully");

    await client.query(CREATE_INGREDIENTS_TABLE);
    console.log("CREATE_INGREDIENTS table created successfully");

    await client.query(CREATE_RECIPE_STEP_INGREDIENTS_TABLE);
    console.log("CREATE_RECIPE_STEP_INGREDIENTS table created successfully");

    // Insert recipes into RECIPES table
    for (const recipe of recipes) {
      const insertRecipeQuery = {
        text: "INSERT INTO RECIPES(recipe_id, recipe_name, category) VALUES($1, $2, $3) ON CONFLICT (recipe_id) DO NOTHING",
        values: [recipe.recipe_id, recipe.recipe_name, recipe.category],
      };
      await client.query(insertRecipeQuery);
    }
    console.log("Successfully inserted recipes into RECIPES table");

    // Insert recipe steps
    for (const step of recipeSteps) {
      await client.query(
        "INSERT INTO RECIPE_STEPS (recipe_id, step_number, step_content) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
        [step.recipe_id, step.step_number, step.step_content]
      );
    }
    console.log("Recipe steps inserted successfully!");

    // Insert recipes into INGREDIENTS table
    const uniqueIngredients = [];
    const seenIngredients = new Set();

    for (const item of recipeIngredients) {
      if (!seenIngredients.has(item.ingredient)) {
        seenIngredients.add(item.ingredient);
        uniqueIngredients.push({
          ingredient_id: item.ingredient_id,
          name: item.ingredient,
        });
      }
    }
    for (const ingredient of uniqueIngredients) {
      await client.query(
        "INSERT INTO INGREDIENTS (ingredient_id, ingredient_name) VALUES ($1, $2) ON CONFLICT (ingredient_id) DO NOTHING",
        [ingredient.ingredient_id, ingredient.name]
      );
    }
    console.log("Ingredints inserted successfully!");

    // Insert recipe ingredients into RECIPE_STEP_INGREDIENTS table
    for (const ingredient of recipeIngredients) {
      const insertIngredientQuery = {
        text: `
          INSERT INTO RECIPE_STEP_INGREDIENTS(recipe_id, step_number, ingredient_id, amount, unit)
          VALUES($1, $2, $3, $4, $5)
          ON CONFLICT (recipe_id, step_number, ingredient_id) DO NOTHING
        `,
        values: [
          ingredient.recipe_id,
          ingredient.step_number,
          ingredient.ingredient_id,
          ingredient.amount,
          ingredient.unit,
        ],
      };
      await client.query(insertIngredientQuery);
    }
    console.log(
      "Successfully inserted ingredients into RECIPE_STEP_INGREDIENTS table"
    );

    // Create a view for recipe steps with sugar ingredient
    const CREATE_SUGAR_STEPS_VIEW = `
      CREATE OR REPLACE VIEW sugar_ingredient_steps AS
      SELECT 
        r.recipe_name,
        rs.step_number,
        rs.step_content,
        i.ingredient_name AS ingredient
      FROM 
        RECIPES r
        JOIN RECIPE_STEPS rs ON r.recipe_id = rs.recipe_id
        JOIN RECIPE_STEP_INGREDIENTS rsi ON rs.recipe_id = rsi.recipe_id 
          AND rs.step_number = rsi.step_number
        JOIN INGREDIENTS i ON rsi.ingredient_id = i.ingredient_id
      WHERE 
        i.ingredient_name = 'Sugar';
    `;

    await client.query(CREATE_SUGAR_STEPS_VIEW);
    console.log("Created view 'sugar_ingredient_steps' successfully!");

    // Query the view to verify it works
    const result = await client.query("SELECT * FROM sugar_ingredient_steps");
    console.log("Sugar ingredient steps:", JSON.stringify(result.rows));
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.end();
  }
}

seedDatabase(client);
