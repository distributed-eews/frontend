FROM node
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm install -g next
EXPOSE 3002
CMD ["next", "start", "-p", "3002"]
