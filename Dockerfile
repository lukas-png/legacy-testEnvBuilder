FROM node:19-bullseye
WORKDIR /app
COPY Client.tar.gz 
RUN tar -xf Client.tar.gz && rm Client.tar.gz
RUN npm install
ENTRYPOINT node index.js

