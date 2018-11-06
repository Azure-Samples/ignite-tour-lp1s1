USER=admin_$RANDOM #set this to whatever you like but it's not something that should be easy
PASS=$(uuidgen) #Again - whatever you like but keep it safe! Better to make it random
LOCATION=westus
STORAGENAME=tailwind$RANDOM #this has to be unique across azure
SKU=Standard_LRS
APPNAME=tailwind-reports

echo "Enter the name of a Resource Group to use. If it doesn't exist, we'll create it."
read RG

echo
echo "...working"
echo

az group create -n $RG -l $LOCATION

echo
echo "Creating Storage Account $STORAGENAME in group $RG"
echo

az storage account create --name $STORAGENAME --location $LOCATION --resource-group $RG --sku $SKU

echo
echo "Done"
echo
echo "Creating Function App $APPNAME in group $RG"
echo

az functionapp create --resource-group $RG --consumption-plan-location $LOCATION \
--name $APPNAME --storage-account $STORAGENAME --runtime node --os-type Linux

# echo "Creating Required App Settings"

# # echo "Creating Required App Settings"

# # az functionapp config appsettings set --name $APPNAME \
# # --resource-group $RG \
# # --settings FUNCTIONS_EXTENSION_VERSION=~2

# echo "Enter SQL Server:"
# read SQL_SERVER

# az functionapp config appsettings set --name $APPNAME \
# --resource-group $RG \
# --settings SERVER=$SQL_SERVER

# echo "SQL Server User Name:"
# read SQL_USERNAME

# az functionapp config appsettings set --name $APPNAME \
# --resource-group $RG \
# --settings USERNAME=$SQL_USERNAME

# echo "SQL Server Password:"
# read SQL_PASSWORD

# az functionapp config appsettings set --name $APPNAME \
# --resource-group $RG \
# --settings PASSWORD=$SQL_PASSWORD

# echo "Database Name:"
# read SQL_DATABASE

# az functionapp config appsettings set --name $APPNAME \
# --resource-group $RG \
# --settings PASSWORD=$SQL_DATABASE

# echo "SendGrid API key:"
# read SENDGRID_API_KEY

# az functionapp config appsettings set --name $APPNAME \
# --resource-group $RG \
# --settings SENDGRID_API_KEY=$SENDGRID_API_KEY

# echo "SendGrid template ID:"
# read SENDGRID_TEMPLATE_ID

# az functionapp config appsettings set --name $APPNAME \
# --resource-group $RG \
# --settings SENDGRID_TEMPLATE_ID=$SENDGRID_TEMPLATE_ID

echo "Deploying Function app to Azure..."
echo

func azure functionapp publish $APPNAME --publish-local-settings