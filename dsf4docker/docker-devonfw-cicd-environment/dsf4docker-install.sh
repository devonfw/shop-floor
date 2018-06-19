############################################################################
# Copyright 2015-2018 Capgemini SE.
# 
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
# 
#      http://www.apache.org/licenses/LICENSE-2.0
# 
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
############################################################################

export IP=$(hostname -i|cut -f2 -d ' ')
echo $IP
sed -i 's/IP_ADDRESS/'$IP'/g' docker-compose.yml
docker-compose up -d
chmod 777 volumes/jenkins/jenkins_home
chmod 777 volumes/nexus/nexus-data
chmod 777 volumes/jira/data
chown -R 2000:2000 ./volumes/mattermost/app/
