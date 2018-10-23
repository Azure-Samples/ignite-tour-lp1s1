FROM node:10.12.0-jessie 

RUN mkdir /frontend
WORKDIR /frontend
COPY . .
RUN npm install http-server -g && npm run-script build
EXPOSE 8080
WORKDIR /frontend/dist
CMD http-server
