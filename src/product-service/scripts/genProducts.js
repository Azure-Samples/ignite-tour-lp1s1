const { MongoClient } = require("mongodb");
const faker = require("faker");

const url = process.env.CONNECTION_STRING || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "tailwind";
const collectionName = process.env.COLLECTION_NAME || "inventory";
const numberOfItems = process.env.ITEMS_AMOUNT || 10000;

async function insert() {
  console.log("starting");
  console.log(
    `local: ${url ===
      "mongodb://localhost:27017"} | db: ${dbName} | collection: ${collectionName} | number of items: ${numberOfItems}`
  );
  const client = await MongoClient.connect(url);
  const db = client.db(dbName);

  const randomizeProp = (obj, fnName, propName, probability) => {
    if (Math.random() < probability) {
      obj[propName] = faker.commerce[fnName]();
    }
  };

  const items = [];

  for (let i = 0; i < numberOfItems; i++) {
    const item = {
      sku: faker.random.uuid(),
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      department: faker.commerce.department()
    };

    randomizeProp(item, "color", "color", 0.75);
    randomizeProp(item, "productMaterial", "material", 0.75);

    items.push(item);
  }

  const res = await db.collection(collectionName).insertMany(items);

  console.log(`finished insert, inserted ${res.insertedCount} items`);

  await client.close();

  console.log(`closed connection, finished`);
}

insert();
