import { Client } from "pg";
import { recipes, recipeSteps, recipeIngredients } from "./data.js";

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

    // Create tables
    await client.query(CREATE_RECIPES_TABLE);
    await client.query(CREATE_RECIPE_STEPS);
    await client.query(CREATE_INGREDIENTS_TABLE);
    await client.query(CREATE_RECIPE_STEP_INGREDIENTS_TABLE);

    // Insert recipes into RECIPES table
    for (const recipe of recipes) {
      const insertRecipeQuery = {
        text: "INSERT INTO RECIPES(recipe_id, recipe_name, category) VALUES($1, $2, $3) ON CONFLICT (recipe_id) DO NOTHING",
        values: [recipe.recipe_id, recipe.recipe_name, recipe.category],
      };
      await client.query(insertRecipeQuery);
    }

    // Insert recipe steps
    for (const step of recipeSteps) {
      await client.query(
        "INSERT INTO RECIPE_STEPS (recipe_id, step_number, step_content) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
        [step.recipe_id, step.step_number, step.step_content]
      );
    }

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
    // Query the view to verify it works
    const result = await client.query("SELECT * FROM sugar_ingredient_steps");
    console.log(
      "Sugar ingredient steps:",
      JSON.stringify(result.rows, null, 2)
    );
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.end();
  }
}

seedDatabase(client);
