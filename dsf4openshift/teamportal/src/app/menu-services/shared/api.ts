import { environment } from '../../../environments/environment';

export class API {
    private AUTH = 'oauth/';
    private OPENSHIFT = 'oapi/v1/';
    private KUBERNETES = 'api/v1/';

    // GET
    public REQUEST_TOKEN = environment.clusterURL + this.AUTH + 'token/request';
    public REQUEST_PROJECTS = environment.clusterURL + this.OPENSHIFT + 'projects/$NAME';
    public REQUEST_TEMPLATE = environment.clusterURL + this.OPENSHIFT + 'namespaces/$NAMESPACE/templates/$NAME';
    public REQUEST_ROUTES = environment.clusterURL + this.OPENSHIFT + 'namespaces/$NAMESPACE/routes/$NAME';

    // POST
    public CREATE_PROJECT = environment.clusterURL + this.OPENSHIFT + 'projectrequests';
    public PROCESS_TEMPLATE = environment.clusterURL + this.OPENSHIFT + 'namespaces/$NAMESPACE/processedtemplates';
    public CREATE_BUILDCONFIG = environment.clusterURL + this.OPENSHIFT + 'namespaces/$NAMESPACE/buildconfigs';
    public CREATE_IMAGESTREAM = environment.clusterURL + this.OPENSHIFT + 'namespaces/$NAMESPACE/imagestreams';
    public CREATE_DEPLOYMENTCONFIG = environment.clusterURL + this.OPENSHIFT + 'namespaces/$NAMESPACE/deploymentconfigs';
    public CREATE_ROUTE = environment.clusterURL + this.OPENSHIFT + 'namespaces/$NAMESPACE/routes';
    public CREATE_SERVICE = environment.clusterURL + this.KUBERNETES + 'namespaces/$NAMESPACE/services';
    public CREATE_SECRET = environment.clusterURL + this.KUBERNETES + 'namespaces/$NAMESPACE/secrets';
    public BUILD_APP = environment.clusterURL + this.OPENSHIFT + 'namespaces/$NAMESPACE/buildconfigs/$NAME/instantiate';

    // PATCH
    public PATCH_SERVICEACCOUNT = environment.clusterURL + this.KUBERNETES + 'namespaces/$NAMESPACE/serviceaccounts/$NAME';
    public PATCH_BUILDCONFIG = environment.clusterURL + this.KUBERNETES + 'namespaces/$NAMESPACE/buildconfigs/$NAME';

    constructor() {}

    getCreateRoute(suffix: string) {
        switch (suffix) {
            case 'Service':
              return this.CREATE_SERVICE;
            case 'Secret':
              return this.CREATE_SECRET;
            default:
                return environment.clusterURL + this.OPENSHIFT + 'namespaces/$NAMESPACE/' + suffix.toLowerCase() + 's';
        }
    }

}
