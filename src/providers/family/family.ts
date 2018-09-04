import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';

@Injectable()
export class FamilyProvider {

  constructor(public http: HttpClient,
    public api: ApiProvider) {
  }

  addFamily(family){
    let response = this.api.post('families/add', family).share();
    return response;
  }

  getFamily(){
    let response = this.api.get('families/get').share();
    return response;
  }
}
