import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AuthProvider, ProfileProvider, MessageProvider } from '../../providers/providers';
import { Item } from '../../models/item';

@IonicPage()
@Component({
  selector: 'page-profile-list',
  templateUrl: 'profile-list.html',
})
export class ProfileListPage {

  email: any;
  profiles: Item[] = [];
  gotServerAnswer:any = false;
  gotErrorFromServer: any = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private authProvider: AuthProvider,
    private profileProvider: ProfileProvider,
    private messageProvider: MessageProvider) {

    this.authProvider.getEmail((email) => {
      this.email = email;
    });
  }

  ionViewDidEnter() {
    this.profileProvider.getProfilesByEmail(this.email).subscribe(data => {
      if(data["success"])
        this.profiles = data["answer"];
        this.gotServerAnswer = true;
        this.gotErrorFromServer = false;
    },
    (err) => {
      this.messageProvider.presentAlertOk('Error!', 'Cant reach server try a little bit later')
      this.gotServerAnswer = true;
      this.gotErrorFromServer = true;
    });
  }

  addItem() {
    let addModal = this.modalCtrl.create('ProfileAddPage');
    addModal.onDidDismiss(() => {
      this.profileProvider.getProfilesByEmail(this.email).subscribe(data => {
        if(data["success"])
          this.profiles = data["answer"];
      })
    })
    addModal.present();
  }

  openItem(item: Item) {
    this.navCtrl.push('ProfileDetailsPage', {
      item: item
    });
  }

}
