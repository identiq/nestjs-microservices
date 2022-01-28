FROM node:lts-alpine
WORKDIR /app
COPY ./dist/apps/gateway .
COPY prisma ./prisma/
RUN npm install --production
RUN npx prisma generate
CMD node ./main.js