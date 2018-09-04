import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class RainRecordProvider {

  constructor(public http: HttpClient) {
    console.log('Hello RainRecordProvider Provider');
  }

}
