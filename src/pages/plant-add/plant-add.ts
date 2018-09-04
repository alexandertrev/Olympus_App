import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { FamilyProvider } from '../../providers/providers';
import { PlantsProvider } from '../../providers/providers';
@IonicPage()
@Component({
  selector: 'page-plant-add',
  templateUrl: 'plant-add.html',
})
export class PlantAddPage {

  @ViewChild('fileInput') fileInput;
  isReadyToSave: boolean;
  item: any;
  form: FormGroup;
  heat: any = {lower: 30, upper: 60};
  moist: any = {lower: 30, upper: 60};
  sun:any = 50;
  families: any;

  constructor(public navParams: NavParams, 
              public navCtrl: NavController, 
              public viewCtrl: ViewController, 
              formBuilder: FormBuilder, 
              public camera: Camera, 
              private familyProvider: FamilyProvider,
              private toastCtrl: ToastController,
              private plantProvider: PlantsProvider) {

    this.familyProvider.getFamily().subscribe(data => {
      if (data["success"]) {
        this.families = data["answer"];
      }
    });

    this.form = formBuilder.group({
      profilePic: ['', Validators.required],
      name: ['', Validators.required],
      plantFamily: ['', Validators.required],
      info: ['', Validators.required],
      sunNeeds: ['', Validators.required],
      heatMin:["30", Validators.required],
      heatMax:["60", Validators.required],
      moistMin:["30", Validators.required],
      moistMax:["60", Validators.required],
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      //console.log(this.form.valid)
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
    if(event.target.files[0])
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
    let newPlant = {
      pic: this.form.controls['profilePic'].value,
      name: this.form.controls['name'].value,
      plantFamily: this.form.controls['plantFamily'].value,
      info: this.form.controls['info'].value,
      sunNeeds: this.form.controls['sunNeeds'].value,
      heatMin: this.form.controls['heatMin'].value,
      heatMax: this.form.controls['heatMax'].value,
      moistMin :this.form.controls['moistMin'].value,
      moistMax: this.form.controls['moistMax'].value,
    }
    console.log(newPlant);
    this.plantProvider.addPlant(newPlant).subscribe(data => {
      console.log(data["success"])
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

  heatChanged(){
    this.form.controls["heatMax"].setValue(this.heat.upper);
    this.form.controls["heatMin"].setValue(this.heat.lower);
  }

  moistChanged(){
    this.form.controls["moistMax"].setValue(this.moist.upper);
    this.form.controls["moistMin"].setValue(this.moist.lower);
  }

  sunChanged(){
    this.form.controls["sunNeeds"].setValue(this.sun);
  }
}
