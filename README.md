# DEV10: Designing Resilient Cloud Applications

[![Build status](https://dev.azure.com/devrel/Ignite-Tour-LP1S1/_apis/build/status/LP1S1%20Build)](https://dev.azure.com/devrel/Ignite-Tour-LP1S1/_build/latest?definitionId=3)

This session introduces Tailwind Traders and the application that you'll see in other demos in this tour. You'll also learn about how to build resilient cloud applications at global scale that will withstand failures in sections.

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
* Bash (if in WSL, ensure files do not have Windows line endings)

#### Deployment

Change into the `deployment` directory and run `deploy.sh`.

### Azure Front Door

The Azure Front Door portion of the deployment is currently not automated, although the app may be created in additional regions using the above automated script that will serve as multiple backends for the Azure Front Door deployment.


## Learn More / Resources

...


