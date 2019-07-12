####################################################################################
#   Copyright 2015-2018 Capgemini SE.
#   
#    Licensed under the Apache License, Version 2.0 (the "License");
#    you may not use this file except in compliance with the License.
#    You may obtain a copy of the License at
#   
#        http://www.apache.org/licenses/LICENSE-2.0
#   
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS,
#    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#    See the License for the specific language governing permissions and
#    limitations under the License.
####################################################################################

FROM nginx:latest

LABEL sumary="Reverse proxy for devonfw applications." \
    description="" \
    name="reverse-proxy" \
    version="1.0.0" \
    maintainer="Dario Rodriguez Gonzalez <dario.rodriguez-gonzalez@capgemini.com>" \
    help="For more information visit https://github.com/sclorg/s2i-nodejs-container" \
    usage="docker run -e FRONTEND_ENV=http://frontend:80 -e BACKEND_ENV=http://backend:8080 -p 80:80 -p 443:443 -d reverse-proxy"

COPY nginx.conf /etc/nginx/nginx.conf
COPY start.sh /etc/nginx/start.sh
RUN chmod +x /etc/nginx/start.sh

ENTRYPOINT [ "bash", "/etc/nginx/start.sh" ]
