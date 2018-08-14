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

# Create an admin user for a Blank Openshift.
echo "Generate an admin to openshift. User is system and password is admin"
# STEP 1: Create a new user
# Sintax
# oc login -u ${name} -p ${password}
# REMEBER also to change it on "step 3" cluster-admin ${name}
oc login -u admin -p admin

# STEP 2: Log with admin credentials
oc login -u system:admin

# STEP 3: Give administrator privileges to the user
# Syntax
# oc adm policy add-cluster-role-to-user cluster-admin ${name}
oc adm policy add-cluster-role-to-user cluster-admin admin

echo -e "\nCluster Initial Setup finish.\n"
read -n1 -r -p "Press any key to close..." key
