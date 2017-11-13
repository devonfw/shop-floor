# Create project to host Devportal applications built from DevonFW's base-images
oc new-project devportal --display-name="Dev Portal" --description="Dev Portal reference application for Devonfw"

# Registering the Private Key with OpenShift to connect to the Private Git Repository
oc secrets new-sshauth repo-at-github --ssh-privatekey=repo-at-github --namespace=devportal

# To mark that the secret can be used by the OpenShift project builder service account run
oc secrets link builder repo-at-github

# Annotating the Secret with the Repository
# oc annotate secret/repo-at-github \
#    'build.openshift.io/source-secret-match-uri-1=ssh://git@ssh.github.com:443/Jorge-Dacal/devonfw-shop-floor.git'

# Create Angular application out of the Angular template
oc new-app --template=devonfw-angular-sample --namespace=devportal --param-file=openshift.env

# Adding the Secret to the Build Configuration
oc set build-secret --source bc/devportal-angular repo-at-github

#sleep 10

# Build Angular application (sets the E.V. in the Angular code)
oc start-build devportal-angular --namespace=devportal