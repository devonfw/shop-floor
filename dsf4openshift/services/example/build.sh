oc new-project devonfw-dev --display-name="DevonFW Tasks - Dev"
oc new-project devonfw-stage --display-name="DevonFW Tasks - Stage"

oc policy add-role-to-user edit system:serviceaccount:devonfw:jenkins -n devonfw-dev
oc policy add-role-to-user edit system:serviceaccount:devonfw:jenkins -n devonfw-stage

oc new-app jenkins-persistent --param=MEMORY_LIMIT=0.75Gi -e INSTALL_PLUGINS=analysis-core:1.92,findbugs:4.71,pmd:3.49,checkstyle:3.49,dependency-check-jenkins-plugin:2.1.1,htmlpublisher:1.14,jacoco:2.2.1,analysis-collector:1.52 -n devonfw

oc new-app -n devonfw -f cicd-template.yaml --param DEV_PROJECT=devonfw-dev --param STAGE_PROJECT=devonfw-stage
