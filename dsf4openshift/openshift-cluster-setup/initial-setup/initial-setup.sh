#/bin/bash

############################################################################
# Copyright 2015-2018 Capgemini SE.
# 
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
# 
#      http://www.apache.org/licenses/LICENSE-2.0
# 
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
############################################################################

RED="\033[31m"
BLUE="\033[34m"
NC="\033[0m"

echo -e "${BLUE}
      ____                         __            ____  _
     |  _ \  _____   _____  _ __  / _|_      __ / ___|| |__   ___  _ __
     | | | |/ _ \ \ / / _ \| '_ \| |_\ \ /\ / / \___ \| '_ \ / _ \| '_ \\
     | |_| |  __/\ V / (_) | | | |  _|\ V  V /   ___) | | | | (_) | |_) |
     |____/ \___| \_/ \___/|_| |_|_|   \_/\_/   |____/|_| |_|\___/| .__/
                                                                  |_|
                   _____ _                     __
                  |  ___| | ___   ___  _ __   / _| ___  _ __
                  | |_  | |/ _ \ / _ \| '__| | |_ / _ \| '__|
                  |  _| | | (_) | (_) | |    |  _| (_) | |
                  |_|   |_|\___/ \___/|_|    |_|  \___/|_|

                   ___                   ____  _     _  __ _
                  / _ \ _ __   ___ _ __ / ___|| |__ (_)/ _| |_
                 | | | | '_ \ / _ \ '_ \\___ \| '_ \| | |_| __|
                 | |_| | |_) |  __/ | | |___) | | | | |  _| |_
                  \___/| .__/ \___|_| |_|____/|_| |_|_|_|  \__|
                       |_|
                                    _ _ _
${NC}"

# STEP 1: cluster up, login with admin, and obtain the role of the admin to this account.
# oc cluster up --host-data-dir=/devonfw-shop-floor --host-config-dir=/origin/master-config.yaml
# oc cluster up --host-data-dir=/dsf-openshift --use-existing-config --host-config-dir=/openshift.local.config
echo "Login as admin"
oc login

# STEP 2: create the devonFW project and add the s2i base-images.

## Create project to store build base-images
oc new-project devonfw --display-name='DevonFW' --description='DevonFW'

## Create base-images and add them to DevonFW project
### this files are private, to share it, you must enter in Git with a valid user, open the file and press RAW Button to generate a valid token
oc create -f https://raw.githubusercontent.com/devonfw/devonfw-shop-floor/v1.1/dsf4openshift/openshift-devonfw-deployment/s2i/java/s2i-devonfw-java-imagestream.json --namespace=devonfw
oc create -f https://raw.githubusercontent.com/devonfw/devonfw-shop-floor/v1.1/dsf4openshift/openshift-devonfw-deployment/s2i/angular/s2i-devonfw-angular-imagestream.json --namespace=devonfw

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

# STEP 3: Setup the DevonFW project as "image-puller" to be used in other projects in the same cluster
oc policy add-role-to-group system:image-puller system:authenticated --namespace=devonfw

# STEP 4: Create DevonFW templates into openshift
### if this files are private, to share it, you must enter in Git with a valid user, open the file and press RAW Button to generate a valid token
oc create -f https://raw.githubusercontent.com/devonfw/devonfw-shop-floor/v1.1/dsf4openshift/openshift-devonfw-deployment/templates/devonfw-java-template.json --namespace=openshift
oc create -f https://raw.githubusercontent.com/devonfw/devonfw-shop-floor/v1.1/dsf4openshift/openshift-devonfw-deployment/templates/devonfw-angular-template.json --namespace=openshift

echo -e "\nCluster Initial Setup finish.\n"
read -n1 -r -p "Press any key to close..." key
