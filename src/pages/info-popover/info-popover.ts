import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-info-popover',
  templateUrl: 'info-popover.html',
})
export class InfoPopoverPage {

  message: any;
  fixDoors: any;
  fixLamp: any;

  constructor(
    public navCtrl: NavController, 
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public events: Events) {
      this.message = this.navParams.get('message');
      this.fixDoors = this.navParams.get('fixDoors');
      this.fixLamp = this.navParams.get('fixLamp');
  }

  changeDoorsFix(){
    console.log('change state '+this.fixDoors)
    this.viewCtrl.dismiss({type: 'doors', status: this.fixDoors});
  }

  changeLampFix(){
    console.log('change state '+this.fixLamp)
    this.viewCtrl.dismiss({type: 'lamp', status: this.fixLamp});
  }

  getItems(e){
    console.log(e)
    this.events.publish('search-emmited', e.value);
  }
}
