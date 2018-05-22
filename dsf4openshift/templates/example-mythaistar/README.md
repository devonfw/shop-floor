# The 'My Thai Star' Reference Application

Here we can found an example to deploy My Thai Star application using DevonFW templates.

Files named mythaistar-angular and mythaistar-java are paramfiles to deploy My Thai Star Angular and Java Projects that are located in [Oasp](https://github.com/oasp/my-thai-star) using DevonFW templates for Openshift Origin.

## Usage

#### Previous requirements

We need to deploy s2i builder images. More information:
- [Source-2-Image](https://github.com/oasp/s2i#deploy-the-source-2-image-builder-images).

We need to deploy devonfw templates to use this s2i and add it to the browse catalog. More information:
- [DevonFW templates](./devonfw#how-to-use).

#### Deploy My Thai Star Application

To deploy the [My Thai Star](https://github.com/oasp/my-thai-star) reference application, create a new project:

    $ oc new-project mythaistar --display-name='My Thai Star' --description='My Thai Star reference application'

Create the backend application using the devonfw-java template:

    $ oc new-app --template=devonfw-java --namespace=mythaistar --param-file=mythaistar-java

Create the front-end application using the devonfw-angular template:

    $ oc new-app --template=devonfw-angular --namespace=mythaistar --param-file=mythaistar-angular

Connect the front-end application with the backend:

    $ oc set env bc/mythaistar-angular REST_ENDPOINT_URL=http://`oc get routes mythaistar-java --no-headers=true --namespace=mythaistar | sed -e's/  */ /g' | cut -d" " -f 2` --namespace=mythaistar

Build the front-end application:

    $ oc start-build mythaistar-angular --namespace=mythaistar

#### Build All

Use script `build-mythaistar.sh` to automatically creates a project 'My Thai Star' and deploys the reference application using devonfw-angular and devonfw-java templates.

1. Open a bash shell as Administrator
2. Execute shell file: 

`$ /PATH/TO/BUILD/FILE/build-mythaistar.sh`
