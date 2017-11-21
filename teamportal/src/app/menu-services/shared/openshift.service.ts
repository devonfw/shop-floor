import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpHeaders, HttpEvent } from '@angular/common/http';
import { API } from './api';
import { Observable } from 'rxjs/Observable';
import { Service } from './service';
import { SERVICESLIST, MYSERVICES } from './mock-services';
import { Response } from '@angular/http/src/static_response';
import { catchError, map, tap } from 'rxjs/operators';

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

    requestToken(username: string, password: string): Observable<any> {
        const bearerparam = 'Basic ' + btoa(username + ':' + password);
        return this.http.get(this.API.REQUEST_TOKEN, {
            headers: new HttpHeaders({
                'Authorization': bearerparam,
            }),
            responseType: 'text'
        });
    }

    // getProjects
    requestProjects(): Observable<any> {
        return this.http.get(this.API.REQUEST_PROJECTS, {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            })
        });
    }

    requestServiceRoutes(): Observable<any> {
        return this.http.get(this.API.REQUEST_SERVICE_ROUTES);
    }

    requestSecret(): Observable<any> {
        return this.http.get(this.API.REQUEST_SECRET);
    }

    // POST

    createProject(name: string, namespace: string, description: string, displayname: string): Observable<any> {
        return this.http.post(this.API.CREATE_PROJECT, {
            'name': name,
            'namespace': namespace,
            'description': description,
            'displayname': displayname
        });
    }

    createApp(data: any): Observable<any> {
        return this.http.post(this.API.CREATE_APP, {'data': data});
    }

    buildApp(data: any): Observable<any> {
        return this.http.post(this.API.BUILD_APP, {'data': data});
    }

    createSecret(data: any): Observable<any> {
        return this.http.post(this.API.CREATE_SECRET, {'data': data});
    }

    makeSecretBuildSecret(data: any): Observable<any> {
        return this.http.post(this.API.MAKE_SECRET_BUILD_SECRET, {'data': data});
    }

    // PATCH
    addSecretToBuilderSA(secretname: string): Observable<any> {
        return this.http.patch(this.API.ADD_SECRET_TO_BUILDER_SA, {
            'op': 'add',
            'path': '/secrets/-',
            'value': {
                'name': secretname
            }
        });
    }

}
