const Hapi = require("hapi");

// Create a server with a host and port
const server = Hapi.server({
  host: process.env.HOSTNAME || "localhost",
  port: process.env.PORT || 8000
});

const options = {
  reporters: {
    console: [
      {
        module: "good-squeeze",
        name: "Squeeze",
        args: [
          {
            log: "*",
            response: "*"
          }
        ]
      },
      {
        module: "good-console"
      },
      "stdout"
    ]
  }
};

// Add the route
server.route({
  method: "GET",
  path: "/api/products",
  handler: require("./productsGet"),
  options: {
    cors: { origin: ["*"] }
  }
});

server.route({
  method: "GET",
  path: "/api/inventory/{sku}",
  handler: require("./inventoryGet")
});

server.route({
  method: "POST",
  path: "/api/inventory/{sku}",
  handler: require("./inventoryPost")
});

// Start the server
async function start() {
  await server.register({
    plugin: require("good"),
    options
  });
  
  let connectionString;
  if (process.env.KEYVAULT_URI) {
    await server.register({
      plugin: require("./hapi-azure-key-vault"),
      options: {
        id: process.env.KEYVAULT_ID,
        secret: process.env.KEYVAULT_SECRET,
        uri: process.env.KEYVAULT_URI
      }
    });
    const { value: cosmosString } = await server.keyvault.get(
      "Cosmos-Connection-String",
      "2c8997e97ed44a50ae0bd117b0d222f9"
    );
    connectionString = cosmosString;
  } else if (process.env.COSMOSDB_OR_MONGODB_CONNECTION_STRING) {
    const envConnectionString = process.env.COSMOSDB_OR_MONGODB_CONNECTION_STRING;
    const connectionStringParts = envConnectionString.split(/\/?\?/);
    const dbName = process.env.DB_NAME || "tailwind";
    connectionString = `${connectionStringParts[0]}/${dbName}` +
      (connectionStringParts.length > 1 ? `?${connectionStringParts[1]}` : "");
  } else {
    connectionString = "mongodb://localhost:27017/tailwind";
  }

  await server.register({
    plugin: require("hapi-mongodb"),
    options: {
      url: connectionString,
      decorate: true
    }
  });

  try {
    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log("Server running at:", server.info.uri);
}

start();
