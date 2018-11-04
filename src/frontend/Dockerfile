FROM node:10.12.0-jessie 

EXPOSE 8080
ENV PRODUCT_SERVICE_BASE_URL http://localhost:8000
ENV INVENTORY_SERVICE_BASE_URL http://localhost:5000

RUN mkdir /frontend
WORKDIR /frontend
COPY package*.json ./
RUN npm install http-server
COPY . .

CMD ./docker-startup.sh