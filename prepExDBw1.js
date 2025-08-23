import { Client } from "pg";

// Database connection configuration
const config = {
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "prepExDBw3",
  port: 5432,
};

const client = new Client(config);

async function seedDatabase(client) {
  const CREATE_RECIPES_TABLE = `
    CREATE TABLE IF NOT EXISTS RECIPES (
    recipe_id INT PRIMARY KEY IDENTITY(1,1),
    recipe_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL
)`;

  const CREATE_RECIPE_STEPS = `
    CREATE TABLE IF NOT EXISTS RECIPE_STEPS (
    recipe_id INT NOT NULL,
    step_number INT NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    CONSTRAINT PK_RECIPE_STEPS PRIMARY KEY (recipe_id, step_number),
    FOREIGN KEY (recipe_id) REFERENCES RECIPES(recipe_id) ON DELETE CASCADE
)`;

  const CREATE_INGREDIENTS_TABLE = `
    CREATE TABLE IF NOT EXISTS INGREDIENTS (
    ingredient_id INT PRIMARY KEY IDENTITY(1,1),
    ingredient_name VARCHAR(100) NOT NULL,
)`;

  const CREATE_RECIPE_STEP_INGREDIENTS_TABLE = `
    CREATE TABLE IF NOT EXISTS RECIPE_STEP_INGREDIENTS (
    recipe_id INT NOT NULL,
    step_number INT NOT NULL,
    ingredient_id INT NOT NULL,
    quantity DECIMAL(10,2) NULL,
    unit VARCHAR(20) NULL,
    CONSTRAINT PK_RECIPE_STEP_INGREDIENTS PRIMARY KEY (recipe_id, step_number, ingredient_id),
    CONSTRAINT FK_RECIPE_ID FOREIGN KEY (recipe_id) REFERENCES RECIPE_STEPS(recipe_id) ON DELETE CASCADE,
    CONSTRAINT FK_STEP_NUM FOREIGN KEY (step_number) REFERENCES RECIPE_STEPS(step_number) ON DELETE CASCADE,
    CONSTRAINT FK_INGREDIENTS FOREIGN KEY (ingredient_id) REFERENCES RECIPE_INGREDIENTS(ingredient_id)
)`;

  try {
    await client.connect();
    console.log("Connected to PostgreSQL database!");

    // Create tables
    await client.query(CREATE_RECIPES_TABLE);
    console.log("RECIPES table created successfully");

    await client.query(CREATE_RECIPE_STEPS);
    console.log("RECIPE STEPS table created successfully");

    await client.query(CREATE_INGREDIENTS_TABLE);
    console.log("CREATE_INGREDIENTS table created successfully");

    await client.query(CREATE_RECIPE_STEP_INGREDIENTS_TABLE);
    console.log("CREATE_RECIPE_STEP_INGREDIENTS table created successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.end();
  }
}

seedDatabase(client);
