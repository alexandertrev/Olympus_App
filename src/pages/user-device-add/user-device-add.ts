import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera } from '@ionic-native/camera';
import { ToastController, AlertController } from 'ionic-angular';
import { AuthProvider, UserDeviceProvider, ConfigProvider } from '../../providers/providers';
 

@IonicPage()
@Component({
  selector: 'page-user-device-add',
  templateUrl: 'user-device-add.html',
})
export class UserDeviceAddPage {
  networkIp: any = "192.168.1.137";
  deviceIpAddress: any;
  loader: any;
  form: FormGroup;
  submited:any = false;

  newDevice: any;
  mac: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public barcodeScanner: BarcodeScanner,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    private authProvider: AuthProvider,
    private deviceProvider: UserDeviceProvider,
    private toastController : ToastController,
    private alertCtrl: AlertController,
    private configControl: ConfigProvider,
    formBuilder: FormBuilder, 
    platform: Platform) {

    this.form = formBuilder.group({
      mac: ['', Validators.required],
      email: ['', Validators.required],
      link: [false]
    });
    this.authProvider.getEmail((email) => {
      this.form.controls["email"].setValue(email);
      this.form.controls["mac"].setValue("lol3"); // JUST FOR TESTING
      this.addDeviceToUser();                                  // JUST FOR TESTING
    });
  }
  addDeviceToUser(){
    this.deviceProvider.linkDeviceToUser(this.form.value).subscribe(data => {
      if(data["success"])
        {
          let toast = this.toastController.create({
            message: data["msg"],
            duration: 3000,
            position: 'bottom',
            cssClass: 'toast-success'
          });
          toast.present();
          this.newDevice = data['answer'].userDevice;
          this.mac = data['answer'].mac;
          this.submited = true;
        }
        else if(data['type']=='not found'){
          let toast = this.toastController.create({
            message: "Error. Try Again Later.",
            duration: 3000,
            position: 'bottom',
            cssClass: 'toast-error'
          });
          toast.present();
        }
        else {
          this.presentConfirm(data['msg']);
        }
    });
  }
  
  presentConfirm(who) {
    let alert = this.alertCtrl.create({
      title: 'Confirm link',
      message: 'This device already linked to '+who+' account, by accepting all the information about the device will be deleted',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.form.controls['mac'].setValue('');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.form.controls['link'].setValue(true);
            this.addDeviceToUser();
          }
        }
      ]
    });
    alert.present();
  }

  scanCode() {
    if (Camera['installed']()) {
      this.barcodeScanner.scan().then(barcodeData => {
        this.form.controls["mac"].setValue(barcodeData.text);
        this.addDeviceToUser();  
      })
    }
  }

  openConfigPage() {
    let addModal = this.modalCtrl.create('UserDeviceConfigPage', {item: this.newDevice, mac: this.mac});
    addModal.onDidDismiss(() => {
      this.viewCtrl.dismiss();
    })
    addModal.present();
  }

  configNow(){
    this.configControl.scanNetwork((answer) => {
      if(answer['success'])
        this.openConfigPage();
      else  
        alert(answer['msg']);
    });
  }

  configLater(){
    this.viewCtrl.dismiss();
  }

  cancel(){
    this.viewCtrl.dismiss();
  }
}
