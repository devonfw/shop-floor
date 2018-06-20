# s2i DevonFW

This are the s2i souce and templates to build an s2i images. It provides OpenShift builder images for components of the devonfw (at this momento only for angular and java).

This work is totally based on the implementation of  [Michael Kuehl](https://github.com/Mickuehl) from RedHat for Oasp s2i.

All this information is used as a part of the [initial setup](./../../openshift-cluster-setup/initial-setup) for openshift.

<!--
## Overview

To build the OASP components, OpenShift's [Source-to-Image](https://github.com/openshift/source-to-image) (S2I) functionallity is used. 

Currently there are builder images for

* OASP4J (Java)
* OASP4JS (JavaScript)

In order to get started, additional templates to deploy the [OASP 'My Thai Star'](https://github.com/oasp/my-thai-star) reference application are provided.
-->
## Previous setup

In order to build all of this, it will be necessary, first, to have a running OpenShift cluster. How to install it [here](./../../openshift-cluster-setup/install).

## Usage

Before using the builder images, add them to the OpenShift cluster.

#### Deploy the Source-2-Image builder images

First, create a dedicated `devonfw` project as admin.

    $ oc new-project devonfw --display-name='DevonFW' --description='DevonFW Application Standar Platform'

Now add the builder image configuration and start their build.

    $ oc create -f oc create -f https://raw.githubusercontent.com/devonfw/devonfw-shop-floor/master/dsf4openshift/openshift-devonfw-deployment/s2i/java/s2i-devonfw-java-imagestream.json --namespace=devonfw
    $ oc create -f https://raw.githubusercontent.com/devonfw/devonfw-shop-floor/master/dsf4openshift/openshift-devonfw-deployment/s2i/angular/s2i-devonfw-angular-imagestream.json --namespace=devonfw
    $ oc start-build s2i-devonfw-java --namespace=devonfw
    $ oc start-build s2i-devonfw-angular --namespace=devonfw
    
Make sure other projects can access the builder images:

    $ oc policy add-role-to-group system:image-puller system:authenticated --namespace=devonfw

That's all !

#### Deploy DevonFW templates

Now, it's time to create devonfw templates to use this s2i and add it to the browse catalog. More information:
- [DevonFW templates](./../templates).

#### Build All

Use [this](https://raw.githubusercontent.com/devonfw/devonfw-shop-floor/master/dsf4openshift/openshift-cluster-setup/initial-setup/initial-setup.sh) script to automatically install and build all image streams. The script also creates templates devonfw-angular and devonfw-java inside the project 'openshift' to be used by everyone.

1. Open a bash shell as Administrator
2. Execute shell file: 

`$ /PATH/TO/BUILD/FILE/initial-setup.sh`

### Links & References

This is a list of useful articels etc I found while creating the templates.

* [Template Icons](https://github.com/openshift/openshift-docs/issues/1329)
* [Red Hat Cool Store Microservice Demo](https://github.com/jbossdemocentral/coolstore-microservice)
* [Openshift Web Console Customization](https://docs.openshift.com/container-platform/latest/install_config/web_console_customization.html)