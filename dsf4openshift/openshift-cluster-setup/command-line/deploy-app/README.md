# Deploy App in DevonFW Openshift Origin

This is a scripts to deploy an app inside the cluster of DevonFW Openshift Origin.

## What does the script do?

This script try to create a project (if the project exist, don't worry it's not overwritten) and then, deploy an app with the parameters inside a file in that project. If the project need sshkey, a sshkey file could be used.

## How to use
<pre>
Usage:
  deploy-app [options]

Examples:
  # Deploy App
  deploy-app

  # Deploy App using parameter file route"
  deploy-app -p example-paramfiles/mythaistar-java

  # Deploy App using parameter file and sshkey file route"
  deploy-app -p myapp -ssh sshkey-for-myapp

Options:
  -p, --paramfile: Specify a route for a file whit the parameters to deploy.
  -s, --sshkey: Specify a route for a file with an sshkey.
  -h, --help: Show help.
</pre>

## FAQ
### When I run the script, I receive the following error message:
```diff
- deploy-app.sh: line 2: $'\r': command not found
- deploy-app.sh: line 4: syntax error near unexpected token `$'\r''
```
It is because the script has been edited in windows, and the end line in windows is \r\n but in linux \r don't exist. To solve it execute the next command:
```
sed -i 's/\r$//' filename
```

## How should the parameter file be?

The parameter file must be a list of = pairs.
<pre>
* PROJECT="": It's the name for the namespace into openshift. Spaces aren't allowed.
  PROJECT_DISPLAYNAME="": It's a name to show on views instead of PROJECT.
  DESCRIPTION="": It's a description for the project.
* TYPE="": It could be java or angular.
* APPLICATION_NAME="": It's the name for aplication into openshift. Spaces aren't allowed.
* APPLICATION_GROUP_NAME="": The name for the gropup list of applications. It can't contain whitespace.
* GIT_URI="": Git source URI for application.
* GIT_REF="": Git branch/tag reference.
* CONTEXT_DIR="": The subdirectory where is the code inside the repository.
  SSH_KEY="": If is true, an sshkey file is needed and the deploy-app ask about it to deploy the app.
</pre>
The parameters with an * are required and can't be empty.

For Angular, we have the next extra parameters to link the app with the backend:
<pre>
REST_ENDPOINT_PATTERN="": It's the pattern URL of the backend's REST API endpoint that must be modify by address of Link application.

LINKS_PROJECT="" It's the name of the project where the backend is.  (It's the PROJECT parameter of the backend)

LINKS_APPLICATION_NAME="": It's the name of the backend application inside openshift. (It's the APLICATION_NAME parameter of the backend).
</pre>


### Example for DevonFW Java
 
<pre>
PROJECT="mythaistar"
PROJECT_DISPLAYNAME="My Thai Star"
DESCRIPTION="My Thai Star reference application for DevonFW"
TYPE="java"
APPLICATION_NAME="mythaistar-java"
APPLICATION_GROUP_NAME="My-Thai-Star"
GIT_URI="https://github.com/devonfw/my-thai-star.git"
GIT_REF="develop"
CONTEXT_DIR="/java/mtsj"
SSH_KEY=""
</pre>

### Example for DevonFW Angular
<pre>
PROJECT="mythaistar"
PROJECT_DISPLAYNAME="My Thai Star"
DESCRIPTION="My Thai Star reference application for DevonFW"
TYPE="angular"
APPLICATION_NAME="mythaistar-angular"
APPLICATION_GROUP_NAME="My-Thai-Star"
GIT_URI="https://github.com/devonfw/my-thai-star.git"
GIT_REF="develop"
CONTEXT_DIR="/angular"
REST_ENDPOINT_PATTERN="http://de-mucdevondepl01:9090"
LINKS_PROJECT="mythaistar"
LINKS_APPLICATION_NAME="mythaistar-java"
SSH_KEY_ROUTE=""
</pre>
