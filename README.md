# Devonfw Shop Floor

## 0. Work with this repository

In order to clone submodules alongside this parent repo, let's clone it like this:

`git clone --recursive https://github.com/devonfw/devonfw-shop-floor.git`

## 1. DSF4 Docker

This option is the "fastest" one. Suitable to ramp up a complete **CI/2CD/COMS** environment. That means having all this available in your remote server:

- Jenkins       
    `http://${HOST_IP}:8080`
- Nexus     
    `http://${HOST_IP}:8081/nexus`
- SonarQube     
    `http://${HOST_IP}:8082`
- GitLab        
    `http://${HOST_IP}:8083`
- Mattermost        
    `http://${HOST_IP}:80`

Try running the `dsf4docker.sh` script located in `/devonfw-shop-floor/dsf4docker/`:

```
./dsf4docker.sh
```

Both `docker-compose.yml`(s) are using a `version: "2"` of Docker Compose, so that means a minimum version of Docker (`v1.10.0+`) is mandatory.

If your remote server's OS is _i.e._ **RHEL 6.5**, the maximum version you could install is `v1.7`. There's also a `docker-compose-v1.yml` for those situations located in `/devonfw-shop-floor/dsf4docker/v1/`. There is a practical experience in this repo's Wiki about the [Mirabaud Case](https://github.com/devonfw/devonfw-shop-floor/wiki/mirabaud-cicd-environment-setup).

## 2. DSF4 OpenShift

sds

### Team Portal

## 3. Deploy Devonfw Applications