# /*******************************************************************************
#  * Copyright 2015-2018 Capgemini SE.
#  * 
#  *  Licensed under the Apache License, Version 2.0 (the "License");
#  *  you may not use this file except in compliance with the License.
#  *  You may obtain a copy of the License at
#  * 
#  *      http://www.apache.org/licenses/LICENSE-2.0
#  * 
#  *  Unless required by applicable law or agreed to in writing, software
#  *  distributed under the License is distributed on an "AS IS" BASIS,
#  *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  *  See the License for the specific language governing permissions and
#  *  limitations under the License.
#  ******************************************************************************/

FROM centos:centos7
MAINTAINER Michael Kuehl <mkuehl@redhat.com> Cristobal Belda <cbeldape@capgemini.com> Jorge Dacal <jodacalc@capgemini.com>

# Image version
ENV VERSION 1.0
ENV RELEASE 1

# Packages to install
ENV INSTALL_PKGS "curl tar unzip bc which lsof make nss_wrapper bind-utils rh-nginx110 rh-nginx110-nginx npm http-parser.x86_64 autoconf automake binutils bison flex gcc gcc-c++ gettext libtool make patch pkgconfig redhat-rpm-config rpm-build rpm-sign"

# Installed components
ENV NGINX_VERSION=1.10

# Image metadata
ENV NAME="devonfw-angular"
ENV MAINTAINER="mkuehl@redhat.com"
ENV VENDOR="Capgemini"
ENV SUMMARY="Base image for running DevonFW-based AngularJS applications"
ENV DESCRIPTION="Base image for running DevonFW-based AngularJS applications"
ENV TAGS="builder,s2i,devonfw,javascript,nginx,angularjs"

# User ID 
ENV USER_ID 10001

# Locations, $PATH etc.
ENV APP_ROOT=/opt/app-root
ENV STI_SCRIPTS_PATH=/usr/local/sti
ENV NGINX_CONFIGURATION_PATH=${APP_ROOT}/etc/nginx.d
ENV NGINX_DEFAULT_CONF_PATH=${APP_ROOT}/etc/nginx.default.d

# Code context in github
ENV CODE_CONTEXT=dsf4openshift/s2i/angular

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
RUN yum install -y yum-utils gettext hostname && \
    yum install -y centos-release-scl-rh epel-release && \
    yum-config-manager --enable centos-sclo-rh-testing && \
    yum install -y --setopt=tsflags=nodocs $INSTALL_PKGS && \
    rpm -V $INSTALL_PKGS && \
    yum clean all

# Install S2I scripts etc.
LABEL io.openshift.s2i.scripts-url=image:///usr/local/sti
COPY ${CODE_CONTEXT}/bin/ $STI_SCRIPTS_PATH
RUN chmod -R a+rx ${STI_SCRIPTS_PATH} && \
    chown -R ${USER_ID}:0 ${STI_SCRIPTS_PATH}

# Copy extra files to the image.
COPY ${CODE_CONTEXT}/root/ /

# nginx config
RUN sed -i -f /opt/app-root/nginxconf.sed /etc/opt/rh/rh-nginx110/nginx/nginx.conf

# Create file locations
RUN mkdir -p ${APP_ROOT}/etc/nginx.d/ && \
    mkdir -p ${APP_ROOT}/etc/nginx.default.d/ && \
    chmod -R a+rwx ${APP_ROOT}/etc && \
    chmod -R a+rwx /var/opt/rh/rh-nginx110

RUN mkdir -p /usr/lib/node_modules && \
    mkdir -p /.cache && \
    mkdir -p /.config && \
    chmod -R a+rwx /usr/lib/node_modules && \
    chmod -R a+rwX /.cache && \
    chmod -R a+rwX /.config

# Install Javascript stuff
ENV npm_config=/tmp
RUN npm install -g yarn node-sass
RUN npm rebuild node-sass --force

# Change permissions
RUN chown -R ${USER_ID}:0 /opt/app-root && \
    chown -R ${USER_ID}:0 /var/opt/rh/rh-nginx110 && \
    chown -R ${USER_ID}:0 /usr/lib/node_modules && \
    chown -R ${USER_ID}:0 /.cache && \
    chown -R ${USER_ID}:0 /.config

# nginx volumes
VOLUME ["/opt/rh/rh-nginx110/root/usr/share/nginx/html"]
VOLUME ["/var/opt/rh/rh-nginx110/log/nginx/"]

ENV BASH_ENV=/opt/app-root/etc/scl_enable \
    ENV=/opt/app-root/etc/scl_enable \
    PROMPT_COMMAND=". /opt/app-root/etc/scl_enable"

# The default user in the centos image
USER ${USER_ID}

# Set the default port for applications built using this image
EXPOSE 8080
EXPOSE 8443

# Set the default CMD for the image
WORKDIR ${APP_ROOT}
CMD $STI_SCRIPTS_PATH/usage
