# /*******************************************************************************
#  * Copyright 2015-2018 Capgemini SE.
#  * 
#  *  Licensed under the Apache License, Version 2.0 (the "License");
#  *  you may not use this file except in compliance with the License.
#  *  You may obtain a copy of the License at
#  * 
#  *      http://www.apache.org/licenses/LICENSE-2.0
#  * 
#  *  Unless required by applicable law or agreed to in writing, software
#  *  distributed under the License is distributed on an "AS IS" BASIS,
#  *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  *  See the License for the specific language governing permissions and
#  *  limitations under the License.
#  ******************************************************************************/

# 1. Build
FROM teracy/angular-cli AS build
WORKDIR /app
COPY . /app
RUN npm i
RUN ng build --prod --build-optimizer

# 2. Deploy
FROM nginx:latest
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      apache2-utils \
 && rm -rf /var/lib/apt/lists/*
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/. /usr/share/nginx/html
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
