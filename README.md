# MIG10: Migrating web applications to Azure

This session provides the user with three services that work in conjunction together to provide the Tailwind Traders Inventory Web app.  

Each individual service is launched as a Microsoft App Service With Containers.

## Source code

This repo contains these parts of the Tailwind Traders application. 

* Frontend
* Product Service
* Inventory Service
* Report Service

> This is the most up to date version of these services. Other sessions may use this code directly or its derivatives.


## Services Used

* Azure App Service - Web App for Containers
* Azure Key Vault
* Azure SQL Database, Azure Database for PostgreSQL
* Azure Cosmos DB
* Azure Front Door
* Azure Container Registry

  
## Deployment

### Main resources

There is an automated script that will deploy a resource group, plus the Frontend, and Inventory and Product services.

#### Prerequisites

* Azure CLI (logged in and subscription selected)
* Docker on local workstation
* Bash (if in WSL, ensure files do not have Windows line endings)

#### Deployment

### Create a Resource Group

All of the assets that are created should be in the same resource group so that it's easy to reset the demo for a second run and clean up unused resources.

1. Open the [Azure Portal](https://aka.ms/externalportal)
1. Click the "Resource Groups" from the sidebar
1. Click the "+" button
1. Name it "tailwind-migration"

### Create Cosmos DB Database

1. Click the "Create a Resource" item in the sidebar (or "Add" from the newly created Resource Group page if that's where you are)
1. Search for "Cosmos DB"
1. Select the "Cosmos DB" item
1. Name it "nosql-tailwind"
1. Make sure you are adding it to the "tailwind-migration" resource group
1. Select the Mongo DB API
1. Change the location to whichever data center location is _closest_ to where you are delivering the presentation
1. Disable "Multi-region Writes"
1. Click "Next: Network"
1. Create a new Virtual Network
1. Name it "tailwind-vnet"
1. Take all of the defaults and click "Ok"
1. In the first "Key" box enter "Name" and in the "Value" box, enter "nosql-tailwind"
1. Click "Next: Summary"
1. Click "Create"

### Create SQL Server Database

1. Click "SQL databases" in the sidebar
1. Click "Add"
1. Name it "tailwind-sql"
1. Make sure that you are creating it in the "tailwind-migration" resource group
1. Click the "Server" box to create a new server to host this SQL Instance
1. Name it "twt-sql-prod"
1. Set the "Server admin login" to "twtnwprod" and the password to "lkv92oija09lf". These values can be anything, but it helps to have pre-made values that you can just copy in. These databases aren't actually used in the demos.
1. Set the "Location" to the location _closest_ to wherever you are doing this demo.
1. Take the default pricing tier and collation strategies
1. Click "Create"

### Show Azure Cosmos DB Keys and VNet

1. Click on "Cosmos DB" in the portal sidebar
1. Select the "tailwind-northwind" instance from the "Ignite the Tour" subscription
1. Click "Connection Strings" in the sidebar
1. Look at through the connection string properties
1. Click "Firewall and virtual networks" in the sidebar
1. Look at the the current VNet configuration and how it's possible to punch a hole in the firewall to allow another client to access this database

### Show SQL Keys and VNet

1. Click "SQL Servers" in the sidebar and choose the "tailwind-northwind-sqldb" instance from the "Ignite the Tour" subscription.
1. Click "Connection strings" in the sidebar
1. Show different connection strings
1. Click "Overview" in the sidebar
1. Click "Set server firewall" in the top menu bar just above "Server name"

### Create Azure Container Registry

1. Select "Create a resource" in the sidebar
1. Type "container r" and select "Container Registry" from the autocomplete
1. Click "Create"
1. Name it "twtnorthwind"
1. Make sure that the "tailwind-migration" resource group is selected
1. Enable the "Admin user" option
1. Click "Create"
1. Wait for the container registry creation process to finish in the portal
1. From the newly container registry page, copy the "Login server" value by clicking the "copy" icon out to the side
1. Open a local terminal instance
1. Run
   ```
   docker login [Your Login server value here]
   ```
1. Go back to the portal and go to "Access keys" in the sidebar of your container registry
1. Copy the "User name" value
1. Paste that value into the terminal and press enter
1. Copy the "Password" value from the same configuration screen in the portal
1. Paste that value into the terminal and press enter
1. Test the login process again by executing
   ```
   docker login [Your Login server value here]
   ```

### Build Images Locally

1. From the terminal, navigate to the folder where you cloned the MIG10 project files from Github
1. CD to the "src" directory
1. Run an `ls` or `dir` to show people what projects are in this folder
1. CDE to the "product-service" folder
1. From the Azure portal, copy your "Login server" from the container registry "Overview" page
1. Build the image
   ```
   docker build -t [Your login server name]/product-service:latest
   ```
1. Push the image to your container registry

   ```
   docker push [Your login server name].product-service:latest
   ```

1. Repeat this exact same process for both the "inventory-service" as well as the "frontend"

### Create Containers

1. From the Azure Portal, click "Create a resource" and type "web". Select "Web App for Containers" from the autocomplete
1. Name it "product-service"
1. Make sure the subscription is set to "Ignite the Tour"
1. Make sure the Resource Group is "tailwind-migration"
1. Click on the "App Service plan/location" item
1. Click "Create new"
1. Name it "product-service"
1. Select a data center location _closest_ to wherever you are
1. Click "Ok"
1. Click "Configure container"
1. Select "Azure Container Registry"
1. Select "twtnorthwind" from the "Registry" dropdown
1. Select "product-service" from the "Image" dropdown
1. Select "latest" from the "Tag" dropdown
1. Click "Apply"
1. Repeat these steps for both the "inventory-service" and "frontend", swapping out the names appropriately

### Create Envrionment Variables

1. Add SQL Server connection string to inventory-service, go to App Service for inventory-service.  

  * Select "Application Settings." Scroll down to "Connection Strings" and create new connections string with 
  * CONNECTION STRING NAME "InventoryContext", 
  * the VALUE is the full connection string, "Server=tcp:server-example-sqldb.database.windows.net,1433;Initial Catalog=example-example-sqldb;Persist Security Info=False;User ID=example;Password=example;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30" and TYPE "SQLAzure"
1. Save these Settings, move on to product-service App-Service.  
  * Select "Application Settings." Scroll down to "Application setting and create the following APP SETTING NAME and VALUE for your app:
  * DB_CONNECTION_STRING, ```mongodb://example-northwind:Ywk16bEy0yNMdOI4NMqvEVENT1najbzq0Iam6R3SpsDyOL2exE9Yx0UlL4mmOrard8GZrkN2lDkahpuaxBqeEQ==@tailwind-northwind.documents.azure.com:10255/tailwind?ssl=true&replicaSet=globaldb```
  * SEED_DATA, true
1. Save and then create frontend variables, these are the https urls of the product-service and inventory-service.
    * Select "Application Settings." Scroll down to "Application setting and create the following APP SETTING NAME and VALUE for your app:
    * INVENTORY_SERVICE_BASE_URL, https://twt-inventory-api.azurewebsites.net/
    * PRODUCT_SERVICE_BASE_URL, https://twt-product-api.azurewebsites.net/
1. View the application with the URL of the frontend serivce https url, EXAMPLE: https://twt-frontend-prod.azurewebsites.net

### Teardown

Delete the resource group created for this demo.

### Additional resources

#### Azure Front Door

The Azure Front Door portion of the deployment is currently not automated, although the app may be created in additional regions using the above automated script that will serve as multiple backends for the Azure Front Door deployment.

#### Azure Key Vault

Both the Product and Inventory services can pull their secrets from Azure Key Vault. See the READMEs ([Product Service](src/product-service/README.md), [Inventory Service](src/inventory-service/README.md)).


## Learn More / Resources

* [Distribute your data globally with Azure Cosmos DB](https://docs.microsoft.com/learn/modules/distribute-data-globally-with-cosmos-db/?WT.mc_id=MSIgniteTheTour-github-dev10) (Microsoft Learn)
* [Build and store container images with Azure Container Registry](https://docs.microsoft.com/learn/modules/build-and-store-container-images/?WT.mc_id=MSIgniteTheTour-github-dev1) (Microsoft Learn)
* [Host a web application with Azure App service](https://docs.microsoft.com/learn/modules/host-a-web-app-with-azure-app-service/?WT.mc_id=MSIgniteTheTour-github-dev1) (Microsoft Learn)
* [Provision an Azure SQL database to store application data](https://docs.microsoft.com/learn/modules/provision-azure-sql-db/?WT.mc_id=MSIgniteTheTour-github-dev1) (Microsoft Learn)
* [Azure Front Door](https://docs.microsoft.com/azure/frontdoor/?WT.mc_id=MSIgniteTheTour-github-dev1) (Microsoft Docs)
