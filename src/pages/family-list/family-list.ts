import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Item } from '../../models/item';
import { AuthProvider, FamilyProvider, MessageProvider } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-family-list',
  templateUrl: 'family-list.html',
})
export class FamilyListPage {
  items: Item[] = [];
  searchField: any;
  showAdd: any = false;
  gotServerAnswer:any = false;
  gotErrorFromServer: any = false;
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private familyProvider: FamilyProvider,
    public modalCtrl: ModalController,
    private auth: AuthProvider,
    private messageProvider: MessageProvider) {

    this.auth.isAdmin((isAdmin) => {
      if (isAdmin)
        this.showAdd = true;
      else
        this.showAdd = false;
    })

  }

  ionViewDidEnter() {
    this.familyProvider.getFamily().subscribe(data => {
      if (data["success"]) {
        this.items = data["answer"];
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

  addItem() {
    let addModal = this.modalCtrl.create('FamilyAddPage');
    addModal.onDidDismiss(() => {
      this.familyProvider.getFamily().subscribe(data => {
        if (data["success"])
          this.items = data["answer"];
      })
    })
    addModal.present();
  }

  deleteItem(item) {
    //this.items.delete(item);
  }

  openItem(item: Item) {
    this.navCtrl.push('FamilyDetailsPage', {
      item: item
    });
  }

}
