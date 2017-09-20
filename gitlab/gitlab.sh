#!/bin/sh
# oc cluster down
# cd ../../../oc/ && oc cluster up
oc login -u system:admin
oc adm policy add-cluster-role-to-user cluster-admin admin
# oc new-project gitlab
# rm -f openshift-template.json
touch openshift-template.json
content=$(curl -L https://gitlab.com/gitlab-org/omnibus-gitlab/raw/master/docker/openshift-template.json)
echo $content > openshift-template.json
# oc create -f openshift-template.json -n openshift
# rm -f openshift-template.json
# start "https://https://10.0.75.2:8443/"