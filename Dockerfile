FROM node:12

RUN npm install ws bufferutil utf-8-validate 

CMD [ "node",  "/app/server.js" ]

