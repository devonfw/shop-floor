# Devonfw Shop Floor

## 1. devonfw-shop-floor 4 Production Line

## 2. devonfw-shop-floor 4 Docker

This option is the "fastest" one. Perfect to ramp up a complete **CI/2CD/COMS** environment in a matter of seconds.


That means having all this available in your remote server:

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

## 3. devonfw-shop-floor 4 OpenShift

//
