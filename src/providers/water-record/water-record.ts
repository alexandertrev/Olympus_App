import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';

@Injectable()
export class WaterRecordProvider {

  constructor(
    public http: HttpClient,
    private api: ApiProvider) {
  }

  getLastSensorRecord(mac){
    let data = {
      mac: mac
    }
    let response = this.api.post('waterRecords/getLastWaterRecord', data).share();
    return response;
  }

  getAllSensorRecord(mac){
    let data = {
      mac: mac
    }
    let response = this.api.post('waterRecords/getAllSensorRecord', data).share();
    return response;
  }

}
