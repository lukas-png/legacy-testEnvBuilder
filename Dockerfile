FROM node:19-bullseye
WORKDIR /app
COPY Client.tar.gz ./Client.tar.gz
COPY startup.sh ./startup.sh
RUN tar -xf Client.tar.gz && rm Client.tar.gz
RUN npm install
RUN npm install -g typescript
ENTRYPOINT startup.sh && tsc && node index.js

