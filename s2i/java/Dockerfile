FROM centos:centos7
# MAINTAINER Michael Kuehl <mkuehl@redhat.com>

# Image version
ENV VERSION 1.0
ENV RELEASE 1

# Set the default port for applications built using this image
EXPOSE 8080

# Installed components
ENV JAVA_VERSION 1.8.0
ENV MAVEN_VERSION 3.5.2

ENV SUMMARY="Base image for running DevonFW-based java applications"
ENV DESCRIPTION="Base image for running DevonFW-based java applications"

LABEL summary="$SUMMARY" \
      description="$DESCRIPTION" \
      io.k8s.description="DESCRIPTION" \
      io.k8s.display-name="devonfw-java" \
      io.openshift.tags="builder,s2i,devonfw,java" \
      name="devonfw/s2i-devonfw-java" \
      version="$VERSION" \
      release="$RELEASE"

ENV STI_SCRIPTS_PATH=/usr/local/sti

# Gain access to EPEL (Extra Packages for Enterprise Linux)
RUN yum install -y epel-release

# Clean the cache (see https://access.redhat.com/articles/1320623)
RUN rm -fr /var/cache/yum/* && yum clean all 

# Packages to add
ENV INSTALL_PKGS "curl tar unzip bc which lsof make nss_wrapper bind-utils java-$JAVA_VERSION-openjdk java-$JAVA_VERSION-openjdk-devel"

# Install packages
RUN yum install -y --enablerepo=centosplus $INSTALL_PKGS && \
    rpm -V $INSTALL_PKGS && \
    yum clean all

# Install Maven
RUN (curl -0 http://www.eu.apache.org/dist/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz | \
    tar -zx -C /usr/local) && \
    mv /usr/local/apache-maven-$MAVEN_VERSION /usr/local/maven && \
    ln -sf /usr/local/maven/bin/mvn /usr/local/bin/mvn

# Add a default mvn settings.xml file
ENV MAVEN_HOME /usr/local/maven
ENV PATH=/opt/maven/bin/:$PATH
COPY s2i/java/contrib/settings.xml $MAVEN_HOME/conf
RUN chmod -R a+rwX $MAVEN_HOME/conf

# Copy the S2I scripts to $STI_SCRIPTS_PATH
LABEL io.openshift.s2i.scripts-url=image:///usr/local/sti
COPY s2i/java/bin/ $STI_SCRIPTS_PATH

# In order to drop the root user, we have to make some directories world
# writeable as OpenShift default security model is to run the container under
# random UID.
RUN mkdir -p /opt/openshift && \
    mkdir -p /opt/app-root/source && \
    mkdir -p /opt/s2i/destination && \
    mkdir -p /opt/app-root/src && \
    chmod -R a+rwx /opt/openshift && \
    chmod -R a+rwx /opt/app-root/source && \
    chmod -R a+rwx /opt/s2i/destination && \
    chmod -R a+rwx /opt/app-root/src && \
    chown -R 1001:0 /opt/openshift && \
    chown -R 1001:0 /opt/app-root/source && \
    chown -R 1001:0 /opt/s2i/destination && \
    chown -R 1001:0 /opt/app-root/src

# The default user in the centos image
USER 1001

# Set the default CMD for the image
CMD $STI_SCRIPTS_PATH/usage
