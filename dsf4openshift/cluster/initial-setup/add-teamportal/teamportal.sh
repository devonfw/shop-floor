#/bin/bash

# IMPORTANT: To use it, must have on the same directory the following file ssh key in a file named: "devonfw-shop-floor-secret" and you need to hava a devonfw openshift cluster ready

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

if [[ ! -f devonfw-shop-floor-secret ]]; then
    echo -e "Devonfw GitHub Secret with name \"${RED}devonfw-shop-floor-secret${NC}\" not found! Exiting...\n"
    read -n1 -r -p "Press any key to close..." key
    exit 0
fi

if [[ ! -f teamportalparams ]]; then
    echo -e "Parameters to deploy the Team Portal with name "${RED}teamportalparams${NC}" not found! Exiting...\n"
    read -n1 -r -p "Press any key to close..." key
    exit 0
fi

# Create Team Portal using DevonFW Angular template
## Registering the Private Key with OpenShift to connect to the Private Git Repository
oc secrets new-sshauth devonfw-shop-floor-secret --ssh-privatekey=devonfw-shop-floor-secret --namespace=devonfw

## To mark that the secret can be used by the OpenShift project builder service account run
oc secrets link builder devonfw-shop-floor-secret --namespace=devonfw

## Create Angular application out of the Angular template
### this files are private, to share it, you must enter in Git with a valid user, open the file and press RAW Button to generate a valid token
### remove the %3D%3D at the end of the token
oc new-app --template=devonfw-angular --namespace=devonfw --param-file=teamportalparams

## Adding the Secret to the Build Configuration
oc set build-secret --source bc/teamportal devonfw-shop-floor-secret --namespace=devonfw

sleep 2

## Build Angular application (sets the E.V. in the Angular code)
oc start-build teamportal --namespace=devonfw

# Create a devonfw user with view role to devonfw project
oc login -u devonfw-reader -p devonfw-reader
oc login -u system:admin
oc policy add-role-to-user view devonfw-reader --namespace=devonfw

echo -e "\nCluster Initial Setup finish.\n"
read -n1 -r -p "Press any key to close..." key