# devonfw-shop-floor for OpenShift
Scripts, tools etc to create and manage OpenShift based DevOps/CI/CD/Test environment

1. Get your local cluster up with `oc cluster up` (edit: `minishift start` could be the correct command)
2. Run the `build-cicd.sh` script
3. See your environment in the Openshift Dashboard
4. Manually deploy the **Nexus** service

## How to install RHEL - **RECOMMENDED**

In order to install RHEL, your must follow all steps defined in the following [link](https://developers.redhat.com/products/rhel/hello-world/#fndtn-bare-metal)

If you want to enable EPEL repository, execute the following command:

```
# rpm -ivh https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rmp
# yum -y update
```

## How to install Red Hat Container Development Kit (CDK)

The following commands only works in RHEL, for other SO check the [Red Hat developers web page](https://developers.redhat.com/products/cdk/hello-world/#fndtn-windows)

1. Enable some software repositories

```
$ su -
# subscription-manager repos --enable rhel-7-server-devtools-rpms
# subscription-manager repos --enable rhel-server-rhscl-7-rpms

```
2. Add the Red Hat Developer Tools key to your system

```
# cd /etc/pki/rpm-gpg
# wget -O RPM-GPG-KEY-redhat-devel https://www.redhat.com/security/data/a5787476.txt
# rpm --import RPM-GPG-KEY-redhat-devel
```

3. Install all of the tools in Red Hat Development Suite

```
# yum install rh-devsuite
```

4. Install only Red Hat Container Development Kit 3.1

```
# yum install cdk-minishift docker-machine-kvm
```

5. Add the minishift command to the system path

```
# ln -s /var/lib/cdk-minishift-3.0.0/minishift /usr/bin/minishift
```

6. Setup the minishift VM and download additional components

```
# exit
$ minishift setup-cdk --force --default-vm-driver="kvm"
```

7. Add the OpenShift oc command to the system path

```
$ su 
# ln -s /home/$(whoami)/.minishift/cache/oc/v3.5.5.8/oc /usr/bin/oc
```

8. Finally, start OpenShift

```
# exit
$ minishift start
```

## Resources

 - [Openshift books](https://developers.openshift.com/overview/books.html)
 - edX course: 
[Fundamentals of Containers, Kubernetes, and Red Hat OpenShift](https://courses.edx.org/courses/course-v1:RedHat+DO081x+2T2017/course/)
 - [oc cluster wrapper](https://github.com/openshift-evangelists/oc-cluster-wrapper)
 - [minishift demo](https://github.com/nearform/minishift-demo)