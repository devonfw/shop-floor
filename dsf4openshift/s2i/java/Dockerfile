FROM centos:centos7
MAINTAINER Michael Kuehl <mkuehl@redhat.com> Cristobal Belda <cbeldape@capgemini.com> Jorge Dacal <jodacalc@capgemini.com>

# Image version
ENV VERSION 1.0
ENV RELEASE 1

# Set the default port for applications built using this image
EXPOSE 8081

# Installed components version
ENV JAVA_VERSION 1.8.0
ENV MAVEN_VERSION 3.5.3

# Packages to install
ENV INSTALL_PKGS "curl tar unzip bc which lsof make nss_wrapper bind-utils"
ENV DEVEL_PACKAGES "java-$JAVA_VERSION-openjdk java-$JAVA_VERSION-openjdk-devel"

# Image metadata
ENV NAME="devonfw-java"
ENV MAINTAINER="mkuehl@redhat.com"
ENV VENDOR="Capgemini"
ENV SUMMARY="Base image for running DevonFW-based java applications"
ENV DESCRIPTION="Base image for running DevonFW-based java applications"
ENV TAGS="builder,s2i,java,devonfw"

# Locations, $PATH etc.
ENV STI_SCRIPTS_PATH=/usr/local/sti
ENV MAVEN_HOME /usr/local/maven
ENV PATH=/opt/maven/bin/:$PATH
ENV APP_ROOT=/opt/app-root

# Code context in github
ENV CODE_CONTEXT=dsf4openshift/s2i/java

# User ID 
ENV USER_ID 1001

### Atomic/OpenShift Labels - https://github.com/projectatomic/ContainerApplicationGenericLabels
LABEL name="$NAME" \
      maintainer="$MAINTAINER" \
      vendor="$VENDOR" \
      version="$VERSION" \
      release="$RELEASE" \
      summary="$SUMMARY" \
      description="$DESCRIPTION" \
      io.k8s.description="DESCRIPTION" \
      io.k8s.display-name="$NAME" \
      io.openshift.tags="$TAGS"

# Install basic components

# Gain access to EPEL (Extra Packages for Enterprise Linux)
RUN yum install -y epel-release

# Clean the cache (see https://access.redhat.com/articles/1320623)
RUN rm -fr /var/cache/yum/* && yum clean all 

# Install OS packages
RUN yum install -y --enablerepo=centosplus $INSTALL_PKGS $DEVEL_PACKAGES && \
    rpm -V $INSTALL_PKGS $DEVEL_PACKAGES && \
    yum clean all && \
    rm -rf /var/cache/yum

# Install Maven
RUN (curl -0 http://www.eu.apache.org/dist/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz | \
    tar -zx -C /usr/local) && \
    mv /usr/local/apache-maven-$MAVEN_VERSION /usr/local/maven && \
    ln -sf /usr/local/maven/bin/mvn /usr/local/bin/mvn

COPY ${CODE_CONTEXT}/contrib/settings.xml $MAVEN_HOME/conf
RUN chmod -R a+rwX $MAVEN_HOME/conf

# Install S2I scripts etc.
LABEL io.openshift.s2i.scripts-url=image:///usr/local/sti
COPY ${CODE_CONTEXT}/bin/ $STI_SCRIPTS_PATH
RUN chmod -R a+rx ${STI_SCRIPTS_PATH} && \
    chown -R ${USER_ID}:0 ${STI_SCRIPTS_PATH}

# In order to drop the root user, we have to make some directories world
# writeable as OpenShift default security model is to run the container under
# random UID.
RUN mkdir -p ${APP_ROOT}/src && \
    mkdir -p ${APP_ROOT}/deploy && \
    chmod -R u+rx ${APP_ROOT} && \
    chown -R ${USER_ID}:0 ${APP_ROOT}

# The default user in the image
USER ${USER_ID}

# Set the default CMD for the image
WORKDIR ${APP_ROOT}
CMD $STI_SCRIPTS_PATH/usage
