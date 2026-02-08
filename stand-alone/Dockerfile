FROM node:18-alpine

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

# Create uploads dir and db file
RUN mkdir -p public/uploads
RUN touch helpa.db

EXPOSE 3020
CMD ["node", "server.js"]
