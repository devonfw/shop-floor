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

echo -e " 
         _      __ _  _    ___                       _     _  __ _   
      __| |___ / _| || |  / _ \ _ __   ___ _ __  ___| |__ (_)/ _| |_ 
     / _\` / __| |_| || |_| | | | '_ \ / _ \ '_ \/ __| '_ \| | |_| __|
    | (_| \__ \  _|__   _| |_| | |_) |  __/ | | \__ \ | | | |  _| |_ 
     \__,_|___/_|    |_|  \___/| .__/ \___|_| |_|___/_| |_|_|_|  \__|
                               |_|                                   
    Version 1.0
"

### Functions
usage()
{
	echo ""
	echo "This is a scripts to delete an app deployed by devonfw templates inside the cluster of DevonFW Openshift Origin."
	echo ""
	echo "This script found all the things about an app created by devonfw templates and delete it. Also, ask about if you let to delete the docker images too."
    echo ""
	echo "Usage:"
	echo "  delete-app [options]"
	echo ""
	echo "Examples:"
	echo "  # Delete App"
	echo "  delete-app"
	echo ""
	echo "  # Delete App using parameters app and project"
	echo "  deploy-app -a mythaistar-java -p mythaistar"
	echo ""
	echo "  # Delete App and the docker images using parameters app and project"
	echo "  deploy-app -a mythaistar-java -p mythaistar -d"
	echo "Options:"
	echo "  -a, --app: Specify the app name to delete. It's the deployment name in openshift (don't include version \",#1\")."
	echo "  -n, --namespace: Specify the project namespace where is the app to delete."
	echo "  -d, --docker-images: Specify true for also delete the docker images too."
	echo "  -h, --help: Show help."
	echo ""
}

#### Main

# Read parameters

while [ "$1" != "" ]; do
    case $1 in
        -a|--app)
			shift
			APP="$1"
			;;
        -n|--namespace)
			shift
			NAMESPACE="$1"
			;;
		-d|--docker-images)
			DELETE_DOCKER='1'
			;;
		-h|--help)
			usage
			exit
			;;
        *) break
    esac
    shift
done

# Draw Logo

echo -e " 
         _      __ _  _    ___                       _     _  __ _   
      __| |___ / _| || |  / _ \ _ __   ___ _ __  ___| |__ (_)/ _| |_ 
     / _\` / __| |_| || |_| | | | '_ \ / _ \ '_ \/ __| '_ \| | |_| __|
    | (_| \__ \  _|__   _| |_| | |_) |  __/ | | \__ \ | | | |  _| |_ 
     \__,_|___/_|    |_|  \___/| .__/ \___|_| |_|___/_| |_|_|_|  \__|
                               |_|                                   
    Version 2.0
"

# 1. Analize parameter app and namespace
if [ -z "$NAMESPACE" ]
then
	echo "Enter the project namespace where is the app to delete."
	read NAMESPACE
fi

if [ -z "$APP" ]
then
	echo "Enter the app name to delete. It's the deployment name in openshift (don't include version \",#1\")."
	read APP
fi

# 2. STARTING OPENSHIFT
echo -e "\nPreparing to use Openshift. Wait a moment.\n"
oc login

echo ""

PERMISSION=$(oc project $NAMESPACE)

echo "$PERMISSION"

if ! [ -z "$PERMISSION" ]
then
	if [[ "$PERMISSION" = "error:"* ]] || [[ "$PERMISSION" = *"command not found"* ]]
	then
		read -n1 -r -p "Press any key to close..." key
		exit
	fi
else
	read -n1 -r -p "Press any key to close..." key
	exit
fi

# 3. DELETE THE APP
echo -e "\nTrying to delete the app $APP located in $NAMESPACE.\n"
DOCKER_IMAGE="$(oc get imagestream --namespace="$NAMESPACE" -l "application=$APP" --no-headers=true | awk '{print $2}')"
oc delete all --namespace="$NAMESPACE" -l "application=$APP"

# 4. DELETE DOCKER IMAGES
echo -e "The app have the following docker images:\n"
docker images "$DOCKER_IMAGE"
if [ -z $DELETE_DOCKER ]
then
    echo -e "\nDo you want to delete this images (y/n)?"
	read REPLY
else
	REPLY="Y"
fi

if [[ $REPLY =~ ^[Yy]$ ]]
then
	echo "Deleting images... Wait a moment."
	# wait 10 seconds untill all oc objects has been deleted and the docker container has been stoped.
	sleep 10
	docker rmi $(docker images "$DOCKER_IMAGE" -a -q)
    echo -e "\nImages have been deleted."
fi


echo -e "\nDelete App finish.\n"
read -n1 -r -p "Press any key to close..." key
