# DevonFW Openshift Origin Initial Setup

This is a scripts to customize an Openshift cluster to be a DevonFW Openshift.

## How to use

#### Customize Openshift

DevonFw Openshift Origin use custom icons, and we need to add it to openshift. More information:
- [Customize DevonFW Openshift Origin](./customizeOpenshift).

#### initial-setup.sh

This script do as follows:
1. Create a project devonfw
2. Build inside devonfw a s2i-devonfw-java and s2i-devonfw-angular images from the template located in [oasp](https://github.com/oasp/s2i/tree/master/s2i) project.
3. Setup the devonfw project as "image-puller" to let their imagenes be used in other projects in the same cluster.
4. Add to namespace openshift a devonfw-java and a devonfw-angular templates located in [oasp](https://github.com/oasp/s2i/tree/master/templates/devonfw) project. This templates are added in the openshift namespace to be used by everyone.