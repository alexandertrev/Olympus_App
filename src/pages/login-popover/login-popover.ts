import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-login-popover',
  templateUrl: 'login-popover.html',
})
export class LoginPopoverPage {
  cur_user: any;
  isAdmin: any;
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public events: Events,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController) {

    this.cur_user = this.navParams.get('cur_user');
    this.isAdmin = this.navParams.get('isAdmin');
  }

  disconnect(){
    this.viewCtrl.dismiss();
    this.events.publish('dc-emmited');
  }

  openDeviceList(){
    let addModal = this.modalCtrl.create('DeviceListPage');
    addModal.onDidDismiss(() => {
      this.viewCtrl.dismiss();
    });
    addModal.present();
  }

}
