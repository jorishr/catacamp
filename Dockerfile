FROM node:12.16.1
ENV NODE_ENV=development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "run", "start" ]
EXPOSE 3000 3001 4000