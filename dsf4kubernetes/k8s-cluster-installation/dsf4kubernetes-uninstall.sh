#!/bin/sh

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

# Draw Logo

echo -e " 
         _      __ _  _   _  __     _                          _             
      __| |___ / _| || | | |/ /   _| |__   ___ _ __ _ __   ___| |_ ___  ___  
     / _\` / __| |_| || |_| ' / | | | '_ \ / _ \ '__| '_ \ / _ \ __/ _ \/ __| 
    | (_| \__ \  _|__   _| . \ |_| | |_) |  __/ |  | | | |  __/ ||  __/\__ \ 
     \__,_|___/_|    |_| |_|\_\__,_|_.__/ \___|_|  |_| |_|\___|\__\___||___/ 
    
    Version 2.0
"

# Kill kubectl process
kill -9 $(lsof -i tcp:443 | grep kubectl | cut -d " " -f 4)

# to stop the script if something fail.
set -e

# Uninstall
kubeadm reset

sudo yum remove kubectl

sudo yum remove kubelet

echo -e "\nDeleting file system resources..."

rm -rf /etc/kubernetes*
rm -f /etc/yum.repos.d/kubernetes*
rm -f /etc/sysctl.d/k8s.conf*
rm -f /usr/bin/kubeadm
rm -f /usr/bin/kubectl
rm -f /usr/bin/kubelet
rm -rf $HOME/.kube
rm -rf /etc/systemd/system/kubelet.service.d/
# rm -f /etc/systemd/system/multi-user.target.wants/kubelet.service
# rm -f /usr/lib/systemd/system/kubelet.service

systemctl stop kubepods*.slice
systemctl reset-failed kubelet

echo -e "\nDeleting docker images..."

docker rmi -f $(docker images | grep -E 'gcr|quay.io|docker.io' | awk '{print $3}')

sed -i '/ swap / s/^#\(.*\)$/\1/g' /etc/fstab
swapon -a

sudo sed -i --follow-symlinks 's/SELINUX=disabled/SELINUX=enforcing/g' /etc/sysconfig/selinux

echo -e "\nTo complete the uninstall process you must reboot your machine."

echo -e "\nTo complete the uninstall process you must reboot your machine."

for i in `seq 1 3`;
do
    read -p "Do you want to reboot now? [y/n]: " response
    case $response in
        [Yy]* ) sudo shutdown -r now; break;;
        [Nn]* ) exit;;
    esac
    case $i in
        "1" ) echo "Incorrect option. Please answer yes or not.";;
        "2" ) echo "You failed to choose the option again. Are you kidding?";;
        "3" ) echo -e "3 failed options. This machine needs to be rebooted. You have to do it yourself. We cannot solve all your problems for you. Hasta la vista baby!\n"
              printf "
                                     ______
                                   <((((((\\\\\\\\\\ 
                                   /      . }\ 
                                   ;--..--._|}
                (\                 '--/\--'  )
                 \\\\\\                | '-'  :'|
                  \\\\\\               . -==- .-|
                   \\\\\\               \.__.'   \--._
                   [\\\\\\          __.--|       //  _/'--.
                   \ \\\\\\       .'-._ ('-----'/ __/      \ 
                    \ \\\\\\     /   __>|      | '--.       |
                     \ \\\\\\   |   \   |     /    /       /
                      \ '\ /     \  |     |  _/       /
                       \  \       \ |     | /        /
                        \  \      \        /         \n\n";;
    esac
done

read -n1 -r -p "Press any key to close..." key
