# Install Openshift Origin

## 1. Pre-requisites
### 1.1. Install docker
https://docs.docker.com/engine/installation/linux/docker-ce/debian/#set-up-the-repository

```
$ sudo groupadd docker
$ sudo usermod -aG docker $USER
```
### 1.2. Download Openshift Origin Client
Download Openshift Origin Client v3.9.0 from [here](https://github.com/openshift/origin/releases/download/v3.9.0/openshift-origin-server-v3.9.0-191fece-linux-64bit.tar.gz)

When the download it's complete, only extract it on the directory that you want, for example `/home/administrador/oc`

**NOTE:** All our work is tested in version 3.9.0, but if the client does not have major changes it is probable that it works in future versions. You can download the latest Openshift Origin Client version from [here](https://www.openshift.org/download.html#oc-platforms), **but it is under your responsability**.

<!-- 
````
wget https://github.com/openshift/origin/releases/download/v3.7.1/openshift-origin-server-v3.7.1-ab0f056-linux-64bit.tar.gz
```
tar -xvzf openshift-origin-server-v3.7.1-ab0f056-linux-64bit.tar.gz
mv openshift-origin-server-v3.7.1-ab0f056-linux-64bit oc
```
-->
### 1.3. Add oc to path
```
$ export PATH=$PATH:/home/administrador/oc
```

## 2. Install Openshift Cluster
### 2.1. Add the insecure registry
Create file ```/etc/docker/daemon.json``` with the next content:
```
{
    "insecure-registries" : [ "172.30.0.0/16" ]
}
```
After editing the config, reload systemd and restart the Docker daemon.
```
$ sudo systemctl daemon-reload
$ sudo systemctl restart docker
```
### 2.2. Download docker images for openshift
```
$ oc cluster up
```

## 3. Install Oc Cluster Wrapper
To manage easier the cluster persistent, we are going to use oc cluster wrapper.
```
cd /home/administrador/oc
wget https://raw.githubusercontent.com/openshift-evangelists/oc-cluster-wrapper/master/oc-cluster
```
When the download it's complete, only move it on the directory that you want, for example `/home/administrador/oc` and remember to add it to the path.

### 3.1 How to use Oc Cluster Wrapper
With oc cluster wrapper we could have a different clusters with different context

#### Create a new persistent cluster

```
$ oc-cluster up name_to_cluster --public-hostname X.X.X.X
```
for example:
```
$ oc-cluster up devonfw-shop-floor --public-hostname X.X.X.X
```

#### Cluster up of a persistent cluster
```
$ oc-cluster up devonfw-shop-floor
```
#### Cluster down
```
$ oc-cluster down
```
#### Use non-persistent cluster
```
oc cluster up --image openshift/origin --public-hostname X.X.X.X --routing-suffix apps.X.X.X.X.nip.io
```

## 4. Configure iptables
It is probably that we must create iptables rules to allow traffic from other machines.

```diff
- The next commands it's to let all traffic, don't do it on a real server.

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
