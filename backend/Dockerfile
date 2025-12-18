FROM node:18 AS build
WORKDIR /app
# Copiar archivos de dependencias
COPY package*.json ./
RUN npm install
# Copiar código fuente
COPY . .
# Argumento para la URL del API (se pasa desde docker-compose)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
# Build de producción con npx
RUN npx ng build
# Etapa 2: Servir con Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
