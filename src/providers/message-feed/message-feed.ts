import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';

@Injectable()
export class MessageFeedProvider {

  constructor(public http: HttpClient,
    private api: ApiProvider) {
  }

  addMessageFeed(message){
    let response = this.api.post('messageFeeds/add', message).share();
    return response;
  }

  getMessagesByEmail(email){
    let data = {
      email: email
    }
    let response = this.api.post('messageFeeds/getMessagesByEmail', data).share();
    return response;
  }


}
