# Openshift Cluster

## How to deploy Devportal in openshift

### using the build.sh

You can use the build.sh file to deploy it in openshift, but make sure that you have the private key for the repository in the same directory and you call it repo-at-github.

### Step by step

#### 1. Create project to host Devportal applications built from DevonFW's base-images

    $ oc new-project devportal --display-name="Dev Portal" --description="Dev Portal reference application for Devonfw"

#### 2. Registering the Private Key with OpenShift to connect to the Private Git Repository

    $ oc secrets new-sshauth repo-at-github --ssh-privatekey=repo-at-github --namespace=devportal

#### 3. To mark that the secret can be used by the OpenShift project builder service account run

    $ oc secrets link builder repo-at-github

#### 4. Create Angular application out of the Angular template

    $ oc new-app --template=devonfw-angular-sample --namespace=devportal --param-file=openshift.env

	Note: the first auto-build fail because you don't have add the secret to the build configuration
	
#### 5. Adding the Secret to the Build Configuration

    $ oc set build-secret --source bc/devportal-angular repo-at-github

#### 6. Build Angular application (sets the E.V. in the Angular code)

    $ oc start-build devportal-angular --namespace=devportal