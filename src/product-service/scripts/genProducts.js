const { MongoClient } = require("mongodb");
const { Client: PgClient } = require("pg");
const toCamelCase = require("to-camel-case");
const dataMaker = require("./dataMaker");

const url = process.env.CONNECTION_STRING || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "tailwind";
const collectionName = process.env.COLLECTION_NAME || "inventory";
const numberOfItems = process.env.ITEMS_AMOUNT || 10000;

async function insert() {
  let items = [];
  if (process.env.PG_CONNECTION_STRING) {
    console.log("PG connection string detected, reading from Postgres");
    const pg = new PgClient({
      connectionString: process.env.PG_CONNECTION_STRING,
      ssl: true
    });

    pg.connect();

    const existing = await pg.query(`
      SELECT 
        products.id, 
        products.name, 
        products.sku, 
        products.price, 
        products.short_description, 
        products.long_description,
        products.digital,
        products.unit_description,
        products.dimensions,
        products.weight_in_pounds,
        products.reorder_amount,
        products.status,
        products.location,
        suppliers.name as supplier_name,
        product_types.name as product_type
      FROM products, suppliers, product_types
      WHERE 
        suppliers.id = products.supplier_id
      AND
        product_types.id = products.product_type_id;
    `);

    items = existing.rows;

    items = items.map(item =>
      Object.keys(item).reduce((acc, key) => {
        acc[toCamelCase(key)] = item[key];
        return acc;
      }, {})
    );

    await pg.end();
  } else {
    console.log("PG connection string not detected, skipping Postgres");
  }

  console.log(
    `received ${items.length} from Postgres, filling in ${numberOfItems -
      items.length} items with randomly generated data`
  );

  items = items.concat(dataMaker(items.length + 1, numberOfItems));

  console.log("starting MongoDB");
  console.log(
    `local: ${url ===
      "mongodb://localhost:27017"} | db: ${dbName} | collection: ${collectionName} | number of items: ${numberOfItems}`
  );
  const client = await MongoClient.connect(
    url,
    { useNewUrlParser: true }
  );
  const db = client.db(dbName);

  const res = await db.collection(collectionName).insertMany(items);

  console.log(`finished insert, inserted ${res.insertedCount} items`);

  await client.close();

  console.log(`closed connection, finished`);
}

try {
  insert();
} catch (e) {
  console.error(e);
}
