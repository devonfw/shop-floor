# Builder Image for DevonFW4J

For work in the openshift cluster, all this files must be public,

In our s2i-devonfw-java-imagestream.json we are using the publics files from ([Mickuehl](https://github.com/mickuehl/s2i-oasp.git)) repository.

#### Environment variables

Application developers can use the following environment variables to configure the runtime behavior of the build process:

NAME        | Description
------------|-------------
CONTEXT_DIR | The directory with in the git repo that contains the source code to build
APP_OPTIONS | Application options. These options will be passed to the Spring Boot command line
ARTIFACT_DIR | The location of the deployable artifacts, rel. to APP_OPTIONS

