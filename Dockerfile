FROM node:18.17-slim
RUN ls
RUN cd dist
COPY . .
EXPOSE 3000
CMD ['node', 'main']