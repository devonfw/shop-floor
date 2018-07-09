#!/bin/sh

# Check Docker
echo -e "\nChecking Docker...\n"
docker version
case "$?" in
    "127")
        echo -e "\nDocker is not installed.\nTo install kubernetes docker must be installed."
        # sudo yum install -y docker
        # ;&
        exit 1
        ;;
    "1")
        echo -e "\nDocker is not running.\nTo install kubernetes docker must be running."
        # systemctl enable docker
        # systemctl start docker
        exit 1
        ;;
esac

docker_v=$(docker version | grep "Version:" | awk 'NR==1{print $2}')
# if [ $docker_v == '1.13.1' ]
if [ $docker_v != "1.11.2" ] && [ $docker_v != "1.12.6" ] && [ $docker_v != "1.13.1" ] && [ $docker_v != "17.03.2" ]
then
    echo -e "\nOnly Docker versions 1.11.2, 1.12.6, 1.13.1, and 17.03.2 were validated on Kubernetes 1.8. More information here:"
    echo "https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.8.md/#external-dependencies"
    exit 1
fi

# sudo yum install -y docker
# systemctl enable docker
# systemctl start docker
