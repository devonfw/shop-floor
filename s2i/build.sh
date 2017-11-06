#!/bin/bash

# Create project to store build base-images
oc new-project devonfw --display-name='DevonFW' --description='DevonFW'

# Create base-images and add them to DevonFW project
# for this files are private, to share it, you must enter in Git with a valid user and press RAW Button to generate a valid token
oc create -f https://raw.githubusercontent.com/devonfw/devonfw-shop-floor/master/s2i/java/s2i-devonfw-java-imagestream.json?token=AfL84JdanagHUMCYJ3NFr7UxDf4z_xAQks5aCYOBwA%3D%3D --namespace=devonfw
oc create -f https://raw.githubusercontent.com/devonfw/devonfw-shop-floor/master/s2i/angular/s2i-devonfw-angular-imagestream.json?token=AfL84CSy0zE01pC9qdcCkOTO1j4aRkPyks5aCYNUwA%3D%3D --namespace=devonfw

# Build base-images in DevonFW project
oc start-build s2i-devonfw-java --namespace=devonfw
oc start-build s2i-devonfw-angular --namespace=devonfw

sleep 30
ret=`oc status -v -n devonfw | grep 'running for'`
while [[ !  -z  $ret  ]]; do
    echo "Waiting for build to complete..."
    ret=`oc status -v -n devonfw | grep 'running for'`
    sleep 30
done

# Setup the DevonFW project as "image-puller" to be used in other projects in the same cluster
oc policy add-role-to-group system:image-puller system:authenticated --namespace=devonfw