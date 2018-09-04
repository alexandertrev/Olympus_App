import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController, Slides } from 'ionic-angular';
import { ToastController, AlertController } from 'ionic-angular';

import { SocketOne } from '../../app/app.module';
import { UserDeviceProvider, ConfigProvider, CommandProvider } from '../../providers/providers';
import { PlantsProvider, FamilyProvider, ProfileProvider } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-user-device-config',
  templateUrl: 'user-device-config.html',
})
export class UserDeviceConfigPage {
  @ViewChild('configSlider') configSlider: Slides;
  userDevice: any;
  mac: any;

  networks: any = [];

  wifiForm: FormGroup;
  plantForm: FormGroup;
  profileForm: FormGroup;

  nextDisabled: any = true;
  showPassword: any = false;
  wifiSubmitAtempt: any = false;
  searchingWifi: any = false;
  isDisabled: any = true;
  isLastSlide: any = false;

  deviceIpAddress: any;
  socket: SocketOne;

  families: any;
  plants: any;
  profiles: any;

  curPlant: any;
  curDefaultProfile: any;
  defaultProfile: any = {
    heatMin: 0,
    heatMax: 0,
    moistMin: 0,
    moistMax: 0,
    sunNeeds: 0
  };

  profile: any;
  pic: any;
  heat: any = { lower: 0, upper: 0 };
  moist: any = { lower: 0, upper: 0 };
  sun: any = 0;

  sliderStart: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastController: ToastController,
    private alertCtrl: AlertController,
    private configControl: ConfigProvider,
    private plantProvider: PlantsProvider,
    private familyProvider: FamilyProvider,
    private profileProvider: ProfileProvider,
    private commandProvider: CommandProvider,
    private userDeviceProvider: UserDeviceProvider,
    private formBuilder: FormBuilder,
    public viewCtrl: ViewController) {

    this.userDevice = navParams.get('item');
    this.mac = navParams.get('mac');

    this.familyProvider.getFamily().subscribe(data => {
      if (data["success"]) {
        this.families = data["answer"];
      }
    });

    this.profileProvider.getProfilesByEmail(this.userDevice.linkedTo).subscribe(data => {
      if (data["success"])
        this.profiles = data["answer"];
    })

    this.wifiForm = formBuilder.group({
      ssid: ['', Validators.required],
      password: [''],
    });

    this.plantForm = formBuilder.group({
      name: ['', Validators.required],
      plantFamily: ['', Validators.required],
      plantId: ['', Validators.required],
      location: [true],
    });

    this.profileForm = formBuilder.group({
      sunNeeds: ['', Validators.required],
      heatMin: ["", Validators.required],
      heatMax: ["", Validators.required],
      moistMin: ["", Validators.required],
      moistMax: ["", Validators.required],
    });

    // Watch the forms for changes
    this.plantForm.valueChanges.subscribe((v) => {
        this.nextDisabled = !this.plantForm.valid;
    });
    this.profileForm.valueChanges.subscribe((v) => {
      //console.log("Profile form valid? "+this.profileForm.valid)
      this.nextDisabled = !this.profileForm.valid;
      this.nextDisabled = !this.plantForm.valid;
    });
  }

  ionViewDidLoad() {
    this.sliderStart = 0;
    setTimeout(() => {
      this.configSlider.lockSwipes(true);
    }, 100);
  }

  // -------------------------------------------------------- SLIDE 0 WELCOME FUNCTIONS -----------------------------------------------
  findDevice() {
    this.configControl.scanNetwork((answer) => {
      if (answer['success']) {
        this.configSlider.lockSwipes(false);
        this.configSlider.slideNext();
        this.connectToSocket(answer['deviceIpAddress']);
        this.configSlider.lockSwipes(true);
      }
      else
        this.presentAlert('Message', answer['msg']);
    });
  }

  connectToSocket(deviceIp) {
    this.socket = new SocketOne(deviceIp);

    this.socket.on('error-emit', (data) => {
      this.wifiSubmitAtempt = false;
      this.presentAlert('Error!', data['err']);
    });
    this.socket.on('success-emit', (data) => {
      setTimeout(() => {
        //this.wifiChosen = false;
        this.wifiSubmitAtempt = false;
        this.wifiForm.controls['password'].setValue('');
        this.presentAlert('Success!', "You successfuly configured wifi settings.");
        this.configSlider.lockSwipes(false);
        this.configSlider.slideNext();
        this.configSlider.lockSwipes(true);
      }, 2000);
    });
    this.socket.on('networks-sent', (networks) => {
      this.networks = networks.networks;
      this.networksHandler(this.networks);
      setTimeout(() => {
        this.searchingWifi = false;
      }, 2000);
    });
    this.socket.on('connect', () => {
      this.getWifiNetworks();
    });
    this.socket.connect();
  }

  // -------------------------------------------------------- SLIDE 1 WIFI FUNCTIONS ------------------------------------------------
  getWifiNetworks() {
    this.searchingWifi = true;
    this.showPassword = false;
    this.wifiForm.controls["ssid"].setValue("");
    this.socket.emit('get-wifi-networks');
  }

  networksHandler(networks) {
    for (var i = 0; i < networks.length; i++) {
      if (networks[i].security != "Open")
        networks[i].security = "Secured";
    }
  }

  wifiConfirmConfig() {
    var str = this.wifiForm.controls["ssid"].value;
    var pos = str.lastIndexOf(':');
    var ssid = str.slice(0, pos);
    this.wifiSubmitAtempt = true;

    let network = {
      ssid: ssid,
      password: this.wifiForm.controls["password"].value
    }
    this.socket.emit("confirm-network", network);
  }

  wifiChanged() {
    var str = this.wifiForm.controls["ssid"].value;
    var pos = str.lastIndexOf(':');
    var length = str.length;
    var encryptions = str.slice(pos + 1, length);

    if (encryptions == "Secured")
      this.showPassword = true;
    else
      this.showPassword = false;
  }

  // -------------------------------------------------------- SLIDE 2 PLANT FUNCTIONS ----------------------------------------------
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
    this.findPlantInArray(this.plantForm.controls['plantId'].value);
    this.profileProvider.getSystemProfile(this.curPlant.plantName).subscribe(data => {
      if (data["success"]) {
        this.curDefaultProfile = data['answer'];
        this.curDefaultProfile.profileName = 'default';
        this.profile = '';
        this.updateCharts(this.defaultProfile);
        this.nullifyProfileForm();
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
  // -------------------------------------------------------- SLIDE 3 PROFILE FUNCTIONS ----------------------------------------------
  profileChanged() {
    if (this.profile.profileName == "default") {
      this.updateCharts(this.curDefaultProfile);
    }
    else {
      for (var i = 0; i < this.profiles.length; i++) {
        if (this.profiles[i]._id == this.profile._id) {
          this.updateCharts(this.profiles[i]);
        }
      }
    }
  }

  updateCharts(argProfile) {
    this.heat = { lower: argProfile.heatMin, upper: argProfile.heatMax };
    this.moist = { lower: argProfile.moistMin, upper: argProfile.moistMax };
    this.sun = argProfile.sunNeeds;
    this.heatChanged();
    this.moistChanged();
    this.sunChanged();
  }

  nullifyProfileForm(){
    this.profileForm.controls["heatMax"].setValue('');
    this.profileForm.controls["heatMin"].setValue('');
    this.profileForm.controls["moistMax"].setValue('');
    this.profileForm.controls["moistMin"].setValue('');
    this.profileForm.controls["sunNeeds"].setValue('');
  }

  heatChanged() {
    this.profileForm.controls["heatMax"].setValue(this.heat.upper);
    this.profileForm.controls["heatMin"].setValue(this.heat.lower);
  }

  moistChanged() {
    this.profileForm.controls["moistMax"].setValue(this.moist.upper);
    this.profileForm.controls["moistMin"].setValue(this.moist.lower);
  }

  sunChanged() {
    this.profileForm.controls["sunNeeds"].setValue(this.sun);
  }

  // -------------------------------------------------------- OTHER FUNCTIONS -------------------------------------------------------
  slideChanged(){
    this.isLastSlide= this.configSlider.isEnd();
  }

  next() {
    this.configSlider.lockSwipes(false);
    this.configSlider.slideNext();
    this.configSlider.lockSwipes(true);

    if(this.configSlider.getActiveIndex() == 2)
      this.nextDisabled = !this.plantForm.valid;
    else if(this.configSlider.getActiveIndex() == 3)
    {
      this.nextDisabled = !this.profileForm.valid;
    }
  }

  prev() {
    if (this.configSlider.getActiveIndex() == 2) {
      this.nextDisabled = true;
      this.presentConfirmExit();
    }
    else if(this.configSlider.getActiveIndex() == 1){
      this.nextDisabled = true;
      this.configSlider.lockSwipes(false);
      this.configSlider.slidePrev();
      this.configSlider.lockSwipes(true);
    }
    else if (this.configSlider.getActiveIndex() == 0){
      this.viewCtrl.dismiss();
    }
    else {
      this.nextDisabled = false;
      this.configSlider.lockSwipes(false);
      this.configSlider.slidePrev();
      this.configSlider.lockSwipes(true);
    }
  }

  finish(){
    let configuredDevice = {
      mac: this.mac,
      device: this.userDevice.device,
      plantId: this.plantForm.controls['plantId'].value,
      name: this.plantForm.controls['name'].value,
      location: '',
      pic: '',
      sunNeeds: this.profileForm.controls['sunNeeds'].value,
      heatMin: this.profileForm.controls['heatMin'].value,
      heatMax: this.profileForm.controls['heatMax'].value,
      moistMin: this.profileForm.controls['moistMin'].value,
      moistMax: this.profileForm.controls['moistMax'].value,
    }

    if(this.plantForm.controls['location'].value)
      configuredDevice.location = 'Inside';
    else
      configuredDevice.location = 'Outside';

    if(this.pic == 'plant_default')
      configuredDevice.pic = this.curPlant.pic;

    this.presentConfirmSave(configuredDevice);  
  }

  presentAlert(title, msg) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['Ok']
    });

    alert.present();
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
              if(data["success"])
                {
                  let toast = this.toastController.create({
                    message: data["msg"],
                    duration: 3000,
                    position: 'bottom',
                    cssClass: 'toast-success'
                  });
                  toast.present();
                  this.viewCtrl.dismiss();
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

  presentConfirmExit() {
    let alert = this.alertCtrl.create({
      title: 'Confirm Exit',
      message: 'If you press back you will go the the beginning of the configuration',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.nextDisabled = !this.plantForm.valid;
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.configSlider.lockSwipes(false);
            this.configSlider.slideTo(0, 500);
            this.configSlider.lockSwipes(true);
          }
        }
      ]
    });
    alert.present();
  }
}