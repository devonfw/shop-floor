# Deployment of Devonfw projects

This section of the **Devonfw Shop Floor** offers a "first approach" regarding the deployment of a project composed by 2 different parts (an **Angular** client-side and a **Java** server-side) using **Docker** and **Docker Compose**. Moreover, the approach includes the usage of a **reverse-proxy** to route the traffic between client and server in this way:

![](https://user-images.githubusercontent.com/20857839/36028242-8998f41c-0d9e-11e8-93b3-6bfe50152bf8.png)

````
- my-thai-star/
    + angular/
        + (...)
        - Dockerfile
        + nginx.conf
    + java/
        - Dockerfile
        + mtsj*
    + reverse-proxy/
        - Dockerfile
        - nginx.conf
    + (...)
    - docker-compose.yml
````

In the case of the **Java** part, the `Dockerfile` is "looking for" a folder at its same level called `mtsj`. If yours is different, you'll need to change it [here](https://github.com/devonfw/devonfw-shop-floor/blob/master/dsf4docker/devonfw-deployment/java/Dockerfile#L4), or just leave a `.` in case your project is already at that level.

If the project is configured adding provided files to the correct places, the only thing left to do is to get everything up by running at the `docker-compose.yml` file's level:

`# docker-compose up -d`
