FROM node:9.7.1

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

RUN npm run-script flow

RUN npm run-script build

WORKDIR ./dist

CMD ["python", "-m", "SimpleHTTPServer", "8000"]
