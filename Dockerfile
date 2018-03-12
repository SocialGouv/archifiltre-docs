FROM node:9.7.1 as dev

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run-script buildDev

WORKDIR ./dist
CMD ["python", "-m", "SimpleHTTPServer", "8000"]


FROM dev

WORKDIR /usr/src/app
RUN npm run-script buildProd

WORKDIR ./dist
CMD ["python", "-m", "SimpleHTTPServer", "8000"]

# FROM node:9.7.1-alpine
