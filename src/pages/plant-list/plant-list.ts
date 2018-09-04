import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AuthProvider, PlantsProvider, MessageProvider } from '../../providers/providers';
import { Item } from '../../models/item';

@IonicPage()
@Component({
  selector: 'page-plant-list',
  templateUrl: 'plant-list.html',
})
export class PlantListPage {

  familyName: any;
  plants: Item[] = [];
  searchField: any;
  showAdd: any = false;
  gotServerAnswer:any = false;
  gotErrorFromServer: any = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private plantProvider: PlantsProvider,
    public modalCtrl: ModalController,
    private auth: AuthProvider,
    private messageProvider: MessageProvider) {

    this.familyName = navParams.get('familyName');

    this.auth.isAdmin((isAdmin) =>{
      if(isAdmin)
        this.showAdd = true;
      else
        this.showAdd = false;
    })

  }

  ionViewDidEnter() {
    this.getPlants();
  }

  getPlants() {
    if (this.familyName) {
      this.plantProvider.getPlantsByFamily(this.familyName).subscribe(data => {
        if (data["success"]) {
          this.plants = data["answer"];
          this.gotServerAnswer = true;
          this.gotErrorFromServer = false;
        }
      },
      (err) => {
        this.messageProvider.presentAlertOk('Error!', 'Cant reach server try a little bit later')
        this.gotServerAnswer = true;
        this.gotErrorFromServer = true;
      });
    }
    else {
      this.plantProvider.getPlants().subscribe(data => {
        if (data["success"]) {
          this.plants = data["answer"];
          this.gotServerAnswer = true;
          this.gotErrorFromServer = false;
        }
      },
      (err) => {
        this.messageProvider.presentAlertOk('Error!', 'Cant reach server try a little bit later')
        this.gotServerAnswer = true;
        this.gotErrorFromServer = true;
      });
    }
  }

  addItem() {
    let addModal = this.modalCtrl.create('PlantAddPage');
    addModal.onDidDismiss(() => {
      this.getPlants();
    })
    addModal.present();
  }

  openItem(item: Item) {
    this.navCtrl.push('PlantDetailsPage', {
      item: item
    });
  }

}
