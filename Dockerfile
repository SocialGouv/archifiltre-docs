FROM node:9.7.1 as dev

RUN apt-get update && apt-get -y install \
  inotify-tools=3.14-1+b1 \
  rsync=3.1.1-3+deb8u1

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# # Old dev build
# RUN npm run-script buildDev

# WORKDIR ./dist
# CMD ["python", "-m", "SimpleHTTPServer", "8000"]


CMD ["./startupDev.bash"]




FROM dev as prod

WORKDIR /usr/src/app
RUN npm run-script buildProd

CMD ["bash"]


# FROM node:9.7.1-alpine
