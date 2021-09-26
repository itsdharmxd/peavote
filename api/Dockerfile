FROM node:alpine
# ENV PORT 3001
WORKDIR /app
COPY package.json .
# RUN ["yarn"]
COPY . .
# EXPOSE 3001
# USER node
CMD ["yarn", "start"]
