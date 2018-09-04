import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { FamilyProvider } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-family-add',
  templateUrl: 'family-add.html',
})
export class FamilyAddPage {

  @ViewChild('fileInput') fileInput;
  isReadyToSave: boolean;
  item: any;
  form: FormGroup;

  constructor(public navParams: NavParams,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    formBuilder: FormBuilder,
    public camera: Camera,
    private familyProvider: FamilyProvider,
    private toastCtrl: ToastController) {

    this.form = formBuilder.group({
      profilePic: ['', Validators.required],
      name: ['', Validators.required],
      description: ['']
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
        this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onabort = () => {
      reader.abort;
    };
    reader.onload = (readerEvent) => {
      let imageData = (readerEvent.target as any).result;
      this.form.patchValue({ 'profilePic': imageData });
    };
    if (event.target.files[0])
      reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return 'url(' + this.form.controls['profilePic'].value + ')'
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  done() {
    if (!this.form.valid) { return; }
    let newFamily = {
      name: this.form.controls['name'].value,
      description: this.form.controls['description'].value,
      pic: this.form.controls['profilePic'].value
    }
    this.familyProvider.addFamily(newFamily).subscribe(data => {
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
