#!/bin/sh

# JENKINS + NEXUS + GOGS
oc new-project dev --display-name="Tasks - Dev"
oc new-project stage --display-name="Tasks - Stage"
oc new-project cicd --display-name="CI/CD"

oc policy add-role-to-user edit system:serviceaccount:cicd:jenkins -n dev
oc policy add-role-to-user edit system:serviceaccount:cicd:jenkins -n stage

oc process -f cicd-template.yml | oc create -f - -n cicd

# MATTERMOST

# oc create --filename mattermost-openshift/mattermost.yaml # to import the template
# oc create serviceaccount mattermost # our deployment will use this
# oc create secret generic mattermost-database --from-literal=user=mmuser --from-literal=password=mostest
# oc secrets link mattermost mattermost-database # make the secret available to the serviceaccount

# oc new-app mysql-persistent --labels=app=mattermost --param=MYSQL_USER=mmuser --param=MYSQL_PASSWORD=mostest --param=MYSQL_DATABASE=mattermost_test # deployment

# oc import-image docker.io/goern/mattermost:4.1.0 --confirm
# oc tag mattermost:4.1.0 mattermost:latest

# oc new-app mattermost --labels=app=mattermost

# oc expose service/mattermost --labels=app=mattermost --hostname=mattermost.example.com