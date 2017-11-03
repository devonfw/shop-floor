#!/bin/bash

# Create project to store build base-images
oc new-project oasp --display-name='OASP' --description='Open Application Standard Platfor'

# Create base-images and add them to OASP project
oc create -f https://raw.githubusercontent.com/mickuehl/s2i-oasp/master/s2i/java/s2i-oasp-java-imagestream.json --namespace=oasp
oc create -f https://raw.githubusercontent.com/mickuehl/s2i-oasp/master/s2i/angular/s2i-oasp-angular-imagestream.json --namespace=oasp

# Build base-images in OASP project
oc start-build s2i-oasp-java --namespace=oasp
oc start-build s2i-oasp-angular --namespace=oasp

sleep 30
ret=`oc status -v -n oasp | grep 'running for'`
while [[ !  -z  $ret  ]]; do
    echo "Waiting for build to complete..."
    ret=`oc status -v -n oasp | grep 'running for'`
    sleep 30
done

# Setup the OASP project as "image-puller" to be used in other projects in the same cluster
oc policy add-role-to-group system:image-puller system:authenticated --namespace=oasp