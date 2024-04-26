FROM node:lts-alpine AS build
WORKDIR /modcampaign
COPY package*.json ./
RUN npm install
COPY . .
# RUN npm run build
RUN npm run generate

FROM nginx:stable-alpine as production-stage
# COPY --from=build /asap-frontend/.nuxt/dist /usr/share/nginx/html
COPY --from=build /asap-frontend/.output/public /usr/share/nginx/html
EXPOSE 3000