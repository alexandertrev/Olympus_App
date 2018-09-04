import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { Item } from '../../models/item';
import { DeviceProvider } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-device-list',
  templateUrl: 'device-list.html',
})

export class DeviceListPage {
  items: Item[] = [];
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private deviceProvider: DeviceProvider,
              public modalCtrl: ModalController,
              public viewCtrl: ViewController, ) {
  }

  ionViewDidLoad() {
    this.deviceProvider.getDevices().subscribe(data => {
      console.log(data["answer"])
      if (data["success"]) {
        for (let item of data["answer"]) {
          this.items.push(new Item(item));
        }
      }
    }); 
  }

  addItem() {
    let addModal = this.modalCtrl.create('DeviceAddPage');
    addModal.onDidDismiss(() => {
      this.deviceProvider.getDevices().subscribe(data => {
        if(data["success"])
          this.items = data["answer"];
      })
    })
    addModal.present();
  }

  deleteItem(item) {
    this.deviceProvider.removeDevice(item.mac).subscribe(data => {
      if(data["success"]){
        this.deviceProvider.getDevices().subscribe(data => {
          if(data["success"])
            this.items = data["answer"];
        })
      }
    })
  }
  
  openItem(item: Item) {
    this.navCtrl.push('DeviceDetailsPage', {
      item: item
    });
  }
  
  cancel() {
    this.viewCtrl.dismiss();
  }
}
