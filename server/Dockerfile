FROM node:22

ENV PORT=3100
ENV NODE_ENV="production"
ENV ORIGIN_RENDER='https://item-store-wlyi.onrender.com'
ENV ORIGIN_FIREBASE='https://tv-store-2025.web.app'
ENV ORIGIN_FIREBASE2='https://tv-store-2025.firebaseapp.com'

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 3100

CMD ["npm", "run", "start"]

