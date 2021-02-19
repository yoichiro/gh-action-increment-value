FROM node:14.14-slim

LABEL "com.github.actions.name"="Automated value increment."
LABEL "com.github.actions.description"="Automated value increment."
LABEL "com.github.actions.icon"="plus"
LABEL "com.github.actions.color"="green"

COPY package*.json ./

RUN apt-get update
RUN apt-get -y install git
RUN npm install

COPY . .

ENTRYPOINT ["node", "/index.js"]
