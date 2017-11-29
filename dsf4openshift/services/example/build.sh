oc new-project dev --display-name="Tasks - Dev"
oc new-project stage --display-name="Tasks - Stage"

oc policy add-role-to-user edit system:serviceaccount:devonfw:jenkins -n dev
oc policy add-role-to-user edit system:serviceaccount:devonfw:jenkins -n stage

oc new-app jenkins-persistent --param=MEMORY_LIMIT=0.75Gi -e INSTALL_PLUGINS=analysis-core:1.92,findbugs:4.71,pmd:3.49,checkstyle:3.49,dependency-check-jenkins-plugin:2.1.1,htmlpublisher:1.14,jacoco:2.2.1,analysis-collector:1.52 -n devonfw

oc new-app -n devonfw -f cicd-template.yaml --param DEV_PROJECT=dev --param STAGE_PROJECT=stage
