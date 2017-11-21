import { environment } from '../../../environments/environment';

export class API {
    private AUTH = 'oauth/';
    private OPENSHIFT = 'oapi/';
    private KUBERNETES = 'apis/';

    // GET
    public REQUEST_TOKEN = environment.clusterURL + this.AUTH + 'token/request';
    public REQUEST_PROJECTS = environment.clusterURL + this.OPENSHIFT + 'v1/projects';
    public REQUEST_SERVICE_ROUTES = 'route.openshift.io/v1/namespaces/$NAMESPACE/routes';
    public REQUEST_SECRET = '';

    // POST
    public CREATE_PROJECT = '';
    public CREATE_APP = '';
    public BUILD_APP = '';
    public CREATE_SECRET = '';
    public MAKE_SECRET_BUILD_SECRET = '';

    // PATCH
    public ADD_SECRET_TO_BUILDER_SA = this.KUBERNETES + '';

    constructor() {}

}
