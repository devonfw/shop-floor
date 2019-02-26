#!/bin/bash
sed "s|\$BACKEND_ENV|$BACKEND_ENV|g" -i /etc/nginx/nginx.conf
sed "s|\$FRONTEND_ENV|$FRONTEND_ENV|g" -i /etc/nginx/nginx.conf
exec nginx -g "daemon off;"
