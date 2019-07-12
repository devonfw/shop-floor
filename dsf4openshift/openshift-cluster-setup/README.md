# Devonfw Shop Floor for OpenShift Cluster Setup

## Content

This are a complete documentation to install and configure an Openshift Cluster to be a DevonFW Openshift Cluster.

- Inside the `command-line` folder, here are scripts to manage DevonFW Openshift.
- Inside the `initial-setup` folder, here are all about how to configure an Openshift cluster to be a DevonFW Openshift Cluster.
- Inside the `manual-installation` folder, here are all about how to install and run a persistent Openshift Cluster.

## How to use

 To install a OpenShift v3.9 with a devonfw templates for java and angular use the `dsf4openshift-install.sh`. Also, you can uninstall it using `dsf4openshift-uninstall.sh`

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