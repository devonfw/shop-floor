export IP=$(hostname -i|cut -f2 -d ' ')
echo $IP
sed -i 's/'$IP'/IP_ADDRESS/g' docker-compose.yml
docker rm -f $(docker ps -a -q)
yes | docker network prune
yes | docker volume prune
rm -rf volumes
sync; echo 3 > /proc/sys/vm/drop_caches
free -h
