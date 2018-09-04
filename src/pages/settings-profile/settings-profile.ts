import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController } from 'ionic-angular';
import { UserDeviceProvider, PlantsProvider, FamilyProvider, ProfileProvider } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-settings-profile',
  templateUrl: 'settings-profile.html',
})
export class SettingsProfilePage {
  userDevice: any;
  plantForm: FormGroup;
  curDefaultProfile: any;
  curProfile: any;
  curPlant: any;
  isDisabled:any = false;
  
  families: any;
  plants: any;
  profiles: any;

  location:any;
  profile:any;
  heat: any = { lower: 0, upper: 0 };
  moist: any = { lower: 0, upper: 0 };
  sun: any;

  // ------------------------------------------- CONSTRUCTOR --------------------------------------------------------------------------------------------------------------->
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private plantProvider: PlantsProvider,
    private familyProvider: FamilyProvider,
    private profileProvider: ProfileProvider,
    private toastController: ToastController,
    private userDeviceProvider: UserDeviceProvider) {

    this.userDevice = this.navParams.get('userDevice');
    console.log(this.userDevice) // TESTING
    if(this.userDevice.location == 'Inside')
      this.location = true;
    else
      this.location = false;

    this.curProfile = {
      profileName: 'current',
      sunNeeds: this.userDevice.sunNeeds,
      heatMin: this.userDevice.heatMin,
      heatMax: this.userDevice.heatMax,
      moistMin: this.userDevice.moistMin,
      moistMax: this.userDevice.moistMax
    }

    this.updateCharts(this.curProfile);
    this.profile = this.curProfile;

    this.profileProvider.getProfilesByEmail(this.userDevice.linkedTo).subscribe(data => {
      if (data["success"])
        this.profiles = data["answer"];
    })
    this.familyProvider.getFamily().subscribe(data => {
      if (data["success"]) {
        this.families = data["answer"];
      }
    });
    this.plantProvider.getPlantsByFamily(this.userDevice.plant.plantFamily).subscribe(data => {
      if (data["success"]) {
        this.plants = data["answer"];
        this.plantForm.controls['plantId'].setValue(this.userDevice.plant._id);
        this.onPlantChange();
      }
    });
    this.plantForm = formBuilder.group({
      name: [this.userDevice.name, Validators.required],
      plantFamily: [this.userDevice.plant.plantFamily, Validators.required],
      plantId: [this.userDevice.plant._id, Validators.required],
      location: [this.location],
    });

    console.log("curProfile: "+this.curProfile)
  }
  // ------------------------------------------- CONSTRUCTOR END------------------------------------------------------------------------------------------------------------>
  profileChanged() {
    if (this.profile.profileName == "default") {
      this.updateCharts(this.curDefaultProfile);
    }
    else if(this.profile.profileName == "current"){
      this.updateCharts(this.curProfile);
    }
    else {
      for (var i = 0; i < this.profiles.length; i++) {
        if (this.profiles[i]._id == this.profile._id) {
          this.updateCharts(this.profiles[i]);
        }
      }
    }
  }

  familyChanged(event) {
    this.plantProvider.getPlantsByFamily(event).subscribe(data => {
      if (data["success"]) {
        this.plants = data["answer"];
        this.plantForm.controls['plantId'].setValue('');
        this.curPlant = null;
      }
    });
  }

  onPlantChange() {
    console.log("in plant change")
    this.findPlantInArray(this.plantForm.controls['plantId'].value);
    this.profileProvider.getSystemProfile(this.curPlant.plantName).subscribe(data => {
      if (data["success"]) {
        this.curDefaultProfile = data['answer'];
        this.curDefaultProfile.profileName = 'default';
      }
    });
  }

  findPlantInArray(plantId){
    for(let i=0;i<this.plants.length;i++){
      if(this.plants[i]._id == plantId)
        this.curPlant = this.plants[i]; 
    }
    return null;
  }
  updateCharts(argProfile) {
    this.heat = { lower: argProfile.heatMin, upper: argProfile.heatMax };
    this.moist = { lower: argProfile.moistMin, upper: argProfile.moistMax };
    this.sun = argProfile.sunNeeds;
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  done(){
    let configuredDevice = {
      mac: this.userDevice.device.mac,
      device: this.userDevice.device,
      plantId: this.plantForm.controls['plantId'].value,
      name: this.plantForm.controls['name'].value,
      location: '',
      pic: this.userDevice.pic,
      sunNeeds: this.sun,
      heatMin: this.heat.lower,
      heatMax: this.heat.upper,
      moistMin: this.moist.lower,
      moistMax: this.moist.upper,
    }

    if(this.plantForm.controls['location'].value)
      configuredDevice.location = 'Inside';
    else
      configuredDevice.location = 'Outside';

    // if(this.pic == 'plant_default')
    //   configuredDevice.pic = this.curPlant.pic;

    this.presentConfirmSave(configuredDevice);  
  }

  presentConfirmSave(configuredDevice) {
    let alert = this.alertCtrl.create({
      title: 'Confirm Configuration',
      message: 'Are you sure you want to finish device configuration?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: () => {
            this.userDeviceProvider.configDevice(configuredDevice).subscribe(data => {
              console.log("success:" + data["success"])               // JUST FOR TESTING
              if(data["success"])
                {
                  let toast = this.toastController.create({
                    message: data["msg"],
                    duration: 3000,
                    position: 'bottom',
                    cssClass: 'toast-success'
                  });
                  toast.present();
                  this.viewCtrl.dismiss({success: true});
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
}
