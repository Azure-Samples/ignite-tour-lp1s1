FROM node:10.12.0-jessie

COPY . .
RUN npm install
# requires the following env vars:
#
# CONNECTION_STRING (mongodb://localhost:27017)
# DB_NAME (tailwind)
# COLLECTION_NAME (inventory)
# ITEMS_AMOUNT (10000)
# PG_CONNECTION_STRING (optional, script will read from postgres if set)
RUN npm run populate:mongodb
CMD npm start
