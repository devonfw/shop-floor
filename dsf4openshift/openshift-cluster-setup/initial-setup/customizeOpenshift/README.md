# Customize Openshift Origin for DevonFW

This is a guide to customize Openshift cluster.

# Images Styles
The icons for templates must measure the same as below or the images don't show right:

- `Openshift logo`: 230px x 40px.
- `Template logo`: 50px x 50px.
- `Category logo`: 110px x 36px.

## How to use

To use it, we need to enter in openshift as an admin and use the next command:

```
$ oc login

$ oc edit configmap/webconsole-config -n openshift-web-console
```

After this, we can see in our shell the webconsole-config.yaml, we only need to navegate untill **extensions** and add the url for our own `css` in the **stylesheetURLs** and `javascript` in the *scriptURLs* section.

**IMPORTANT: Scripts and stylesheets must be served with the correct content type or they will not be run by the browser. Scripts must be served with Content-Type: application/javascript and stylesheets with Content-Type: text/css.**

In git repositories, the content type of raw is text/plain. You can use [rawgit](https://rawgit.com/) to convert a raw from a git repository to the correct content type.

Example:

```
webconsole-config.yaml: |
  [...]
  extensions:
    scriptURLs:
      - https://cdn.rawgit.com/devonfw/devonfw-shop-floor/develop/dsf4openshift/openshift-cluster-setup/initial-setup/customizeOpenshift/scripts/catalog-categories.js
    stylesheetURLs:
      - https://cdn.rawgit.com/devonfw/devonfw-shop-floor/master/dsf4openshift/openshift-cluster-setup/initial-setup/customizeOpenshift/stylesheet/icons.css
  [...]
```

## More information

* [Customize icons](https://github.com/devonfw/devonfw-shop-floor/wiki/devonfw-shop-floor-4-openshift-customize-icons) for Openshift.
* [Customize catalog](https://github.com/devonfw/devonfw-shop-floor/wiki/devonfw-shop-floor-4-openshift-customize-catalog) for Openshift.
* [Openshift docs](https://docs.openshift.com/container-platform/latest/install_config/web_console_customization.html#loading-custom-scripts-and-stylesheets) about customization.

## Old versions
* Customize Openshift for [version 3.7](https://docs.openshift.com/container-platform/3.9/install_config/web_console_customization.html#loading-custom-scripts-and-stylesheets).
