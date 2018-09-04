import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class ApiProvider {
  url: string = 'http://localhost:3000';

  constructor(public http: HttpClient) {
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params.set(k, params[k]);
      }
    }
    const httpOptions = {
      headers: new HttpHeaders({
        // 'Access-Control-Allow-Origin':  "*",
        // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
        // 'Access-Control-Allow-Headers': 'Content-Type'
        'Access-Control-Allow-Credentials': "true"
      })
    };

    return this.http.get(this.url + '/' + endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        // 'Access-Control-Allow-Origin':  "*",
        // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
        // 'Access-Control-Allow-Headers': 'Content-Type'
        // 'Access-Control-Allow-Credentials': "true",
        
      })
    };

    return this.http.post(this.url + '/' + endpoint, body, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }
}
