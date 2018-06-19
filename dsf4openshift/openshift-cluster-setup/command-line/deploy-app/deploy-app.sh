# /*******************************************************************************
#  * Copyright 2015-2018 Capgemini SE.
#  * 
#  *  Licensed under the Apache License, Version 2.0 (the "License");
#  *  you may not use this file except in compliance with the License.
#  *  You may obtain a copy of the License at
#  * 
#  *      http://www.apache.org/licenses/LICENSE-2.0
#  * 
#  *  Unless required by applicable law or agreed to in writing, software
#  *  distributed under the License is distributed on an "AS IS" BASIS,
#  *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  *  See the License for the specific language governing permissions and
#  *  limitations under the License.
#  ******************************************************************************/

#/bin/bash

### Functions
usage()
{
	echo ""
	echo "This is a scripts to deploy an app inside the cluster of DevonFW Openshift Origin."
	echo ""
	echo "This script try to create a project (if the project exist, don't worry it's not overwritten) and then, deploy an app with the params inside a file in that project. If the project need sshkey, an sshkey file could be used."
    echo ""
	echo "Usage:"
	echo "  deploy-app [options]"
	echo ""
	echo "Examples:"
	echo "  # Deploy App"
	echo "  deploy-app"
	echo ""
	echo "  # Deploy App using parameter file route"
	echo "  deploy-app -p mythaistar-java"
	echo ""
	echo "  # Deploy App using parameter  file and sshkey file route"
	echo "  deploy-app -p myapp -ssh sshkey-for-myapp"
	echo ""
	echo "Options:"
	echo "  -p, --paramfile: Specify a route for a file whit the parameters to deploy."
	echo "  -s, --sshkey: Specify a route for a file with an sshkey."
	echo "  -h, --help: Show help."
	echo ""
}

#### Main

# Read parameters

while [ "$1" != "" ]; do
    case $1 in
        -p|--paramfile)
			shift
            echo "dolar1: $1"
			FILE="$1"
			;;
        -s|--sshkey)
			shift
			echo "dolar1: $1"
			SSH_KEY_ROUTE="$1"
			;;
		-h|--help)
			usage
			exit
			;;
        *) break
    esac
    shift
done

RED="\033[31m"
BLUE="\033[34m"
NC="\033[0m"

# Draw Logo

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

# 1. Analize parameter file and sshkey file
if [ -z "$FILE" ]
then
	echo 'Enter the path of parameter file that you want to deploy:'
	read FILE
fi

# 1.1 FILE EXIST AND HAVE PERMISSION TO READ IT?
if [ -r "$FILE" ]
then
	sed -i 's/\r$//' "$FILE"
	source "$FILE"
else
	echo -e "\nFile don't exist or you don't have permission to read it.\n"
	read -n1 -r -p "Press any key to close..." key
	exit 0
fi

# 1.2 PARAMS IN FILE
echo ""
echo " * PROJECT=$PROJECT"
echo "   PROJECT_DISPLAYNAME=$PROJECT_DISPLAYNAME"
echo "   DESCRIPTION=$DESCRIPTION"
echo " * TYPE=$TYPE"
echo " * APPLICATION_NAME=$APPLICATION_NAME"
echo " * APPLICATION_GROUP_NAME=$APPLICATION_GROUP_NAME"
echo " * GIT_URI=$GIT_URI"
echo " * GIT_REF=$GIT_REF"
echo " * CONTEXT_DIR=$CONTEXT_DIR"
echo "   SSH_KEY=$SSH_KEY"

# 1.3 IS TYPE CORRECT AND IF IS ANGULAR TAKE THE EXTRA PARAMETERS
if [ "$TYPE" == "angular" ]
then
	echo "   REST_ENDPOINT_PATTERN=$REST_ENDPOINT_PATTERN"
	echo "   LINKS_PROJECT=$LINKS_PROJECT"
	echo "   LINKS_APPLICATION_NAME=$LINKS_APPLICATION_NAME"
elif [ "$TYPE" != "java" ]
then
	echo -e "\nFile contain a bad TYPE parameter. It must be angular or java.\n"
	read -n1 -r -p "Press any key to close..." key
	exit 0
fi

# 1.4 SSH_KEY FILE?
if [ "$SSH_KEY" == "true" ]
then
	# 1.4.1 DIRECTORY OF THE SSH_KEY FILE
	if [ -z "$SSH_KEY_ROUTE" ]
	then
		echo "This repository is private, please enter the path of the SSH_KEY FILE (If isn't private, remove the flag true on the parameter file):"
		read SSH_KEY_ROUTE
	fi
	# 1.4.2 EXIST THE SSH_KEY FILE?
	if ! [ -r "$SSH_KEY_ROUTE" ]
	then
		echo -e "\nthe SSH_KEY_ROUTE file don't exist or you don't have permission to read it.\n"
		read -n1 -r -p "Press any key to close..." key
		exit 0
	fi
fi

# 1.5 ARE REQUIRED PARAMS EMPTY?
if [ -z "$PROJECT" ] || [ -z "$TYPE" ] || [ -z "$APPLICATION_NAME" ] || [ -z "$APPLICATION_GROUP_NAME" ] || [ -z "$GIT_URI" ] || [ -z "$GIT_REF" ] || [ -z "$CONTEXT_DIR" ]
then
	echo -e "\nthe parameters with an * are required and can't be empty.\n"
	read -n1 -r -p "Press any key to close..." key
	exit 0
fi

# 2. STARTING OPENSHIFT
echo -e "\nPreparing to use Openshift. Wait a moment.\n"
oc login

# 2.1 CREATE THE PROYECT FOR THE APP
echo -e "\nTrying to create a new Project $PROJECT.\n"
oc new-project "$PROJECT" --display-name="$PROJECT_DISPLAYNAME" --description="$DESCRIPTION"

# 2.2 PRIVATE REPOSITORY? THEN CREATE THE SECRET AND LINK IT TO BUILDER
if ! [ -z "$SSH_KEY_ROUTE" ]
then
	oc secrets new-sshauth "repo-token-$APPLICATION_NAME" --ssh-privatekey="$SSH_KEY_ROUTE" --namespace="$PROJECT"

	## To mark that the secret can be used by the OpenShift project builder service account run
	oc secrets link builder "repo-token-$APPLICATION_NAME" --namespace="$PROJECT"
fi

# 3. NEW APP

echo -e "\nTrying to create a new App $APPLICATION_NAME.\n"

# 3.1 PREPARE PARAMS

# If CONTEXT_DIR start with '/', its a relative route and Openshift try to complete it automatically, and this parametre is the final of the route, not the complete route. To resolve this, we are going to remove the first character
if [ "${CONTEXT_DIR:0:1}" == "/" ]
then
DIRE="${CONTEXT_DIR:1}"
else
DIRE="$CONTEXT_DIR"
fi
PARAMS="-p APPLICATION_NAME=$APPLICATION_NAME -p APPLICATION_GROUP_NAME=$APPLICATION_GROUP_NAME -p GIT_URI=$GIT_URI -p GIT_REF=$GIT_REF -p CONTEXT_DIR=$DIRE"
if ! [ -z "$REST_ENDPOINT_PATTERN" ]
then
	PARAMS="$PARAMS -p REST_ENDPOINT_PATTERN=$REST_ENDPOINT_PATTERN"
fi
if ! [ -z "$LINKS_APPLICATION_NAME" ] && ! [ -z "$LINKS_PROJECT" ]
then
	ROUTE=`oc get routes "$LINKS_APPLICATION_NAME" --no-headers=true --namespace="$LINKS_PROJECT" | sed -e's/  */ /g' | cut -d" " -f 2`
	if ! [ -z "$ROUTE" ]
	then
		PARAMS="$PARAMS -p REST_ENDPOINT_URL=http://$ROUTE"
	else
		echo -e "\nDon't exist a route for $LINKS_APPLICATION_NAME in $LINKS_PROJECT.\nThe app will be created without endpoint."
		read -n1 -r -p "Press any key to close..." key
	fi
fi

# 3.2 REQUEST NEW APP (IMPORTANT: DON'T PUT $PARAMS WITHIN "", IF DO THAT DON'T WORK)
oc new-app --template="devonfw-$TYPE" --namespace="$PROJECT" $PARAMS

# 3.3 PRIVATE REPOSITORY? THEN LINK THE SECRET TO THE APP
if ! [ -z "$SSH_KEY_ROUTE" ]
then
	echo -e "\nLinking ssh-key to app\n"
	oc set build-secret --source "bc/$APPLICATION_NAME" "repo-token-$APPLICATION_NAME"
	oc start-build "$APPLICATION_NAME"
fi

echo -e "\nDeploy App finish.\n"
read -n1 -r -p "Press any key to close..." key
