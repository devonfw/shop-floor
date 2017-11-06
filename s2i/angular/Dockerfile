FROM centos:centos7
MAINTAINER Michael Kuehl <mkuehl@redhat.com>

# Image version
ENV VERSION 1.0
ENV RELEASE 1

# Set the default port for applications built using this image
EXPOSE 8080
EXPOSE 8443

# Installed components
ENV NGINX_VERSION=1.10

ENV SUMMARY="Base image for running DevonFW-based AngularJS applications"
ENV DESCRIPTION="Base image for running DevonFW-based AngularJS applications"

LABEL summary="$SUMMARY" \
      description="$DESCRIPTION" \
      io.k8s.description="DESCRIPTION" \
      io.k8s.display-name="devonfw-angular" \
      io.openshift.tags="builder,s2i,devonfw,javascript,nginx,angularjs" \
      name="devonfw/s2i-devonfw-angular" \
      version="$VERSION" \
      release="$RELEASE"

ENV STI_SCRIPTS_PATH=/usr/local/sti
ENV NGINX_CONFIGURATION_PATH=/opt/app-root/etc/nginx.d
ENV NGINX_DEFAULT_CONF_PATH=/opt/app-root/etc/nginx.default.d

# Gain access to EPEL (Extra Packages for Enterprise Linux)
RUN yum install -y epel-release

# Clean the cache (see https://access.redhat.com/articles/1320623)
RUN rm -fr /var/cache/yum/* && yum clean all 

# Packages to add
ENV INSTALL_PKGS "curl tar unzip bc which lsof make nss_wrapper bind-utils rh-nginx110 rh-nginx110-nginx npm http-parser.x86_64 autoconf automake binutils bison flex gcc gcc-c++ gettext libtool make patch pkgconfig redhat-rpm-config rpm-build rpm-sign"

# Install extra packages
RUN yum install -y yum-utils gettext hostname && \
    yum install -y centos-release-scl-rh epel-release && \
    yum-config-manager --enable centos-sclo-rh-testing && \
    yum install -y --setopt=tsflags=nodocs $INSTALL_PKGS && \
    rpm -V $INSTALL_PKGS && \
    yum clean all

# Copy the S2I scripts to $STI_SCRIPTS_PATH
LABEL io.openshift.s2i.scripts-url=image:///usr/local/sti
COPY s2i/angular/bin/ $STI_SCRIPTS_PATH

# Copy extra files to the image.
COPY s2i/angular/root/ /

# In order to drop the root user, we have to make some directories world
# writeable as OpenShift default security model is to run the container under
# random UID.
RUN sed -i -f /opt/app-root/nginxconf.sed /etc/opt/rh/rh-nginx110/nginx/nginx.conf && \
    mkdir -p /opt/app-root/etc/nginx.d/ && \
    mkdir -p /opt/app-root/etc/nginx.default.d/ && \
    mkdir -p /usr/lib/node_modules && \
    mkdir -p /.cache && \
    mkdir -p /.config && \
    chmod -R a+rwx /opt/app-root/etc && \
    chmod -R a+rwx /var/opt/rh/rh-nginx110 && \
    chmod -R a+rwx /usr/lib/node_modules && \
    chmod -R a+rwX /.cache && \
    chmod -R a+rwX /.config

# Install Javascript stuff
ENV npm_config=/tmp
RUN npm install -g yarn node-sass
RUN npm rebuild node-sass --force

# Change permissions
RUN chown -R 1001:0 /opt/app-root && \
    chown -R 1001:0 /var/opt/rh/rh-nginx110 && \
    chown -R 1001:0 /usr/lib/node_modules && \
    chown -R 1001:0 /.cache && \
    chown -R 1001:0 /.config

VOLUME ["/opt/rh/rh-nginx110/root/usr/share/nginx/html"]
VOLUME ["/var/opt/rh/rh-nginx110/log/nginx/"]

ENV BASH_ENV=/opt/app-root/etc/scl_enable \
    ENV=/opt/app-root/etc/scl_enable \
    PROMPT_COMMAND=". /opt/app-root/etc/scl_enable"

# The default user in the centos image
USER 1001

# Set the default CMD for the image
CMD $STI_SCRIPTS_PATH/usage
