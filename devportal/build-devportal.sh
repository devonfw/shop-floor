# Create project to host Devportal applications built from OASP's base-images
oc new-project devportal --display-name="Dev Portal" --description="Dev Portal reference application for Devonfw"

# Create Angular templates for Devportal
oc create -f https://raw.githubusercontent.com/Jorge-Dacal/prueba/master/templates/devportal/devonfw-devportal-angular-template.json --namespace=devportal

# Create Angular application out of the Angular template
oc new-app --template=devonfw-devportal-angular-sample --namespace=devportal

#sleep 10

# Build Angular application (sets the E.V. in the Angular code)
oc start-build devportal-angular --namespace=devportal