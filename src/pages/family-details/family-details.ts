import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-family-details',
  templateUrl: 'family-details.html',
})
export class FamilyDetailsPage {
  item : any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.item = navParams.get('item');
  }

  ionViewDidLoad() {
    
  }

  openPlantsList(){
    this.navCtrl.push('PlantListPage', {
      familyName: this.item.familyName
    });
  }
}
