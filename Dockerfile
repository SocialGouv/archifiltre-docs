FROM node as dev

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install


COPY cdn.txt .
RUN wget -P static/cdn -i cdn.txt



COPY . .

RUN npm run-script buildDev

FROM dev as prod

WORKDIR /usr/src/app

RUN bin/toggleDevComment.sh src/app.js > tmp && cat tmp > src/app.js
RUN bin/toggleDevComment.sh static/index.html > tmp && cat tmp > static/index.html


RUN npm run-script buildProd
