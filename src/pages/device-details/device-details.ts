import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-device-details',
  templateUrl: 'device-details.html',
})
export class DeviceDetailsPage {
  item : any;
  qrData : any;
  createdCode : any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.item = navParams.get('item');
    this.qrData = this.item.mac;
    console.log(this.item)
  }

  createCode(){
    this.createdCode = this.qrData;
  }
}
