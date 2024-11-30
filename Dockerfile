FROM nginx:latest
COPY ./dist/quick-chat-front/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80