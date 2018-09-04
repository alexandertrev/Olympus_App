import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Slides, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigProvider } from '../../providers/providers';
import { SocketOne } from '../../app/app.module';

@IonicPage()
@Component({
  selector: 'page-settings-device',
  templateUrl: 'settings-device.html',
})
export class SettingsDevicePage {
  @ViewChild('configSlider') configSlider: Slides;
  userDevice: any;
  wifiForm: FormGroup;
  socket: SocketOne;

  showPassword: any = false;
  wifiSubmitAtempt: any = false;
  searchingWifi: any = false;
  networks: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    private configControl: ConfigProvider,
    private alertCtrl: AlertController, ) {

    this.userDevice = this.navParams.get('userDevice');
    this.wifiForm = formBuilder.group({
      ssid: ['', Validators.required],
      password: [''],
    });
  }

  ionViewDidEnter() {
    this.configSlider.lockSwipes(true);
  }

  // -------------------------------------------------------- SLIDE 0 WELCOME FUNCTIONS -----------------------------------------------
  findDevice() {
    this.configControl.scanNetwork((answer) => {
      //console.log("Answer: " + answer['success'])
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
        this.viewCtrl.dismiss();
      }, 2000);
    });
    this.socket.on('networks-sent', (networks) => {
      //console.log("Network :" + networks.networks)
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

  cancel() {
    this.viewCtrl.dismiss();
  }

  presentAlert(title, msg) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['Ok']
    });

    alert.present();
  }
}
