import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { API } from './api'
import { Observable } from 'rxjs/Observable';
import { Service } from './service';
import { SERVICESLIST, MYSERVICES } from './mock-services';

// Service to call Cluster's REST API operations
// based on https://docs.google.com/spreadsheets/d/1Cv6nfMDH3TqGRUjyCdZZ6k4W4trFAD8tk_5HXskC6BQ/edit?usp=sharing

@Injectable()
export class OpenShiftService {

    API: API = new API();
    constructor(
        private http: Http,
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

    requestToken(): Observable<any> {
        return this.http.get(this.API.REQUEST_TOKEN);
    }

    requestProjects(): Observable<any> {
        return this.http.get(this.API.REQUEST_PROJECTS);
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
            "name": name,
            "namespace": namespace,
            "description": description,
            "displayname": displayname
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

    addSecretToApp(data: any): Observable<any> {
        return this.http.post(this.API.ADD_SECRET_TO_APP, {'data': data});
    }

}
