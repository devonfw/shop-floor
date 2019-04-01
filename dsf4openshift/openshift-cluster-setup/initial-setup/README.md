# DevonFW Openshift Origin Initial Setup

This is a scripts to customize an Openshift cluster to be a DevonFW Openshift.

## How to use

#### Prerequisite: Customize Openshift

DevonFw Openshift Origin use custom icons, and we need to add it to openshift. More information:
- [Customize DevonFW Openshift Origin](./customizeOpenshift).

#### Script initial-setup

This script do as follows:
1. Create a project devonfw
2. Build inside devonfw a s2i-devonfw-java and s2i-devonfw-angular images from the template located in [s2i](./../../openshift-devonfw-deployment/s2i) section.
3. Setup the devonfw project as "image-puller" to let their imagenes be used in other projects in the same cluster.
4. Add to namespace openshift a devonfw-java and a devonfw-angular templates located in [templates](./../../openshift-devonfw-deployment/templates) section. This templates are added in the openshift namespace to be used by everyone for build a devonfw application.

## Known issues

### When I run the script, I receive the following error message:
```diff
- deploy-app.sh: line 2: $'\r': command not found
- deploy-app.sh: line 4: syntax error near unexpected token `$'\r''
```
It is because the script has been edited in windows, and the end line in windows is \r\n but in linux \r don't exist. To solve it execute the next command:
```
sed -i 's/\r$//' filename
```

### Failed to push image

If you recive an error like this:
```
error: build error: Failed to push image: After retrying 6 times, Push image still failed due to error: Get http://172.30.1.1:5000/v2/:  dial tcp 172.30.1.1:5000: getsockopt: connection refused
```

It's because the registry isn't working, go to openshift console and enter into the **default** project ```https://x.x.x.x:8443/console/project/default/overview``` and you must see two resources, **docker-registry** and **router** they must be running. If they don't work, try to deploy them and look at the logs what is happen.