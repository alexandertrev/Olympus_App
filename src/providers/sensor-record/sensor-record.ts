import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';

@Injectable()
export class SensorRecordProvider {

  constructor(
    public http: HttpClient,
    private api: ApiProvider) {
  }

  getLastSensorRecord(mac){
    let data = {
      mac: mac
    }
    let response = this.api.post('lastSensorRecords/getLastSensorRecord', data).share();
    return response;
  }

  getAllSensorRecord(mac){
    let data = {
      mac: mac
    }
    let response = this.api.post('sensorRecords/getAllSensorRecord', data).share();
    return response;
  }
}
