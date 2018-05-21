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

echo "Login as normal user to deploy My Thai Star"
oc login

# Create project to host My Thai Star applications built from OASP's base-images
oc new-project mythaistar --display-name='My Thai Star' --description='My Thai Star reference application'

# Create My Thai Star applications for both MTS's Angular client and Java server
oc new-app --template=devonfw-java --namespace=mythaistar --param-file=mythaistar-java
oc new-app --template=devonfw-angular --namespace=mythaistar --param-file=mythaistar-angular

sleep 10
# Setup Environment Variable pointing to Java application's URL
oc set env bc/mythaistar-angular REST_ENDPOINT_URL=http://`oc get routes mythaistar-java --no-headers=true --namespace=mythaistar | sed -e's/  */ /g' | cut -d" " -f 2` --namespace=mythaistar
# Build Angular application (sets the E.V. in the Angular code)
oc start-build mythaistar-angular --namespace=mythaistar
