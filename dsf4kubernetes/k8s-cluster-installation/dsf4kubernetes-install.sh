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
 
# Check for updates
# sudo yum update -y

# Disable SeLinux
setenforce 0
sudo sed -i --follow-symlinks 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/sysconfig/selinux
sudo sed -i --follow-symlinks 's/SELINUX=permissive/SELINUX=disabled/g' /etc/sysconfig/selinux

# Disable Swap
swapoff -a
sed -i '/ swap / s/^[^#]\(.*\)$/#\/\1/g' /etc/fstab


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

# Installing kubeadm, kubelet and kubectl

sudo cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF

sudo yum install -y kubelet-1.8.1 kubectl-1.8.1 kubeadm-1.8.1 kubernetes-cni-0.5.1
systemctl daemon-reload
systemctl enable kubelet
systemctl start kubelet


# For correcting the traffic in iptables
sudo cat <<EOF >  /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF

sysctl --system

# Run Kubeadm with specific Kubernetes version with a pod-network in a rage of IP's
export IP=$(hostname -i|cut -f2 -d ' ')
IPrange=${IP%.*}
kubeadm init --pod-network-cidr $IPrange.0/16 --kubernetes-version=v1.9.2

# For using the cluster
mkdir -p $HOME/.kube
sudo cp /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
export KUBECONFIG=/etc/kubernetes/admin.conf

# Master Isolation for deploying in de node master
kubectl taint nodes --all node-role.kubernetes.io/master-

# Pod Network

kubectl apply -f https://docs.projectcalico.org/v3.1/getting-started/kubernetes/installation/hosted/rbac-kdd.yaml
kubectl apply -f https://docs.projectcalico.org/v3.1/getting-started/kubernetes/installation/hosted/kubernetes-datastore/calico-networking/1.7/calico.yaml

# Installed versions
echo -e "\nInstalled versions"

echo -e "\nDocker"
docker version

echo -e "\nKubectl"
kubectl version --short


echo -e "\nInstallation of kubernetes finished with success!"

# Waiting for the kube-dns is running
export dns=$(kubectl get pods --all-namespaces | grep dns)

#while [[ "$dns" = "" ]]
dns_msg=0
while [[ "$dns" != *"Running"* ]]
do
	export dns=$(kubectl get pods --all-namespaces | grep dns)
	if [ $dns_msg -eq 0 ] 
	then
		echo "Wait for the kube-dns POD will be running..."	
		dns_msg=1
	fi
	sleep 5
done

echo -e "\nkube-dns running!"

# Deploying the Dashboard UI AFTER PODS of installation are running (last is DNS)
echo "Deploying Dashboard on Kubernetes..."
sleep 2

# Deploying the Dashboard UI AFTER PODS of installation are running (last is DNS)
# By default, the dashboard will install with minimum user role privileges.
kubectl create -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml

# Setting access the dashboard with full administrative permission using the dashboard-admin.yaml
echo "Deploying dashboard-admin.yaml"

kubectl create -f ./assets/dashboard-admin.yaml

# Run the kubernetes proxy on backgrpund
export IP=$(hostname -i|cut -f2 -d ' ')
#echo $IP

sleep 5

kubectl proxy --address=$IP -p 443 --accept-hosts='^*$' &

sleep 5

echo -e "\n\nNow you can acceso to dashboard using the URL:
http://$IP:443/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/#!/overview?namespace=default"
read -n1 -r -p "Press any key to continue..." key
