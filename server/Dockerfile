FROM node:24-alpine

WORKDIR /app

COPY ./ .

RUN npm install --legacy-peer-deps

EXPOSE 5000

CMD ["npm","run", "dev"]