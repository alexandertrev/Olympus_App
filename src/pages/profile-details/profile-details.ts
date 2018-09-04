import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-profile-details',
  templateUrl: 'profile-details.html',
})
export class ProfileDetailsPage {
  profile: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.profile = navParams.get('item');
    console.log(this.profile)
  }

  ionViewDidLoad() {
  }

}
