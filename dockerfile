FROM node:18.17-slim
COPY ./dist .
EXPOSE 3000
CMD ["node", "main"]
