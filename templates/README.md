# DevonFW templates

## How to create templates in openshift

to use this templates in all openshift projects, you should create it in a openshift namespace. To do that, you must log in as an admin.

    $ oc login -u system:admin
    $ oc create -f https://raw.githubusercontent.com/devonfw/devonfw-shop-floor/master/templates/devonfw-angular-template.json?token= --namespace=openshift
	$ oc create -f https://raw.githubusercontent.com/devonfw/devonfw-shop-floor/master/templates/devonfw-java-template.json?token= --namespace=openshift

if you have a problem to load the templates, it could be because this files are private and you are using a bad token, to access, you must enter in Git with a valid user, open the file and press RAW Button to generate a valid token 
	
When it finish, remember to logout as an admin and enter with your normal user.

    $ oc login
	
## How to use templates in openshift

To use this templates with openshift, you can override any parameter values defined in the file by adding the --param-file=openshift.env option.

This file must be a list of <name>=<value> pairs. A parameter reference may appear in any text field inside the template items.

Te parametres that you must override are the followin

    $ cat openshift.env
      APPLICATION_NAME=app Name
	  GIT_URI=Git uri
	  GIT_REF=master
	  CONTEXT_DIR=/context
		
The following parametres are opcional

	$ cat openshift.env
	  APPLICATION_HOSTNAME=Custom hostname for service routes. Leave blank for default hostname, e.g.: <application-name>.<project>.<default-domain-suffix>,
	  REST_ENDPOINT_URL=The URL of the backend's REST API endpoint. This can be declarated after,

For example, to deploy Devportal

    $ cat openshift.env
	  APPLICATION_NAME=devportal-angular
	  GIT_URI=ssh://git@ssh.github.com:443/Jorge-Dacal/devonfw-shop-floor.git
	  GIT_REF=master
	  CONTEXT_DIR=/devportal
    $ oc new-app --template=devonfw-angular-sample --namespace=devportal --param-file=openshift-parameters.env
