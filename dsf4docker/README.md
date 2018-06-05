# devonfw-shop-floor 4 Docker

This section of the **devonfw shop floor** is composed by 2 strategies integrating **Docker with Devonfw**
## Devonfw CICD Environment

This strategy aims to provide within "no-time" a complete environment of Continuous Integration and Continuous Delivery. Using Docker, all these services could be up and running after some simple steps:
- Reverse-proxy (access to the whole environment)
- Jenkins
- GitLab
- Nexus
- SonarQube
- Portainer
- Jira
- Mattermost
- Crucible
- Tomcat (x2)

As the installation will be perpetrated by using Docker, just the `docker-compose up -d` command should be executed at the directory level of the `docker-compose.yml` file.

## Devonfw Docker Deployment

This strategy will help configuring Devonfw applications to be run with Docker, answering some questions like _do I have to create Dockerfiles?_, _where to put them in my project?_, _how many ports are going to be needed for the app?_ and so on.

This way, 3 containers will be created following the already working **My Thai Star** way:
- app_reverse_proxy (access to client and traffic redirection client-server)
- app_angular (Angular client application built and deployed)
- app_java (Java/OASP4j server application built and deployed)
