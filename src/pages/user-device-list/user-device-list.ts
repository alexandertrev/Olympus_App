import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, AlertController } from 'ionic-angular';
import { Item } from '../../models/item';
import { UserDeviceProvider, AuthProvider, MessageProvider } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-user-device-list',
  templateUrl: 'user-device-list.html',
})
export class UserDeviceListPage {
  devices: Item[] = [];
  email: any;
  gotServerAnswer:any = false;
  gotErrorFromServer: any = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private deviceProvider: UserDeviceProvider,
    private auth: AuthProvider,
    private alertCtrl: AlertController,
    private toastController : ToastController,
    private messageProvider: MessageProvider) {

  }

  ionViewDidEnter() {
    this.auth.getEmail((email) => {
      this.email = email;
      this.deviceProvider.getUserDevices(this.email).subscribe(data => {
        if (data["success"]) {
          this.devices = data["answer"];
          this.gotServerAnswer = true;
          this.gotErrorFromServer = false;
        }
      },
      (err) => {
        this.messageProvider.presentAlertOk('Error!', 'Cant reach server try a little bit later')
        this.gotServerAnswer = true;
        this.gotErrorFromServer = true;
      });
    })
  }

  addItem() {
    let addModal = this.modalCtrl.create('UserDeviceAddPage');
    addModal.onDidDismiss(() => {
      this.deviceProvider.getUserDevices(this.email).subscribe(data => {
        if(data["success"])
          this.devices = data["answer"];
      })
    })
    addModal.present();
  }

  deleteItem(item,slidingItem) {
    this.presentConfirmDelete(item, slidingItem);
  }

  presentConfirmDelete(item, slidingItem) {
    let alert = this.alertCtrl.create({
      title: 'Confirm delete',
      message: 'Are you sure you want to delete plant? all information will be erased',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            slidingItem.close();
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.deviceProvider.unlink(item.device).subscribe(data => {
              if(data['success']){
                let message = data["msg"]
                this.deviceProvider.getUserDevices(this.email).subscribe(data => {
                  if (data["success"]) {
                    this.devices = data["answer"];
                    let toast = this.toastController.create({
                      message: message,
                      duration: 3000,
                      position: 'bottom',
                      cssClass: 'toast-success'
                    });
                    toast.present();
                  }
                });
              }
              else{
                let toast = this.toastController.create({
                  message: "Error. Try Again Later.",
                  duration: 3000,
                  position: 'bottom',
                  cssClass: 'toast-error'
                });
                toast.present();
              }
            });
          }
        }
      ]
    });
    alert.present();
  }

  openItem(item: Item) {
    
    if(item.firstConfig){
      let addModal = this.modalCtrl.create('UserDeviceTabsPage',{item: item});
      addModal.present();
      // this.navCtrl.push('UserDeviceDetailsPage', {
      //   item: item
      // });
    }
    else{
      let addModal = this.modalCtrl.create('UserDeviceConfigPage',{item: item, mac: item.device.mac});
      addModal.onDidDismiss(() => {
        this.deviceProvider.getUserDevices(this.email).subscribe(data => {
          if(data["success"])
            this.devices = data["answer"];
        });
      });
      addModal.present();
    }
    
  }

  doRefresh(refresher) {

    setTimeout(() => {
      this.deviceProvider.getUserDevices(this.email).subscribe(data => {
        if(data["success"])
          this.devices = data["answer"];
      })
      refresher.complete();
    }, 2000);
  }
}
