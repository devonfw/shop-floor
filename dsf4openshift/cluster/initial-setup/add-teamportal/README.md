# DevonFW Openshift Origin Add Teamportal

This is a scripts to add Teamportal to a DevonFW Openshift.

### using the build.sh

You can use the build.sh file to deploy it in openshift, but make sure that you have the private key for the repository in the same directory and you called it devonfw-shop-floor-secret, and the fileparameter called teamportalparams.

### Step by step

#### Registering the Private Key with OpenShift to connect to the Private Git Repository
```
oc secrets new-sshauth devonfw-shop-floor-secret --ssh-privatekey=devonfw-shop-floor-secret --namespace=devonfw
```

#### To mark that the secret can be used by the OpenShift project builder service account run
```
oc secrets link builder devonfw-shop-floor-secret --namespace=devonfw
```

#### Create Angular application out of the Angular template
```
oc new-app --template=devonfw-angular --namespace=devonfw --param-file=teamportalparams
```

#### Adding the Secret to the Build Configuration
```
oc set build-secret --source bc/teamportal devonfw-shop-floor-secret --namespace=devonfw
```

#### Build Angular application (sets the E.V. in the Angular code)
```
oc start-build teamportal --namespace=devonfw
```

#### Create a devonfw user with view role to devonfw project
```
oc login -u devonfw-reader -p devonfw-reader
oc login -u system:admin
oc policy add-role-to-user view devonfw-reader --namespace=devonfw
```