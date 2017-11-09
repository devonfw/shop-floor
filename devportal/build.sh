# Create project to host Devportal applications built from DevonFW's base-images
oc new-project devportal --display-name="Dev Portal" --description="Dev Portal reference application for Devonfw"

# Create Angular templates for Devportal
oc create -f https://raw.githubusercontent.com/Jorge-Dacal/devonfw-shop-floor/master/devportal/templates/devonfw-devportal-angular-template.json?token=AfL84KuhXDq_rnvSjr8E94rbJyubHAchks5aBYmywA%3D%3D --namespace=devportal

# Create Angular application out of the Angular template
oc new-app --template=devonfw-devportal-angular-sample --namespace=devportal

#sleep 10

# Build Angular application (sets the E.V. in the Angular code)
oc start-build devportal-angular --namespace=devportal