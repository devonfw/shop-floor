#/bin/bash

oc cluster up --host-data-dir=/cluster/volumes

oc login -u system:admin

oc adm policy add-cluster-role-to-user cluster-admin system