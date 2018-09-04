import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';

@Injectable()
export class UserProfileProvider {

  constructor(public http: HttpClient,
    public api: ApiProvider) {
  }

  getUserProfiles(email){
    let data = {
      email:email
    }
    let response = this.api.post('userProfiles/getUserProfiles', data).share();
    return response;
  }

}
