#!/bin/bash

adduser devonfw
passwd devonfw
usermod -aG wheel devonfw

# https://get.docker.com/ script can also be used

# Install all updates
yum update -y
# Uninstall old versions
sudo yum remove -y docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine

# Install required packages
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
# set up the docker stable repository
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
# Install docker.
sudo yum install -y docker-ce docker-ce-cli containerd.io

sudo systemctl start docker

# Post install actions
sudo groupadd docker
sudo usermod -aG docker devonfw

sudo systemctl enable docker

# Docker-compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.23.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
# Bash completion
sudo curl -L https://raw.githubusercontent.com/docker/compose/1.23.2/contrib/completion/bash/docker-compose -o /etc/bash_completion.d/docker-compose


# Last step -> open docker connections https://docs.docker.com/install/linux/linux-postinstall/
# https://success.docker.com/article/how-do-i-enable-the-remote-api-for-dockerd


