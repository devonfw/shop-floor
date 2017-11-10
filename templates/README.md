# DevonFW templates

To use this templates with openshift, you can override any parameter values defined in the file by adding the -v option followed by a comma-separated list of <name>=<value> pairs. A parameter reference may appear in any text field inside the template items.

Te parametres that you must override are the followin

    $ oc process -f devonfw-angular-sample \
        -v APPLICATION_NAME=app Name,
		GIT_URI=Git uri,
		GIT_REF=master,
		CONTEXT_DIR=/context
		
The following parametres are opcional

	$ oc process -f my-rails-postgresql \
		APPLICATION_HOSTNAME=Custom hostname for service routes. Leave blank for default hostname, e.g.: <application-name>.<project>.<default-domain-suffix>,
		REST_ENDPOINT_URL=The URL of the backend's REST API endpoint. This can be declarated after,

For example, to deploy Devportal

    $ oc process -f devonfw-angular-sample \
        -v APPLICATION_NAME=devportal-angular,
		GIT_URI=ssh://git@ssh.github.com:443/Jorge-Dacal/devonfw-shop-floor.git,
		GIT_REF=master,
		CONTEXT_DIR=/devportal