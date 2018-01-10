# Deployment of Devonfw projects

This section of the **Devonfw Shop Floor** offers a "first approach" regarding the deployment of a project composed by 2 different parts (an **Angular** client-side and a **Java** server-side) using **Docker** and **Docker Compose**. More specifically, the project is [**My Thai Star**](http://github.com/oasp/my-thai-star.git), the _blue print_ for Devonfw projects, which is being constantly updated to latest versions.

The project's structure will be as follows:

````
- my-thai-star/
    + angular/
        + (...)
        + default.conf
        - Dockerfile
    + java/
        + mtsj*
        - Dockerfile
    + (...)
    - docker-compose.yml
````

In the case of the **Java** part, the `Dockerfile` is "looking for" a folder at its same level called `mtsj`. If yours is different, you'll need to change it [here](), or just leave a `.` in case your project is already at that level.

If the project is configured adding provided files to the correct places, the only thing left to do is to get everything up by running at the `docker-compose.yml` file's level:

`# docker-compose up -d`