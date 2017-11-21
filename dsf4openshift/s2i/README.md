# DevonFW Source-To-Image (S2I)

This project provides OpenShift builder images for each of the DevonFW ([DevonFW](https://github.com/devonfw)) components.


## Overview

To build the DevonFW components, OpenShift's [Source-to-Image](https://github.com/openshift/source-to-image) (S2I) functionallity is used. 

Currently there are builder images for

* DevonFW4J (Java)
* DevonFW4JS (JavaScript)

In order to get started, additional templates to deploy the [OASP 'My Thai Star'](https://github.com/oasp/my-thai-star) reference application are provided.


## Usage

Before using the builder images, add them to the OpenShift cluster.

#### Deploy the Source-2-Image builder images

First, create a dedicated `devonfw` project.

    oadm new-project devonfw --display-name='DevonFW' --description='DevonFW'

Now add the builder image configuration.
Note: this files are private on github, to share it, you must enter in Git with a valid user, open the file and press RAW Button to generate a valid token

    $ oc create -f https://raw.githubusercontent.com/devonfw/devonfw-shop-floor/master/s2i/java/s2i-devonfw-java-imagestream.json?token= --namespace=devonfw
    $ oc create -f https://raw.githubusercontent.com/devonfw/devonfw-shop-floor/master/s2i/angular/s2i-devonfw-angular-imagestream.json?token= --namespace=devonfw

Then we can start their build

    $ oc start-build s2i-devonfw-java --namespace=devonfw
    $ oc start-build s2i-devonfw-angular --namespace=devonfw
    
Make sure other projects can access the builder images:

    $ oadm policy add-role-to-group system:image-puller system:authenticated --namespace=devonfw

That's all !

#### Build All

Use script `build.sh` to automatically install and build all DevonFW image streams.

<!--- TO DO: Use script `build-mythaistar.sh` to automatically creates a project 'My Thai Star' and deploys the reference application. -->

### Further documentation

* The '[My Thai Star](templates/mythaistar)' reference application templates
* [Source-2-Image](https://github.com/openshift/source-to-image)
* [Open Application Standard Platform](https://github.com/oasp)

### Links & References
 
* This work is based on the ([Mickuehl](https://github.com/mickuehl/s2i-oasp)) OASP work.

This is a list of useful articels etc I found while creating the templates.

* [Template Icons](https://github.com/openshift/openshift-docs/issues/1329)
* [Red Hat Cool Store Microservice Demo](https://github.com/jbossdemocentral/coolstore-microservice)
