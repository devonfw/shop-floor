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
         _      __ _  _    ___                       _     _  __ _   
      __| |___ / _| || |  / _ \ _ __   ___ _ __  ___| |__ (_)/ _| |_ 
     / _\` / __| |_| || |_| | | | '_ \ / _ \ '_ \/ __| '_ \| | |_| __|
    | (_| \__ \  _|__   _| |_| | |_) |  __/ | | \__ \ | | | |  _| |_ 
     \__,_|___/_|    |_|  \___/| .__/ \___|_| |_|___/_| |_|_|_|  \__|
                               |_|                                         
    Version 2.0
"

 # Check for updates
# sudo yum update -y

 # Put SELinux in enforcing mode and targeted type
echo -e "\nChecking SELinux config...\n"
NEED_REBOOT=false
case $(grep "^SELINUX=" /etc/sysconfig/selinux) in
    "SELINUX=disabled" ) sudo sed -i --follow-symlinks 's/SELINUX=disabled/SELINUX=enforcing/g' /etc/sysconfig/selinux;;
    "SELINUX=enforcing" ) ;; # "All ok: SELINUX is enforcing in /etc/sysconfig/selinux"
    "SELINUX=permissive" ) sudo sed -i --follow-symlinks 's/SELINUX=permissive/SELINUX=enforcing/g' /etc/sysconfig/selinux;;
    * ) echo "Error: Security-Enhanced Linux (SELinux) must be enforcing."
        echo "Also, configure SELINUX=enforcing in the /etc/selinux/config file and reboot your machine"
        exit 1;;
esac

 case $(grep "^SELINUXTYPE=" /etc/sysconfig/selinux) in
    "SELINUXTYPE=targeted" ) ;; # "All ok: SELINUXTYPE is targeted in /etc/sysconfig/selinux"
    "SELINUXTYPE=minimum" ) sudo sed -i --follow-symlinks 's/SELINUXTYPE=minimum/SELINUXTYPE=targeted/g' /etc/sysconfig/selinux;;
    "SELINUXTYPE=mls" ) sudo sed -i --follow-symlinks 's/SELINUXTYPE=mls/SELINUXTYPE=targeted/g' /etc/sysconfig/selinux;;
    * ) echo "Error: Security-Enhanced Linux (SELinux) type must be targeted."
        echo "Also, configure SELINUXTYPE=targeted in the /etc/selinux/config file and reboot your machine"
        exit 1;;
esac

 if [ $(sestatus | grep "Loaded policy name:" | awk 'NR==1{print $4}') != "targeted" ]
then
    NEED_REBOOT=true
fi

 case $(getenforce) in
    "Disabled" ) NEED_REBOOT=true;;
    "Enforcing" ) ;; # echo "All ok: SELINUX is enforcing."
    * ) sudo setenforce 1;;
esac

 if [[ $NEED_REBOOT == true ]]
then
    echo -e "\nTo install openshift you must reboot your machine."

     for i in `seq 1 3`;
    do
        read -p "Do you want to reboot now? [y/n]: " response
        case $response in
            [Yy]* ) sudo shutdown -r now;;
            [Nn]* ) exit 1;;
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
                    \  \      \        /         \n\n"
                  exit 1;;
        esac
    done
fi

 # Disable Swap
sudo swapoff -a
sudo sed -i '/ swap / s/^[^#]\(.*\)$/#\/\1/g' /etc/fstab

 # Check Docker
echo -e "\nChecking Docker...\n"
sudo docker version
case "$?" in
    "127")
        echo -e "\nDocker is not installed.\nTo install openshift docker must be installed."
        # sudo yum install -y docker
        # ;&
		exit 1
        ;;
    "1")
        echo -e "\nDocker is not running.\nTo install openshift docker must be running."
        # systemctl enable docker
        # systemctl start docker
		exit 1
        ;;
esac

 docker_v=$(sudo docker version | grep "Version:" | awk 'NR==1{print $2}')
if [[ ${docker_v:0:4} != "1.13" ]]
then
    echo -e "\nOnly Docker versions 1.13 were validated on openshift 3.9."
    exit 1
fi

 if ! sudo [ -w /etc/docker/daemon.json ]
then
    if sudo [ -e /etc/docker/daemon.json ]
    then
        sudo chmod "+x" /etc/docker/daemon.json
    else
        mkdir -p ./etc/docker/
        sudo echo -e "{\n    \"insecure-registries\": [ \"172.30.0.0/16\" ]\n}" >> /etc/docker/daemon.json
    fi
fi

 if [ $(grep -c "insecure-registries" /etc/docker/daemon.json) == 0 ]
then
    if [ $(grep -c "{" /etc/docker/daemon.json) == 0 ]
    then
        sed  -i '1i \{\n    "insecure-registries" : \[ "172.30.0.0\/16" \]    \n}' /etc/docker/daemon.json
    else
        sudo sed -i -r --follow-symlinks 's/\{/\{\n    "insecure-registries" : \[ "172.30.0.0\/16" ]    \n/' /etc/docker/daemon.json
    fi
else
    if [ $(grep -c "172.30.0.0/16" /etc/docker/daemon.json) == 0 ]
    then
        sudo sed -i --follow-symlinks '/"insecure-registries"/ s/\[/\[ "172.30.0.0\/16",/' /etc/docker/daemon.json
    fi
fi

 # Download and install openshift
echo -e "\nDonwloading openshift...\n"
wget https://github.com/openshift/origin/releases/download/v3.9.0/openshift-origin-server-v3.9.0-191fece-linux-64bit.tar.gz
tar -xvzf openshift-origin-server-v3.9.0-191fece-linux-64bit.tar.gz
sudo mv openshift-origin-server-v3.9.0-191fece-linux-64bit /usr/bin/oc
rm openshift-origin-server-v3.9.0-191fece-linux-64bit.tar.gz

 wget https://raw.githubusercontent.com/openshift-evangelists/oc-cluster-wrapper/master/oc-cluster
sudo chmod "+x" oc-cluster
sudo mv ./oc-cluster /usr/bin/oc

 export PATH=$PATH:/usr/bin/oc
sudo echo 'pathmunge /usr/bin/oc' > /etc/profile.d/ree.sh
sudo chmod +x /etc/profile.d/ree.sh

 sudo sed -i --follow-symlinks '/Defaults    secure_path =/s/[ \t]*$//g' /etc/sudoers
sudo sed -i --follow-symlinks '/Defaults    secure_path =/ s/$/:\/usr\/bin\/oc/g' /etc/sudoers

 sudo oc version

 # Openshift Cluster Initial Setup
echo -e "\nOpenshift Cluster Initial Setup...\n"

 export IP=$(hostname -i|cut -f2 -d ' ')

 sudo oc-cluster up dsf-t1 --public-hostname $IP

 # STEP 1: cluster up, login with admin, and obtain the role of the admin to this account.
sudo oc login -u system:admin

 # STEP 2: create the devonFW project and add the s2i base-images.

 ## Create project to store build base-images
sudo oc new-project devonfw --display-name='DevonFW' --description='DevonFW'

 ## Create base-images and add them to DevonFW project
### this files are private, to share it, you must enter in Git with a valid user, open the file and press RAW Button to generate a valid token
sudo oc create -f https://raw.githubusercontent.com/devonfw/devonfw-shop-floor/develop/dsf4openshift/openshift-devonfw-deployment/s2i/java/s2i-devonfw-java-imagestream.json --namespace=devonfw
sudo oc create -f https://raw.githubusercontent.com/devonfw/devonfw-shop-floor/develop/dsf4openshift/openshift-devonfw-deployment/s2i/angular/s2i-devonfw-angular-imagestream.json --namespace=devonfw

 ## Build base-images in DevonFW project
sudo oc start-build s2i-devonfw-java --namespace=devonfw
sudo oc start-build s2i-devonfw-angular --namespace=devonfw

 sleep 30
ret=`sudo oc status -v -n devonfw | grep 'running for'`
while [[ !  -z  $ret  ]]; do
    echo "Waiting for build to complete..."
    ret=`sudo oc status -v -n devonfw | grep 'running for'`
    sleep 30
done

 # STEP 3: Setup the DevonFW project as "image-puller" to be used in other projects in the same cluster
sudo oc policy add-role-to-group system:image-puller system:authenticated --namespace=devonfw

 # STEP 4: Create DevonFW templates into openshift
### if this files are private, to share it, you must enter in Git with a valid user, open the file and press RAW Button to generate a valid token
sudo oc create -f https://raw.githubusercontent.com/devonfw/devonfw-shop-floor/develop/dsf4openshift/openshift-devonfw-deployment/templates/devonfw-java-template.json --namespace=openshift
sudo oc create -f https://raw.githubusercontent.com/devonfw/devonfw-shop-floor/develop/dsf4openshift/openshift-devonfw-deployment/templates/devonfw-angular-template.json --namespace=openshift

 # customizing openshift
echo -e "\nCustomizing openshift...\n"

 sudo oc get configmap/webconsole-config -n openshift-web-console -o yaml | sudo sed '/scriptURLs: \[\]/ s/\[\]/\n       - https:\/\/cdn.rawgit.com\/devonfw\/devonfw-shop-floor\/develop\/dsf4openshift\/openshift-cluster-setup\/initial-setup\/customizeOpenshift\/scripts\/catalog-categories.js/g' | sudo oc apply -f -

 sudo oc get configmap/webconsole-config -n openshift-web-console -o yaml | sudo sed '/stylesheetURLs: \[\]/ s/\[\]/\n       - https:\/\/cdn.rawgit.com\/devonfw\/devonfw-shop-floor\/develop\/dsf4openshift\/openshift-cluster-setup\/initial-setup\/customizeOpenshift\/stylesheet\/icons.css/g' | sudo oc apply -f -

 echo -e "\n\nNow you can acceso to dashboard using the URL:
https://$IP:8443/console"
read -n1 -r -p "Press any key to close..." key 
