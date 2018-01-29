# Delete App in DevonFW Openshift Origin

This is a scripts to delete an app deployed by devonfw templates inside the cluster of DevonFW Openshift Origin.

## What does the script do?

This script found all the things about an app created by devonfw templates and delete it. Also, ask about if you let to delete the docker images too.

## How to use
<pre>
Usage:
  delete-app [options]

Examples:
  # Delete App
  delete-app

  # Delete App using parameters app and project
  deploy-app -a mythaistar-java -p mythaistar

  # Delete App and the docker images using parameters app and project
  deploy-app -a mythaistar-java -p mythaistar -d
Options:
  -a, --app: Specify the app name to delete. It's the deployment name in openshift (don't include version \",#1\").
  -n, --namespace: Specify the project namespace where is the app to delete.
  -d, --docker-images: Specify true for also delete the docker images too.
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

### My docker have a lot of <none> images... How should the <none> images be deleted?
Daemon API must both be at least 1.25
```
docker image prune -a
```
For old versions of docker:
```
docker rmi $(docker images --filter "dangling=true" -a -q)
```
