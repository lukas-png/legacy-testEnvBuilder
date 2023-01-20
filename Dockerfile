FROM node:19-bullseye
WORKDIR /app
COPY Client.tar.gz ./Client.tar.gz
RUN tar -xf Client.tar.gz && rm Client.tar.gz
RUN npm install
RUN npm install -g typescript
RUN tsc
ENTRYPOINT node index.js

