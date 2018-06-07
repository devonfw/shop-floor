export IP=$(hostname -i|cut -f2 -d ' ')
echo $IP
sed -i 's/IP_ADDRESS/'$IP'/g' docker-compose.yml
docker-compose up -d
chmod 777 volumes/jenkins/jenkins_home
chmod 777 volumes/nexus/nexus-data
chmod 777 volumes/jira/data
chown -R 2000:2000 ./volumes/mattermost/app/
