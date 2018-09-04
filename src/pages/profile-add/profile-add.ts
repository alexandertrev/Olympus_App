import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { FamilyProvider, PlantsProvider, ProfileProvider, AuthProvider } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-profile-add',
  templateUrl: 'profile-add.html',
})
export class ProfileAddPage {

  @ViewChild('fileInput') fileInput;
  isReadyToSave: boolean;

  form: FormGroup;
  formCasual: FormGroup;

  heat: any = { lower: 30, upper: 60 };
  moist: any = { lower: 30, upper: 60 };
  sun: any = 50;

  families: any;
  plants: any;
  email: any;
  profileType: any = "Casual";
  

  constructor(public navParams: NavParams,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    formBuilder: FormBuilder,
    public camera: Camera,
    private familyProvider: FamilyProvider,
    private toastCtrl: ToastController,
    private plantProvider: PlantsProvider,
    private profileProvider: ProfileProvider,
    private authProvider: AuthProvider) {

    this.authProvider.getEmail((email) => {
      this.email = email;
      console.log(email);
    });
    this.familyProvider.getFamily().subscribe(data => {
      if (data["success"]) {
        this.families = data["answer"];
      }
    });
    
    this.form = formBuilder.group({
      profilePic: [''],
      name: ['', Validators.required],
      plantFamily: ['', Validators.required],
      plantId: ['', Validators.required],
      sunNeeds: ['', Validators.required],
      heatMin: ["10", Validators.required],
      heatMax: ["30", Validators.required],
      moistMin: ["30", Validators.required],
      moistMax: ["60", Validators.required],
    });

    this.formCasual = formBuilder.group({
      profilePic: [''],
      name: ['', Validators.required],
      plantFamily: ['', Validators.required],
      plantId: ['', Validators.required],
      sunNeeds: ['', Validators.required],
      soilNeeds: ['', Validators.required],
    });

    // Watch the forms for changes
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
    this.formCasual.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.formCasual.valid;
    });
  }
  //-------------------------------------------- Casual form functions---------------------------
  getPictureCasual() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
        this.formCasual.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImageCasual(event) {
    let reader = new FileReader();
    reader.onabort = () => {
      reader.abort;
    };
    reader.onload = (readerEvent) => {
      let imageData = (readerEvent.target as any).result;
      this.formCasual.patchValue({ 'profilePic': imageData });
    };
    if (event.target.files[0])
      reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyleCasual() {
    return 'url(' + this.formCasual.controls['profilePic'].value + ')'
  }

  //-------------------------------------------- Advanced form functions---------------------------
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

  heatChanged() {
    this.form.controls["heatMax"].setValue(this.heat.upper);
    this.form.controls["heatMin"].setValue(this.heat.lower);
  }

  moistChanged() {
    this.form.controls["moistMax"].setValue(this.moist.upper);
    this.form.controls["moistMin"].setValue(this.moist.lower);
  }

  sunChanged() {
    this.form.controls["sunNeeds"].setValue(this.sun);
  }
  //-------------------------------------------- Other functions ---------------------------
  familyChanged(event) {
    this.plantProvider.getPlantsByFamily(event).subscribe(data => {
      if (data["success"]) {
        this.plants = data["answer"];
      }
    });
  }
  cancel() {
    this.viewCtrl.dismiss();
  }

  done() {
    if (!this.form.valid && !this.formCasual.valid) { return; }

    let newProfile;
    if (this.profileType == "Advanced") {
      newProfile = {
        name: this.form.controls['name'].value,
        email: this.email,
        plant: this.form.controls['plantId'].value,
        sunNeeds: this.form.controls['sunNeeds'].value,
        heatMin: this.form.controls['heatMin'].value,
        heatMax: this.form.controls['heatMax'].value,
        moistMin: this.form.controls['moistMin'].value,
        moistMax: this.form.controls['moistMax'].value,
      }
    }
    else // profileType - Casual
    {
      newProfile = {
        name: this.formCasual.controls['name'].value,
        email: this.email,
        plant: this.formCasual.controls['plantId'].value,
        sunNeeds: this.formCasual.controls['sunNeeds'].value,
        heatMin: 20,
        heatMax: 40,
        moistMin: this.soilAdvancedConvert("min", this.form.controls['moistMin'].value),
        moistMax: this.soilAdvancedConvert("max", this.form.controls['moistMin'].value),
      }
    }
    console.log(newProfile);
    this.profileProvider.addProfile(newProfile).subscribe(data => {
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
  onChange() {
    if (this.profileType == "Casual")
      this.isReadyToSave = this.formCasual.valid;
    else
      this.isReadyToSave = this.form.valid;
  }

  soilAdvancedConvert(minOrMax, val) {
    if (val == "Dry") {
      if (minOrMax == "min")
        return 0;
      else
        return 30;
    }
    else if (val == "wellDrained") {
      if (minOrMax == "min")
        return 31;
      else
        return 60;
    }
    else {
      if (minOrMax == "min")
        return 61;
      else
        return 90;
    }
  }

  sunAdvancedConvert(val) {
    if (val == "Full") {
      return 100;
    }
    else if (val == "Partial") {
      return 60;
    }
    else if (val == "Part_sun") {
      return 85;
    }
    else
      return 40;
  }
}
