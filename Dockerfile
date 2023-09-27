FROM node:18.17-slim
RUN mkdir -p /var/app
WORKDIR /var/app
COPY . .
COPY ../../.env .env
RUN yarn install
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start:prod"]
