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
mkdir -p ./volumes/jenkins/jenkins_home
chown 1000:1000 ./volumes/jenkins/jenkins_home

mkdir -p ./volumes/gitlab/etc/gitlab
mkdir -p ./volumes/gitlab/var/log
mkdir -p ./volumes/gitlab/var/opt

mkdir -p ./volumes/jenkins-slave1/jenkins_home

mkdir -p ./volumes/sonarqube/conf
chown 999:999 ./volumes/sonarqube/conf
mkdir -p ./volumes/sonarqube/data
chown 999:999 ./volumes/sonarqube/data
mkdir -p ./volumes/sonarqube/extensions
chown 999:999 ./volumes/sonarqube/extensions
mkdir -p ./volumes/sonarqube/lib/bundled-plugins
chown 999:999 ./volumes/sonarqube/lib/bundled-plugins

mkdir -p ./volumes/sonarqube-db/data
chown 999 ./volumes/sonarqube-db/data

mkdir -p ./volumes/nexus/nexus-data
chown 200 ./volumes/nexus/nexus-data

mkdir -p /volumes/portainer/data

mkdir -p ./volumes/ldap/ssl
chown 101:101 ./volumes/ldap/ssl
mkdir -p ./volumes/ldap/ldap
chown 101:101 ./volumes/ldap/ldap
mkdir -p ./volumes/ldap/libldap
chown 101:101 ./volumes/ldap/libldap
mkdir -p ./volumes/ldap/backups
chown 101:101 ./volumes/ldap/backups
mkdir -p ./volumes/ldap/restore
chown 101:101 ./volumes/ldap/restore

mkdir -p ./volumes/lam/config
chown 33:33 ./volumes/lam/config
mkdir -p ./volumes/lam/data
chown 33:33 ./volumes/lam/data

sed -i 's/IP_ADDRESS/'$IP'/g' docker-compose.yml
#chmod +x images/jenkins-slave/setup-sshd
docker-compose up -d --build
