import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpHeaders, HttpEvent } from '@angular/common/http';
import { API } from './api';
import { Observable } from 'rxjs/Observable';
import { Service } from './service';
import { SERVICESLIST, MYSERVICES } from './mock-services';
import { Response } from '@angular/http/src/static_response';
import { catchError, map, tap } from 'rxjs/operators';
import * as INTERFACES from './models';

// Service to call Cluster's REST API operations
// based on https://docs.google.com/spreadsheets/d/1Cv6nfMDH3TqGRUjyCdZZ6k4W4trFAD8tk_5HXskC6BQ/edit?usp=sharing

@Injectable()
export class OpenShiftService {

    API: API = new API();
    constructor(
        private http: HttpClient,
    ) { }

    // SERVICES

    getCICDservices(): Promise<Service[]> {
        return Promise.resolve(SERVICESLIST);
        // return Observable<Service[]>
    }

    getMYservices(): Promise<Service[]> {
        return Promise.resolve(MYSERVICES);
        // return Observable<Service[]>
    }

    // GET
    private get(route: string): Observable<any> {
        return this.http.get(route, {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            })
        });
    }

    requestFileParam(route: string): Observable<any> {
        return this.http.get(route);
    }

    requestToken(params: INTERFACES.BasicAuth) {
        const basicAuth = 'Basic ' + btoa(params.username + ':' + params.password);
        return this.http.get(this.API.REQUEST_TOKEN, {
            headers: new HttpHeaders({
                'Authorization': basicAuth,
            }),
            responseType: 'text'
        });
    }

    requestAllProjects(): Observable<any> {
        let route = this.API.REQUEST_PROJECTS;
        route = route.replace('/$NAME', '');
        return this.get(route);
    }

    requestProject(name: string): Observable<any> {
        let route = this.API.REQUEST_PROJECTS;
        route = route.replace('$NAME', name);
        return this.get(route);
    }

    requestTemplate(params: INTERFACES.RouteNameAndNamespace): Observable<any> {
        let route = this.API.REQUEST_TEMPLATE;
        route = route.replace('$NAMESPACE', params.namespace);
        route = route.replace('$NAME', params.name);
        return this.get(route);
    }

    requestAllRoutes(params: INTERFACES.RouteNamespace): Observable<any> {
        let route = this.API.REQUEST_ROUTES;
        route = route.replace('$NAMESPACE', params.namespace);
        route = route.replace('/$NAME', '');
        return this.get(route);
    }

    requestRoutes(params: INTERFACES.RouteNameAndNamespace): Observable<any> {
        let route = this.API.REQUEST_ROUTES;
        route = route.replace('$NAMESPACE', params.namespace);
        route = route.replace('$NAME', params.name);
        return this.get(route);
    }

    // POST
    private post(route, body): Observable<any> {
        return this.http.post(route, body, {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            })
        });
    }

    createProject(params: INTERFACES.CreateProject): Observable<any> {
        const body = {
            'displayName': params.displayName,
            'description': params.description,
            'kind': 'ProjectRequest',
            'metadata': {
              'name': params.name,
              'namespace': params.name
            }
        };
        return this.post(this.API.CREATE_PROJECT, body);
    }

    processedTemplate(params: INTERFACES.RouteNamespaceAndBodyJSON): Observable<any> {
        let route = this.API.PROCESS_TEMPLATE;
        route = route.replace('$NAMESPACE', params.namespaceRoute);
        return this.post(route, params.bodyJSON);
    }

    createBuildConfig(params: INTERFACES.RouteNamespaceAndBodyJSON): Observable<any> {
        let route = this.API.CREATE_BUILDCONFIG;
        route = route.replace('$NAMESPACE', params.namespaceRoute);
        return this.post(route, params.bodyJSON);
    }

    createImageStream(params: INTERFACES.RouteNamespaceAndBodyJSON): Observable<any> {
        let route = this.API.CREATE_IMAGESTREAM;
        route = route.replace('$NAMESPACE', params.namespaceRoute);
        return this.post(route, params.bodyJSON);
    }

    createDeploymentConfig(params: INTERFACES.RouteNamespaceAndBodyJSON): Observable<any> {
        let route = this.API.CREATE_DEPLOYMENTCONFIG;
        route = route.replace('$NAMESPACE', params.namespaceRoute);
        return this.post(route, params.bodyJSON);
    }

    createRoute(params: INTERFACES.RouteNamespaceAndBodyJSON): Observable<any> {
        let route = this.API.CREATE_ROUTE;
        route = route.replace('$NAMESPACE', params.namespaceRoute);
        return this.post(route, params.bodyJSON);
    }

    createService(params: INTERFACES.RouteNamespaceAndBodyJSON): Observable<any> {
        let route = this.API.CREATE_SERVICE;
        route = route.replace('$NAMESPACE', params.namespaceRoute);
        return this.post(route, params.bodyJSON);
    }

    createSecret(params: INTERFACES.CreateSecret): Observable<any> {
        let route = this.API.CREATE_SECRET;
        route = route.replace('$NAMESPACE', params.namespace);
        const body = {
            'kind': 'Secret',
            'metadata': {
                'name': params.name,
            },
            'type': 'kubernetes.io/ssh-auth',
            'ssh-privatekey': params.sshprivatekey
        };
        return this.post(route, body);
    }

    buildApp(params: INTERFACES.RouteNameAndNamespace): Observable<any> {
        let route = this.API.CREATE_SECRET;
        route = route.replace('$NAMESPACE', params.namespace);
        route = route.replace('$NAME', params.name);
        const body = {
            'kind': 'BuildRequest',
            'metadata': {
                'name': params.name,
            }
        };
        return this.post(route, body);
    }

    // PATCH
    private patch(route, body): Observable<any> {
        return this.http.patch(route, body, {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json-patch+json'
            }),
        });
    }

    addSecretToBuilderSA(params: INTERFACES.Secret): Observable<any> {
        let route = this.API.PATCH_SERVICEACCOUNT;
        route = route.replace('$NAME', params.name);
        route = route.replace('$NAMESPACE', params.namespace);
        const body = [{
            'op': 'add',
            'path': '/secrets/-',
            'value': { 'name': params.nameSecret }
        }];
        return this.patch(route, body);
    }

    addSecretToBuildconfig(params: INTERFACES.Secret): Observable<any> {
        let route = this.API.PATCH_BUILDCONFIG;
        route = route.replace('$NAME', params.name);
        route = route.replace('$NAMESPACE', params.namespace);
        const body = [{
            'op': 'add',
            'path': '/spec/source/sourceSecret',
            'value': { 'name': params.nameSecret }
        }];
        return this.patch(route, body);
    }

}
