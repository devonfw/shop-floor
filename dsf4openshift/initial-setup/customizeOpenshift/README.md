# Customize DevonFW Openshift Origin

This is a guide to customize Openshift cluster. For more informaticon read the next:
 - [Openshift docs customization](https://docs.openshift.com/container-platform/3.5/install_config/web_console_customization.html#loading-custom-scripts-and-stylesheets).

# Index

- [`Images Styles`](./#images-styles).
- [`Quick Use`](./#quick-use).
- [How to add custom `icons` inside openshift](./#how-to-add-custom-icons-inside-openshift).
- [How to add custom `catalog categories` inside openshift](./#how-to-add-custom-catalog-categories-inside-openshift).

# Images Styles
The icons for templates must measure the same as below or the images don't show right:

- `Openshift logo`: 230px x 40px.
- `Template logo`: 50px x 50px.
- `Category logo`: 110px x 36px.

# Quick Use

This is a quick example to add custom icons and categories inside openshift.

To modify the icons inside openshift, we must to modify our master-config.yaml of our openshift cluster. This file is inside the openshift container and to obtain a copy of it, we must to know what's our openshift container name.

## 1. Obtain the master-config.yaml of our openshift cluster

#### 1.1. Obtain the name of our openshift container
To obtain it, we can know it executing the next:
```
$ docker container ls
CONTAINER ID        IMAGE                                           COMMAND                  CREATED             STATUS              PORTS                                     NAMES
83a4e3acda5b        openshift/origin:v3.7.0                         "/usr/bin/openshift …"   6 days ago          Up 6 days                                                     origin
```
Here we can see that the name of the container is origin. Normaly the container it's called as origin.

#### 1.2. Copy the master-config.yaml of our openshift container to our directory
This file is inside the openshift container in the next directory: /var/lib/origin/openshift.local.config/master/`master-config.yaml` and we can copy it with the next command:
```
$ docker cp origin:/var/lib/origin/openshift.local.config/master/master-config.yaml ./
```
Now we have a file with the configuration of our openshift cluster.

## 2. Copy all customize files inside the openshift container
To use our customization of DevonFW Openshift, we need to copy our files inside the openshift container. 

To do this we  need to copy our openshift.local.devonfw inside openshift
container, on the step one we obtain the name of this container, for this example we assume that it's called origin.
```
$ docker cp ./openshift.local.devonfw origin:/var/lib/origin/
```

## 4. Edit and copy the master-config.yaml to use our customize files
The master-config.yaml have a sections to charge our custom files. All this sections are inside the `assetConfig` and their names are the next:

- The custom stylessheets are into `extensionStylesheets`.
- The custom scripts are into `extensionScripts`.
- The custom images are into `extensions`.

To use all our custom elements only need to add the directory routes of each element in their appropriate section of the master-config.yaml
```
...
assetConfig:
  ...
  extensionScripts:
  - /var/lib/origin/openshift.local.devonfw/scripts/catalog-categories.js
  extensionStylesheets:
  - /var/lib/origin/openshift.local.devonfw/stylesheet/icons.css
  extensions:
  - name: images
    sourceDirectory: /var/lib/origin/openshift.local.devonfw/images
  ...
...
```
Now we only need to copy that master-config.yaml inside openshift, and restart it to load the new configuration. To do that execute the next:
```
$ docker cp ./master-config.yaml origin:/var/lib/origin/openshift.local.config/master/master-config.yaml
```
To re-start openshift do `oc cluster down` and start again your persistent openshift cluster.

# How to add Custom Icons inside openshift

This is a guide to add custom icons into an Openshift cluster.

Inside openshift.local.devonfw/stylesheet folder we have the icons.css example to use the devonfw icons.

## 1. Previous steps
- [Obtain master-config.ymal of our openshift cluster](./#1-obtain-the-master-configyaml-of-our-openshift-cluster).

## 2. Create a css
#### 2.1. Custom logo for openshift cluster
For this example, we are going to call the css icons.css but you can call as you wish.
Openshift cluster draw their icon by the id header-logo, then we only need to add to our icons.css the next Style Attribute ID
```
#header-logo {
  background-image: url("https://raw.githubusercontent.com/devonfw/devonfw-shop-floor/master/dsf4openshift/initial-setup/customizeOpenshift/openshift.local.devonfw/images/devonfw-openshift.png);
  width: 230px;
  height: 40px;
}
```
#### 2.2. Custom icons for templates
To use a custom icon to a template openshift use a class name. Then, we need to insert inside our icons.css the next Style Class
```
.devonfw-logo {
  background-image: url("https://raw.githubusercontent.com/devonfw/devonfw-shop-floor/master/dsf4openshift/initial-setup/customizeOpenshift/openshift.local.devonfw/images/devonfw.png");
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
To use our custom icons, we need to copy our `.css` inside the openshift container. And we are going to do it inside the next directory /var/lib/origin/openshift.local.devonfw/

For example, we are going to copy our icons.css inside a folder called stylesheet, to do that, we can do it with the next command:
```
$ docker cp ./icons.css origin:/var/lib/origin/openshift.local.devonfw/stylesheet
```

## 4. Edit and copy the master-config.yaml to use our css.
The master-config.yaml have a section to charge custom styles in Openshift. This is inside the `assetConfig` and it's called `extensionStylesheets`.

To use our icons.css only need to add the directory route of icons.css in the extensionStylesheets of the master-config.yaml
```
...
assetConfig:
  ...
  extensionStylesheets:
  - /var/lib/origin/openshift.local.devonfw/stylesheet/icons.css
  ...
...
```
Now we only need to copy that master-config.yaml inside openshift, and restart it to load the new configuration. To do that execute the next:
```
$ docker cp ./master-config.yaml origin:/var/lib/origin/openshift.local.config/master/master-config.yaml
```
To re-start openshift do `oc cluster down` and start again your persistent openshift cluster.

## 5. Add the images to openshift instead of getting them from the internet
In the last steps we were using the images obtained from the internet. If we want we can add these images to openshift.

First of all we must to copy all the images to Openshift For example, we are going to put all our images into an images folder and we are going to copy it to /var/lib/origin/openshift.local.devonfw/, we can do it with the next command:
```
$ docker cp ./images origin:/var/lib/origin/openshift.local.devonfw/
```

#### 5.1 Edit the master-config.yaml to use static content.
The master-config.yaml have a section to charge custom static content in Openshift. This is inside the `assetConfig` and it's called `extensions`.

To use our images only need to add the directory route of images in the extensions of the master-config.yaml and a name to be used.
```
...
assetConfig:
  ...
  extensions:
  - name: images
    sourceDirectory: /var/lib/origin/openshift.local.devonfw/images
  ...
...
```
Now we can found that files inside openshift and their are on "../context/$extension_name/$image_name" for our example, the files are in "../context/images/$image_name".

Remeber to modify the `.css` to use new sources and copy the that new `.css` and the master-config.yaml inside openshift. Then restart openshift to load the new configuration.

# How to add custom catalog categories inside openshift

This is a guide to add custom `Catalog Categories` into an Openshift cluster.

Inside openshift.local.devonfw/scripts folder we have the catalog-categories.js example to use the devonfw catalog categories.

## 1. Previous steps
- [Obtain master-config.ymal of our openshift cluster](./#1-obtain-the-master-configyaml-of-our-openshift-cluster).

## 2. Create a scrip to add custom lengauges and custom catalog categories
#### 2.1. Custom language
For this example, we are going add a new language into the languages category. To do that we must created a script and we named as catalog-categories.js
```
// Find the Languages category.
var category = _.find(window.OPENSHIFT_CONSTANTS.SERVICE_CATALOG_CATEGORIES,
                      { id: 'languages' });
// Add Go as a new subcategory under Languages.
category.subCategories.splice(2,0,{ // Insert at the third spot.
  // Required. Must be unique.
  id: "devonfw-languages",
  // Required.
  label: "DevonFW",
  // Optional. If specified, defines a unique icon for this item.
  icon: "devonfw-logo-language",
  // Required. Items matching any tag will appear in this subcategory.
  tags: [
    "devonfw",
    "devonfw-angular",
    "devonfw-java"
  ]
});
```
#### 2.2. Custom category
For this example, we are going add a new category into the category tab. To do that we must created a script and we named as catalog-categories.js
```
// Add a Featured category as the first category tab.
window.OPENSHIFT_CONSTANTS.SERVICE_CATALOG_CATEGORIES.unshift({
  // Required. Must be unique.
  id: "devonfw-featured",
  // Required
  label: "DevonFW",
  subCategories: [
    {
      // Required. Must be unique.
      id: "devonfw-languages",
      // Required.
      label: "DevonFW",
      // Optional. If specified, defines a unique icon for this item.
      icon: "devonfw-logo-language",
      // Required. Items matching any tag will appear in this subcategory.
      tags: [
        "devonfw",
        "devonfw-angular",
        "devonfw-java"
      ]
    }
  ]
});
```
## 3. Copy our script inside the openshift container
To use our custom script, we need to copy our `.js` inside the openshift container. And we are going to do it inside the next directory /var/lib/origin/openshift.local.devonfw/

For example, we are going to copy our catalog-categories.js inside a folder called scripts, to do that, we can do it with the next command:
```
$ docker cp ./catalog-categories.js origin:/var/lib/origin/openshift.local.devonfw/scripts
```

## 4. Edit and copy the master-config.yaml to use our css.
The master-config.yaml have a section to charge custom styles in Openshift. This is inside the `assetConfig` and it's called `extensionScripts`.

To use our catalog-categories.js only need to add the directory route of catalog-categories.js in the extensionScripts of the master-config.yaml
```
...
assetConfig:
  ...
  extensionScripts:
  - /var/lib/origin/openshift.local.devonfw/scripts/catalog-categories.js
  ...
...
```
Now we only need to copy that master-config.yaml inside openshift, and restart it to load the new configuration. To do that execute the next:
```
$ docker cp ./master-config.yaml origin:/var/lib/origin/openshift.local.config/master/master-config.yaml
```
To re-start openshift do `oc cluster down` and start again your persistent openshift cluster.