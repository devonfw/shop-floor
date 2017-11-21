#/bin/bash

# IMPORTANT: To use it, must have on the same directory the following file ssh key in a file named: "devonfw-shoop-floor-secret"

# STEP 1: cluster up, login with admin, and obtain the role of the admin to this account.
oc cluster up --host-data-dir=/devonfw-shoop-floor/volumes

oc login -u system:admin

oc adm policy add-cluster-role-to-user cluster-admin system

# STEP 2: create the devonFW project and add the s2i base-images.

## Create project to store build base-images
oc new-project devonfw --display-name='DevonFW' --description='DevonFW'

## Create base-images and add them to DevonFW project
### this files are private, to share it, you must enter in Git with a valid user, open the file and press RAW Button to generate a valid token
oc create -f https://raw.githubusercontent.com/devonfw/devonfw-shop-floor/master/dsf4openshift/s2i/java/s2i-devonfw-java-imagestream.json?token=AfL84NxYi2swO_ePGfBpvZQb9SMcrS45ks5aHVQLwA%3D%3D --namespace=devonfw
oc create -f https://raw.githubusercontent.com/devonfw/devonfw-shop-floor/master/dsf4openshift/s2i/angular/s2i-devonfw-angular-imagestream.json?token=AfL84N4vPBNCrtwUXu4h42ioEFMQrAGmks5aHVPawA%3D%3D --namespace=devonfw

## Build base-images in DevonFW project
oc start-build s2i-devonfw-java --namespace=devonfw
oc start-build s2i-devonfw-angular --namespace=devonfw

sleep 30
ret=`oc status -v -n devonfw | grep 'running for'`
while [[ !  -z  $ret  ]]; do
    echo "Waiting for build to complete..."
    ret=`oc status -v -n devonfw | grep 'running for'`
    sleep 30
done

## Setup the DevonFW project as "image-puller" to be used in other projects in the same cluster
oc policy add-role-to-group system:image-puller system:authenticated --namespace=devonfw

# STEP 3: Create DevonFW templates into openshift
### this files are private, to share it, you must enter in Git with a valid user, open the file and press RAW Button to generate a valid token
oc create -f https://raw.githubusercontent.com/devonfw/devonfw-shop-floor/master/dsf4openshift/templates/devonfw-angular-template.json?token=AfL84DpchImiRjgd2W06WGfiqrDzM2YTks5aHVRwwA%3D%3D --namespace=openshift
oc create -f https://raw.githubusercontent.com/devonfw/devonfw-shop-floor/master/dsf4openshift/templates/devonfw-java-template.json?token=AfL84FN1HqvV7CJIbHoZSbTqAnASLn7yks5aHVRewA%3D%3D --namespace=openshift

# STEP 4: Create Team Portal using DevonFW Angular template
## Registering the Private Key with OpenShift to connect to the Private Git Repository
oc secrets new-sshauth devonfw-shoop-floor-secret --ssh-privatekey=devonfw-shoop-floor-secret --namespace=devonfw

## To mark that the secret can be used by the OpenShift project builder service account run
oc secrets link builder devonfw-shoop-floor-secret

## Create Angular application out of the Angular template
### this files are private, to share it, you must enter in Git with a valid user, open the file and press RAW Button to generate a valid token
oc new-app --template=devonfw-angular --namespace=devonfw --param-file=https://raw.githubusercontent.com/devonfw/devonfw-shop-floor/master/teamportal/openshift/openshift.env?token=AfL84JhgutrLRi7xrB8rh0MRL6nxzsW4ks5aHVFMwA%3D%3D

## Adding the Secret to the Build Configuration
oc set build-secret --source bc/teamportal devonfw-shoop-floor-secret

sleep 2

## Build Angular application (sets the E.V. in the Angular code)
oc start-build teamportal --namespace=devonfw