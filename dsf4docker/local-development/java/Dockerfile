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

# 1. Build
FROM maven:3.6-jdk-8-alpine AS build
WORKDIR /app
COPY . /app
RUN mvn install

# 2. Deploy
FROM java:8
WORKDIR /app
COPY --from=build /app/server/target/artifact-server-bootified.war /app/
ENTRYPOINT ["java","-jar","/app/artifact-server-bootified.war"]
EXPOSE 8080
