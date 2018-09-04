import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';

@Injectable()
export class ProfileProvider {

  constructor(public http: HttpClient,
              private api: ApiProvider) {
    
  }

  addProfile(profile){
    let response = this.api.post('profiles/add', profile).share();
    return response;
  }
  
  getSystemProfile(plantName){
    let dataToServer = {
      plantName: plantName
    }
    let response = this.api.post('profiles/getSystemProfile', dataToServer).share();
    return response;
  }

  getProfilesByEmail(email){
    let dataToServer = {
      email: email
    }
    let response = this.api.post('profiles/getProfilesByEmail', dataToServer).share();
    return response;
  }
}
