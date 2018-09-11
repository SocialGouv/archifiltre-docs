FROM node:9.7.1 as dev

RUN apt-get update && apt-get -y install \
  inotify-tools=3.14-1+b1 \
  rsync=3.1.1-3+deb8u1


WORKDIR /usr/src/app/patch
COPY patch .
Run make fetchAndPatch



WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install


COPY cdn.txt .
RUN wget -P static/cdn -i cdn.txt



COPY . .

RUN npm run-script buildDev

# CMD ["./startupDev.bash"]


FROM dev as prod

WORKDIR /usr/src/app
RUN npm run-script buildProd


# FROM nginx:1.13.9-alpine
# COPY --from=prod /usr/src/app/dist /usr/share/nginx/html
