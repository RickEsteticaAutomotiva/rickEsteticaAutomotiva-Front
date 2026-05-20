FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .

RUN npm run build -- --mode production

FROM nginx:1.27-alpine AS runtime

# SPA fallback for React Router
RUN printf '%s\n' \
	'server {' \
	'  listen 80;' \
	'  server_name _;' \
	'  root /usr/share/nginx/html;' \
	'  index index.html;' \
	'' \
	'  location / {' \
	'    try_files $uri $uri/ /index.html;' \
	'  }' \
	'}' > /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
