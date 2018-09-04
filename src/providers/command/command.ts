import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';

@Injectable()
export class CommandProvider {

  constructor(public http: HttpClient, public api: ApiProvider) {
  }

  addCommand(deviceCommand){
    let response = this.api.post('deviceCommands/addCommand', deviceCommand).share();
    return response;
  }
}
