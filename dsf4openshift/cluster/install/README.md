# Install Openshift Origin

## 1. Pre-requisites
### 1.1. Install docker
https://docs.docker.com/engine/installation/linux/docker-ce/debian/#set-up-the-repository

```
$ sudo groupadd docker
$ sudo usermod -aG docker $USER
```
### 1.2. Download Openshift Origin Cluster
wget https://github.com/openshift/origin/releases/download/v3.7.1/openshift-origin-server-v3.7.1-ab0f056-linux-64bit.tar.gz
```
tar -xvzf openshift-origin-server-v3.7.1-ab0f056-linux-64bit.tar.gz
mv openshift-origin-server-v3.7.1-ab0f056-linux-64bit oc
```
### 1.3. Add oc to path
```
$ export PATH=$PATH:/home/administrador/oc
```

## 2. Install Openshift Cluster
### 2.1. Download docker images for openshift
```
$ oc cluster up
```
### 2.2. Add the insecure registry
Create file /etc/docker/daemon.json with the next content:

{
    "insecure-registries" : [ "172.30.0.0/16" ]
}

## 3. Install Oc Cluster Wrapper
To manage easier the cluster persistent, we are going to use oc cluster wrapper.
```
cd /home/administrador/oc
wget https://raw.githubusercontent.com/openshift-evangelists/oc-cluster-wrapper/master/oc-cluster
```
oc-cluster up devonfw-shop-floor --public-hostname X.X.X.X

### 3.1. Configure iptables
We must to create iptables rules to allow traffic from other machines.

<span style="color:red">The next commands it's to let all traffic, don't do it on a real server.</span>
```diff
- $ iptables -F
- $ iptables -X
- $ iptables -t nat -F
- $ iptables -t nat -X
- $ iptables -t mangle -F
- $ iptables -t mangle -X
- $ iptables -P INPUT ACCEPT
- $ iptables -P OUTPUT ACCEPT
- $ iptables -P FORWARD ACCEPT
```


# How to use Oc Cluster Wrapper
With oc cluster wrapper we could have a different clusters with different context
## Cluster up
```
$ oc-cluster up devonfw-shop-floor --public-hostname X.X.X.X
```
or
```
$ devonfw-shop-floor-up
```
## Cluster down
```
$ oc-cluster down
```
or
```
$ devonfw-shop-floor-down
```
## Use non-persistent cluster
oc cluster up --image openshift/origin --public-hostname X.X.X.X --routing-suffix apps.X.X.X.X.nip.io

