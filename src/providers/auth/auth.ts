import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { tokenNotExpired } from 'angular2-jwt';
import { ApiProvider } from '../api/api';
import { Storage } from '@ionic/storage';
import { SharedProvider } from '../shared/shared';
import 'rxjs/add/operator/share';

@Injectable()
export class AuthProvider {
  authToken: any;
  public user: any;
  public isLoggedIn: boolean = false;

  constructor(public http: HttpClient,
    public api: ApiProvider,
    private storage: Storage,
    private sharedProvider: SharedProvider) {
  }

  // Register new user
  registerUser(user) {
    let response = this.api.post('users/register', user).share();
    return response;
  }

  // Authenticate user login
  authenticateUser(user) {
    let response = this.api.post('users/authenticate', user).share();

    response.subscribe((response: any) => {
      if (response["success"]) {
        this.storeUserData(response["token"], response["user"]);
      }
    });

    return response;
  }

  // Get profile
  getProfile() {
    // const headers = new HttpHeaders();
    // this.loadToken();
    // headers.append('Authorization', this.authToken);
    // headers.append('Content-Type', 'application/json');
    // return this.http.get(server_config.url + '/users/profile', {headers: headers})
    //   .map(res => res.json());
  }

  // Store user data and token in local storage
  storeUserData(token, user) {
    this.storage.set('id_token', token);
    this.storage.set('user', JSON.stringify(user)).then((reason) => {
      this.sharedProvider.emitChange("log in");
    });

    this.authToken = token;
    this.user = user;
  }

  // Get token form local storage
  loadToken(callback) {
    this.authToken = this.storage.get('id_token');
    this.storage.get('id_token').then((val) => {
      if (val != null){
        this.authToken = val;
        const flag = tokenNotExpired('id_token', this.authToken);

        callback(flag);
      }
      else
        callback(false)
    });
  }

  // Returns if we are logged in and token not expired
  loggedIn(callback) {
    this.loadToken((success) => {
      //console.log("loggedIn success: "+success)
      if(success == false){
        this.logOut();
      }
      callback(success)
    });
  }

  loadUser(callback) {
    this.storage.get('user').then((val) => {
      if (val != null) {
        this.user = JSON.parse(val);
        //console.log(this.user)
      }
      callback();
    });
  }

  isAdmin(callback) {
    this.loadUser(() => {
      if (this.user !== null && this.user.role === 'admin')
        callback(true);
      else
      callback(false);
    });
  }

  // Log out
  logOut() {
    this.authToken = null;
    this.user = null;
    this.storage.set('id_token', null);
    this.storage.set('user', null).then((reason) => {
      this.sharedProvider.emitChange("log out");
    });
    
  }

  getUserName(callback) {
    let username;
    this.loadUser(() => {
      if (this.user === null)
        username = 'You are not logged in';
      else 
        username = this.user.name;

      callback(username);
    });
  }

  getEmail(callback) {
    let email;
    this.loadUser(() => {
      if (this.user === null)
        email = 'You are not logged in';
      else 
        email = this.user.email;

      callback(email);
    });
  }

}
