# Builder Image for DevonFW

TBD

## s2i-devonfw-java-imagestream.json

The template declare all the necessary things to build an image to be used by devonfw-java template and it uses this Dockerfile

### Environment variables

Application developers can use the following environment variables to configure the runtime behavior of the build process:

NAME        | Description
------------|-------------
APP_OPTIONS | Application options. These options will be passed to the Spring Boot command line
ARTIFACT_DIR | The location of the deployable artifacts, rel. to APP_OPTIONS

### How to use

Read the next: [Deploy the Source-2-Image builder images](./../#deploy-the-source-2-image-builder-images).

