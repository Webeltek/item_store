FROM node:22-slim

ENV PORT=3100
ENV NODE_ENV="production"
ENV ORIGIN_RENDER='https://item-store-wlyi.onrender.com'
ENV ORIGIN_FIREBASE='https://tv-store-2025.web.app'
ENV ORIGIN_FIREBASE2='https://tv-store-2025.firebaseapp.com'
ENV ORIGIN_FIREBASE3='https://webeltek.org'

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 3100

CMD ["npm", "run", "start"]

