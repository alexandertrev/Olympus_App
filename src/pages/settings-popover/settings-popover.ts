import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-settings-popover',
  templateUrl: 'settings-popover.html',
})
export class SettingsPopoverPage {

  userDevice: any;
  fix_pump: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController,
    public modalCtrl: ModalController) {

    this.userDevice = this.navParams.get('userDevice');
    this.fix_pump = !this.userDevice.fix_pump;
    console.log('Auto watering: '+this.fix_pump)
  }

  openProfileSettings(){
    let addModal = this.modalCtrl.create('SettingsProfilePage', {userDevice: this.userDevice});
    addModal.onDidDismiss(data => {
      this.viewCtrl.dismiss({type: 'profile', data: data});
    });
    addModal.present();
  }

  openDeviceSettings(){
    let addModal = this.modalCtrl.create('SettingsDevicePage', {userDevice: this.userDevice});
    addModal.onDidDismiss(() => {
      this.viewCtrl.dismiss();
    });
    addModal.present();
  }

  changeFixPump(){
    this.viewCtrl.dismiss({type:'pump', status: !this.fix_pump});
  }
}
