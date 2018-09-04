import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';

@Injectable()
export class UserDeviceProvider {

  constructor(public http: HttpClient,
    public api: ApiProvider) {
  }

  getUserDevices(email){
    let data = {
      email:email
    }
    let response = this.api.post('user_devices/getUserDevices', data).share();
    return response;
  }
  getUserDeviceByDeviceId(deviceId){
    let data = {
      deviceId:deviceId
    }
    let response = this.api.post('user_devices/getUserDeviceByDeviceId', data).share();
    return response;
  }

  linkDeviceToUser(deviceProfile){
    let response = this.api.post('user_devices/link', deviceProfile).share();
    return response;
  }

  configDevice(configuredDevice){
    console.log('asd')
    let response = this.api.post('user_devices/config', configuredDevice).share();
    return response;
  }

  unlink(device){
    let response = this.api.post('user_devices/unlink', device).share();
    return response;
  }

  changeFixStatus(userDevice){
    let response = this.api.post('user_devices/updateFix', userDevice).share();
    return response;
  }
}
