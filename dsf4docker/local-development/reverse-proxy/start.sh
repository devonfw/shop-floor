#!/bin/bash
sed "s|\$BACKEND_ENV|$BACKEND_ENV|g" /etc/nginx/nginx.conf > /etc/nginx/changed && mv /etc/nginx/changed /etc/nginx/nginx.conf
sed "s|\$FRONTEND_ENV|$FRONTEND_ENV|g" /etc/nginx/nginx.conf > /etc/nginx/changed && mv /etc/nginx/changed /etc/nginx/nginx.conf
nginx -g "daemon off;"