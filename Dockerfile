FROM node:25-alpine3.22

LABEL "com.github.actions.name"="Automated value increment."
LABEL "com.github.actions.description"="Automated value increment."
LABEL "com.github.actions.icon"="plus"
LABEL "com.github.actions.color"="green"

RUN apk update && apk add --no-cache git git-lfs

COPY package*.json ./

RUN npm ci --no-cache --prefer-offline --no-audit

COPY ./index.js ./

ENTRYPOINT ["node", "/index.js"]
