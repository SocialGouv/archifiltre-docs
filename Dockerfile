FROM node:12

RUN dpkg --add-architecture i386
RUN apt-get -yq update \
  && apt-get -yq install software-properties-common apt-transport-https zip unzip

RUN wget -nc https://dl.winehq.org/wine-builds/winehq.key \
  && apt-key add winehq.key \
  && apt-add-repository https://dl.winehq.org/wine-builds/debian/ \
  && apt-get -yq update \
  && apt-get -yq install --install-recommends winehq-stable

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn --frozen-lockfile

COPY . .

ENTRYPOINT ["yarn", "buildProd"]