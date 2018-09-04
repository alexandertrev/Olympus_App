import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { WaterRecordProvider } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-user-device-water',
  templateUrl: 'user-device-water.html',
})
export class UserDeviceWaterPage {
  userDevice: any;
  recordList: any = [];
  column: string = 'Date';
  isDesc: boolean = true;
  direction: number = 1;

  constructor(
    public events: Events,
    public navCtrl: NavController, 
    public navParams: NavParams,
    private waterProvider: WaterRecordProvider) {

      this.userDevice = navParams.data;
      
  }

  ionViewDidEnter(){
    this.waterProvider.getAllSensorRecord(this.userDevice.device.mac).subscribe(data =>{
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
