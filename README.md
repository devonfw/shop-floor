# Devonfw Shop Floor

![](./readme/devonfw-shop-floor-arch.png)

## 1. devonfw-shop-floor 4 Production Line

The **Production Line** part of the devonfw-shop-floor corresponds with a guide of setting up or **prepare your PL instance** to be used by Devonfw projects.

Moreover, 2 Jenkinsfile(s) are provided: one for Angular projects and another one for Java projects.

More info in the **devonfw-shop-floor 4 Production Line** Wiki section.

## 2. devonfw-shop-floor 4 Docker

This option is the "fastest" one. Perfect to ramp up a complete **CI/2CD/COMS** environment in a matter of seconds.

As the environment is based on pure **Docker**, just one command should be executed:

`# docker-compose up`

After the environment installation (Jenkins, Nexus, Mattermost, ...) the integration between them should be done. Follor the Wiki documentation regarding **devon-shop-floor 4 Docker - Service Integration** section for that.

Both `docker-compose.yml`(s) are using a `version: "2"` of Docker Compose, so that means a minimum version of Docker (`v1.10.0+`) is mandatory.

If your remote server's OS is _i.e._ **RHEL 6.5**, the maximum version you could install is `v1.7`. There's also a `docker-compose-v1.yml` for those situations located in `/devonfw-shop-floor/dsf4docker/v1/`. There is a practical experience in this repo's Wiki about the [Mirabaud Case](https://github.com/devonfw/devonfw-shop-floor/wiki/mirabaud-cicd-environment-setup).

More details in the [dsf4docker](https://github.com/devonfw/devonfw-shop-floor/tree/master/dsf4docker) README file.

## 3. devonfw-shop-floor 4 OpenShift

The OpenShift part is a set of resources that allows teams to quickly have:

1. OpenShift cluster up and running
2. Devonfw s2i templates (both for Angular and Java) to build images and run them as containers in OpenShift
3. The `openshift.json` file that should be incorporated in the project's root directory.
4. The **Team Portal** application that will serve as a welcome point for the whole team to access to services and even deploy projects in the cluster.

## 4. Changes in Devonfw projects
