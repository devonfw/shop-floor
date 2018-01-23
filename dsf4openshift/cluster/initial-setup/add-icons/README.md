# DevonFW Openshift Origin Add Custom Icons

This is a guide to add custom icons into an Openshift cluster.

# Images Style
The icons for templates, must measure 50px x 50px or the image not show right.

# How to use your custom icons in openshift cluster

## 1. Obtain the master-config.yaml of our openshift cluster.
To modify the icons inside openshift, we must to modify our master-config.yaml of our openshift cluster. This file is inside the openshift container and to obtain a copy of it, we must to know whats the name of our openshift container.

### 1.1. Obtain the name of our openshift container.
To obtain it, we can know it executing the next:
```
$ docker container ls
CONTAINER ID        IMAGE                                           COMMAND                  CREATED             STATUS              PORTS                                     NAMES
83a4e3acda5b        openshift/origin:v3.7.0                         "/usr/bin/openshift …"   6 days ago          Up 6 days                                                     origin
```
Here we can see that the name of the container is origin. Normaly the container it's called as origin.

### 1.2. Copy the master-config.yaml of our openshift container to our directory.
 This file is inside the openshift container in the next directory: /var/lib/origin/openshift.local.config/master/`master-config.yaml` and we can copy it with the next command:
```
$ docker cp origin:/var/lib/origin/openshift.local.config/master/master-config.yaml ./
```
Now we have a file with the configuration of our openshift cluster.

## 2. Create a css
### 2.1. Custom logo for openshift cluster
For this example, we are going to call the css icons.css but you can call as you wish.
Openshift cluster draw their icon by the id header-logo, then we only need to add to our icons.css the next Style Attribute ID
```
#header-logo {
  background-image: url("https://raw.githubusercontent.com/oasp/icons/master/devonfw/devonfw-openshift.png");
  width: 230px;
  height: 40px;
}
```
### 2.2. Custom icons for templates
To use a custom icon to a template openshift use a class name. Then, we need to insert inside our icons.css the next Style Class
```
.devonfw-logo {
  background-image: url("https://raw.githubusercontent.com/oasp/icons/master/devonfw/devonfw.png");
  width: 50px;
  height: 50px;
}
```
To show that custom icon on a template, we only need to write the name of our class in the tag "iconClass" of our template.
```
{
    ...
    "items": [
        {
            ...
            "metadata": {
                ...
                "annotations": {
                    ...
                    "iconClass": "devonfw-logo",
                    ...
                }
            },
            ...
        }
    ]
}
```

## 3. Copy our css inside the openshift container
To use our custom icons, we need to copy our .css inside the openshift container. And this must be inside the next directory /var/lib/origin/openshift.local.config/master/

For example, we are going to copy our icons.css inside a folder called stylesheet, to do that, we can do it with the next command:
```
$ docker cp ./icons.css origin:/var/lib/origin/openshift.local.config/master/stylesheet
```

## 4. Edit and copy the master-config.yaml to use our css.
the master-config.yaml have a section to charge custom styles in Openshift. This is inside the assetConfig and it's called `extensionStylesheets`.

To use our icons.css only need to add the directory route of icons.css in the extensionStylesheets of the master-config.yaml
```
...
assetConfig:
  ...
  extensionStylesheets:
  - /var/lib/origin/openshift.local.config/master/stylesheet/icons.css
  ...
...
```
Now we only need to copy that master-config.yaml inside openshift, and reestart it to load the new configuration. To do that execute the next:
```
$ docker cp ./master-config.yaml origin:/var/lib/origin/openshift.local.config/master/master-config.yaml
```
To re-start openshift do `oc cluster down` and start again your persistent openshift cluster.