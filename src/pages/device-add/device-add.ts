import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { DeviceProvider } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-device-add',
  templateUrl: 'device-add.html',
})
export class DeviceAddPage {
  isReadyToSave: boolean;
  item: any;
  form: FormGroup;

  constructor(public navParams: NavParams, 
              public navCtrl: NavController, 
              public viewCtrl: ViewController, 
              formBuilder: FormBuilder, 
              public camera: Camera, 
              private deviceProvider: DeviceProvider,
              private toastCtrl: ToastController) {

    this.form = formBuilder.group({
      macAddress: ['', Validators.required],
      info: ['', Validators.required]
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  done() {
    if (!this.form.valid) { return; }
    let newDevice = {
      mac: this.form.controls['macAddress'].value,
      info: this.form.controls['info'].value,
    }
    console.log(newDevice);
    this.deviceProvider.addDevice(newDevice).subscribe(data => {
      console.log(data["message"])
      if (data["success"]) {
        let toast = this.toastCtrl.create({
          message: data["message"],
          duration: 3000,
          position: 'bottom',
          cssClass: 'toast-success'
        });
        toast.present();
      }
      else {
        let toast = this.toastCtrl.create({
          message: data["error"],
          duration: 3000,
          position: 'bottom',
          cssClass: 'toast-error'
        });
        toast.present();
      }
    });

    this.viewCtrl.dismiss(this.form.value);
  }


}
