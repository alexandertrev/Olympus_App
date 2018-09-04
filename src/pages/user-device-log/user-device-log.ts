import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { SensorRecordProvider } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-user-device-log',
  templateUrl: 'user-device-log.html',
})
export class UserDeviceLogPage {
  userDevice: any;
  recordList: any = [];
  column: string = 'date';
  isDesc: boolean = true;
  direction: number = 1;
  
  constructor(
    public events: Events,
    public navCtrl: NavController, 
    public navParams: NavParams,
    private sensorProvider: SensorRecordProvider) {

      this.userDevice = navParams.data;
      
  }
  ionViewDidEnter(){
    this.sensorProvider.getAllSensorRecord(this.userDevice.device.mac).subscribe(data =>{
      console.log(data)
      if(data['success'])
        this.recordList = data['answer'];
    })
  }

  back(){
    this.events.publish('close-modal');
  }

  sort(property) {
    this.isDesc = !this.isDesc; //change the direction    
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  }

}
