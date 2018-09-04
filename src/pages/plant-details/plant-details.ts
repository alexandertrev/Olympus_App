import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileProvider } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-plant-details',
  templateUrl: 'plant-details.html',
})
export class PlantDetailsPage {
  plant : any;
  profile : any  = {
    profileName : "",
    sunNeeds: "",
    heatMin: "",
    heatMax: "",
    moistMin: "",
    moistMax: "",
  };
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private profileProvider: ProfileProvider
      ) {
    this.plant = navParams.get('item');
    console.log(this.plant)
    this.profileProvider.getSystemProfile(this.plant.plantName).subscribe(data => {
      console.log(data["answer"])
      if(data["success"]){
        this.profile = data["answer"];
      }
    }) ;

  }

  ionViewDidLoad() {
    
  }


}
