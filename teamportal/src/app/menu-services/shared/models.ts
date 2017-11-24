//INPUT cluster to angular

//OUTPUT angular to cluster
export interface BasicAuth {
    username: string;
    password: string;
}

export interface CreateProject {
    name: string,
    displayName: string,
    description: string,
}

export interface RouteNamespace {
    namespace: string
}

export interface RouteNameAndNamespace {
    name: string,
    namespace: string
}

export interface RouteNamespaceAndBodyJSON {
    namespaceRoute: string,
    bodyJSON: JSON,
}

/**
 * Comentarios:
 * @param name the name of the secret.
 */
export interface CreateSecret {
    namespace: string,
    name: string,
    sshprivatekey: string
}

export interface Secret {
    name: string,
    namespace: string
    nameSecret: string,
}

/*
export interface ProcessedTemplates {
    namespace: string,
    template: JSON,
}

export interface BuildConfig {
    namespace: string,
    buildConfig: JSON,
}

export interface ImageStream {
    namespace: string,
    imageStream: JSON,
}

export interface DeploymentConfig {
    namespace: string,
    deploymentConfig: JSON,
}

export interface Routes {
    namespace: string,
    Route: JSON,
}

export interface Services {
    namespace: string,
    Services: JSON,
}
*/