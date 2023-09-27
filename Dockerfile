FROM node:18.17-slim
COPY . .
RUN yarn install
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start:prod"]
