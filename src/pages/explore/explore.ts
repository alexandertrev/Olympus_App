import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, PopoverController } from 'ionic-angular';
import { AuthProvider, FamilyProvider, PlantsProvider, MessageProvider } from '../../providers/providers';
import { Item } from '../../models/item';
import { InfoPopoverPage } from '../info-popover/info-popover';
import { Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-explore',
  templateUrl: 'explore.html',
})
export class ExplorePage {
  exploreType: any = 'family';
  showAdd: any = false;
  gotServerAnswer:any = false;
  gotErrorFromServer: any = false;

  families: Item[] = [];
  plants: Item[] = [];
  searchField: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private familyProvider: FamilyProvider,
    public modalCtrl: ModalController,
    private auth: AuthProvider,
    private messageProvider: MessageProvider,
    public popoverCtrl: PopoverController,
    public events: Events,
    private plantProvider: PlantsProvider) {

      this.auth.isAdmin((isAdmin) => {
        if (isAdmin)
          this.showAdd = true;
        else
          this.showAdd = false;
      })

      events.subscribe('search-emmited', (search) => {
        console.log(search)
        this.searchField = search
      });
  }

  ionViewDidEnter() {
    this.getFamilies();
    this.getPlants();
  }

  getFamilies(){
    this.familyProvider.getFamily().subscribe(data => {
      if (data["success"]) {
        this.families = data["answer"];
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

  getPlants() {
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

  openFamily(item: Item) {
    this.navCtrl.push('FamilyDetailsPage', {
      item: item
    });
  }
  openPlant(item: Item) {
    this.navCtrl.push('PlantDetailsPage', {
      item: item
    });
  }
  
  addItem() {
    if(this.exploreType == 'family'){
      let addModal = this.modalCtrl.create('FamilyAddPage');
      addModal.onDidDismiss(() => {
        this.getFamilies();
      })
      addModal.present();
    }
    else{
      let addModal = this.modalCtrl.create('PlantAddPage');
      addModal.onDidDismiss(() => {
        this.getPlants();
      })
      addModal.present();
    }
    
  }

  search(ev: UIEvent) {
    let message = 'search';
    
    let popover = this.popoverCtrl.create(InfoPopoverPage, {message: message}, {cssClass: 'my-popover2'});
    popover.present({
      ev: ev
    });
    popover.onDidDismiss(data => {
  
    });
  }

  onChange(){
    this.searchField = '';
  }
}
