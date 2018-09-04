import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ModalController, ViewController } from 'ionic-angular';
import { SensorRecordProvider, UserDeviceProvider, CommandProvider, WaterRecordProvider } from '../../providers/providers';
import { SettingsPopoverPage } from '../settings-popover/settings-popover';
import { InfoPopoverPage } from '../info-popover/info-popover';
import { MessageProvider } from '../../providers/providers';
import {Subscription} from "rxjs";
import {TimerObservable} from "rxjs/observable/TimerObservable";

@IonicPage()
@Component({
  selector: 'page-user-device-details',
  templateUrl: 'user-device-details.html',
})
export class UserDeviceDetailsPage {
  @ViewChild('waterBtn') btn;
  @ViewChild('waterIcon') waterIcon;
  userDevice: any = {};
  lastSensorRecord: any;
  lastWaterRecord: any;
  deviceStatus: any;

  water_lvl_status: any;
  heat_status: any;
  moist_status: any;
  sun_status: any;

  waterNowInterval: any = 12000;
  isWateringInProgress: any = false;

  subscription: Subscription;
  blue: any = 100;
  white: any = 50;
  page:any;
  
  constructor(
    private rd: Renderer2,
    public navParams: NavParams,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    private commandProvider: CommandProvider,
    private messageProvider: MessageProvider,
    private sensorProvider: SensorRecordProvider,
    private userDeviceProvider: UserDeviceProvider,
    private waterRecordProvider: WaterRecordProvider) {

    this.userDevice = navParams.get('item');
    
  }
  ionViewDidEnter() {
    this.userDeviceProvider.getUserDeviceByDeviceId(this.userDevice.device).subscribe(data => {
      if(data['success']){
        this.userDevice = data['answer'];
        this.updateDeviceStatus();
        this.updateStatsColor();
      }
    });
    this.sensorProvider.getLastSensorRecord(this.userDevice.device.mac).subscribe(data => {
      if (data['success'] && data['answer'][0]) {
        this.lastSensorRecord = data['answer'][0];
        this.updateStatsColor();
      }
    });
    this.waterRecordProvider.getLastSensorRecord(this.userDevice.device.mac).subscribe(data => {
      if (data['success'] && data['answer'][0]) {
        this.lastWaterRecord = data['answer'][0].Date;
      }
    });
  }

  updateDeviceStatus(){
    var timeNow = this.getTimeNow();
    var timeLastOnline = new Date(this.userDevice.device.lastOnline);

    console.log(timeNow)
    console.log(timeLastOnline)
    
    this.getTimeDiff(timeNow,timeLastOnline);
  }

  getTimeNow(){
    Date.prototype.toISOString = function() {
      var tzo = -this.getTimezoneOffset(),
          dif = tzo >= 0 ? '+' : '-',
          pad = function(num) {
              var norm = Math.floor(Math.abs(num));
              return (norm < 10 ? '0' : '') + norm;
          };
      return this.getFullYear() +
          '-' + pad(this.getMonth() + 1) +
          '-' + pad(this.getDate()) +
          'T' + pad(this.getHours()) +
          ':' + pad(this.getMinutes()) +
          ':' + pad(this.getSeconds()) +
          dif + pad(tzo / 60) +
          ':' + pad(tzo % 60);
    }
  
    var dt = new Date();
    return dt
  }

  getTimeDiff(timeNow, timeLastOnline){
    var diff = timeNow - timeLastOnline;

    if (diff > 60e3) {
      console.log(Math.floor(diff / 60e3), 'minutes ago');
      this.deviceStatus = "Disconnected";
    }
      
    else {
      console.log(Math.floor(diff / 1e3), 'seconds ago');
      this.deviceStatus = "Connected";
    }
      
  }
  
  updateStatsColor() {
    if(!this.lastSensorRecord){
      return;
    }
    let sunDeviation10 = this.userDevice.sunNeeds * 0.1;
    let heatDeviationMin10 = this.userDevice.heatMin * 0.1;
    let heatDeviationMax10 = this.userDevice.heatMax * 0.1;
    let moistDeviationMin10 = this.userDevice.moistMin * 0.1;
    let moistDeviationMax10 = this.userDevice.moistMax * 0.1;

    let sunDeviation20 = this.userDevice.sunNeeds * 0.3;
    let heatDeviationMin20 = this.userDevice.heatMin * 0.3;
    let heatDeviationMax20 = this.userDevice.heatMax * 0.3;
    let moistDeviationMin20 = this.userDevice.moistMin * 0.3;
    let moistDeviationMax20 = this.userDevice.moistMax * 0.3;

    this.water_lvl_status = this.calculateDeviation(50,80,50,50,100,100,this.lastSensorRecord.water_level);
    this.sun_status = this.calculateDeviation(sunDeviation10, sunDeviation20, sunDeviation10, sunDeviation20,this.userDevice.sunNeeds,this.userDevice.sunNeeds, this.lastSensorRecord.sun);
    this.heat_status = this.calculateDeviation(heatDeviationMin10, heatDeviationMin20, heatDeviationMax10, heatDeviationMax20,this.userDevice.heatMin,this.userDevice.heatMax, this.lastSensorRecord.heat);
    this.moist_status = this.calculateDeviation(moistDeviationMin10, moistDeviationMin20, moistDeviationMax10, moistDeviationMax20,this.userDevice.moistMin,this.userDevice.moistMax, this.lastSensorRecord.moist);
  }

  calculateDeviation(deviationLowMin, deviationHighMin, deviationLowMax, deviationHighMax, wantedMin, wantedMax, curStat) {
    if ((wantedMin <= curStat && curStat <= wantedMax)) {
      return "Green";
    }
    else if (wantedMin > curStat) {
      if (Math.abs(wantedMin - curStat) >= deviationLowMin && Math.abs(wantedMin - curStat) <= deviationHighMin) {
        return "Orange";
      }
      else if (Math.abs(wantedMin - curStat) >= deviationHighMin) {
        return "Red";
      }
      else
        return "Green";
    }
    else if (wantedMax < curStat) {
      if (Math.abs(curStat - wantedMax) >= deviationLowMax && Math.abs(curStat - wantedMax) <= deviationLowMax) {
        return "Orange";
      }
      else if (Math.abs(curStat - wantedMax) >= deviationLowMax) {
        return "Red";
      }
      else
        return "Green";
    }
  }

  presentRadioPopover(ev: UIEvent) {
    let popover = this.popoverCtrl.create(SettingsPopoverPage, {
      userDevice: this.userDevice,
    });
    popover.onDidDismiss(data => {
      if(data){
        this.userDeviceProvider.getUserDeviceByDeviceId(this.userDevice.device).subscribe(data => {
          if(data['success']){
            this.userDevice = data['answer'];
            this.updateDeviceStatus();
            this.updateStatsColor();
          }
        });
      }
    });
    popover.present({
      ev: ev
    });
  }

  waterNow(b){
    console.log('in water now')
    if(this.isWateringInProgress){
      this.messageProvider.presentAlertOk('Water now', 'Watering session already in progress, please wait.')
      return;
    }
    this.messageProvider.presentLoading('Trying to Water the plant, please wait...');
    
    this.userDeviceProvider.getUserDeviceByDeviceId(this.userDevice.device).subscribe(data => {
      this.messageProvider.dismissLoading(2000, () => {
        if(data['success']){
          this.userDevice = data['answer'];
          this.updateDeviceStatus();
          this.updateStatsColor();
          if(this.deviceStatus=="Disconnected"){
            this.messageProvider.presentAlertOk('Plant Not connected', 'The plant currently not connected, try to check if the device is pluged to a power supply and then try again')
            this.isWateringInProgress = false;
            return;
          }
          else{
            let command = {
              mac: this.userDevice.device.mac,
              command: "water_now"
            } 
            this.commandProvider.addCommand(command).subscribe(data => {
              if(data['success']){
                this.isWateringInProgress = true;
                this.messageProvider.presentToastSuccess('Watering session in progress', 'top')
                setTimeout(() => {
                  this.activateTimer(b);
                }, 100);
              }
              else{
                this.messageProvider.presentAlertOk('Water now', data['message'])
                this.isWateringInProgress = false;
              }
            });
          }
        }
      }); 
    });
  }

  activateTimer(b){
    //this.rd.setStyle(this.btn._elementRef.nativeElement,'background-color','#488aff');
    this.rd.setStyle(this.waterIcon.nativeElement,'background-color','#488aff');

    let timer = TimerObservable.create(1000, 100);
    this.subscription = timer.subscribe(t => {
      
      if(this.blue>50)
        this.blue--;
      else if(this.white>0){
        this.blue = 0;
        this.white--;
      }
      else{
        this.subscription.unsubscribe();
        //this.rd.setStyle(this.btn._elementRef.nativeElement,'background-color','transparent');
        setTimeout(() => {
          this.isWateringInProgress = false;
          this.blue = 100;
          this.white = 50;
        }, 100);
      }
      this.rd.setStyle(this.waterIcon.nativeElement,'background-image','linear-gradient(0deg, rgba(255,255,255,0) '+this.blue+'%, rgba(255,255,255,0) '+this.white+'%, rgba(255,255,255,1) '+this.white+'%)');
      //this.rd.setStyle(this.btn._elementRef.nativeElement,'background-image','linear-gradient(0deg, rgba(255,255,255,0) '+this.blue+'%, rgba(255,255,255,0) '+this.white+'%, rgba(255,255,255,1) '+this.white+'%)');
    });
  }

  openInfo(ev: UIEvent, pressed){
    console.log(pressed)
    let message = '';
    if(pressed == 'sun'){
      message = '( Wanted: ' + this.userDevice.sunNeeds+ ' )';
    }
    else if(pressed == 'moist'){
      message = '(Min: '+ this.userDevice.moistMin+ ' Max: '+ this.userDevice.moistMax + ')'
    }
    else if(pressed == 'heat'){
      message = '(Min: '+ this.userDevice.heatMin+ ' Max: '+ this.userDevice.heatMax + ')'
    }
    else{
      message = '(Optimal level: 50%+)'
    }
    let popover = this.popoverCtrl.create(InfoPopoverPage, {message: message});
    popover.present({
      ev: ev
    });
  }

  back(){
    this.viewCtrl.dismiss();
  }

  doRefresh(refresher) {
    let command = {
      mac: this.userDevice.device.mac,
      command: "get_sensors_status"
    }
    this.userDeviceProvider.getUserDeviceByDeviceId(this.userDevice.device).subscribe(data => {
      if(data['success']){
        this.userDevice = data['answer'];
        this.updateDeviceStatus();
        this.updateStatsColor();
      }
    });
    this.waterRecordProvider.getLastSensorRecord(this.userDevice.device.mac).subscribe(data => {
      if (data['success'] && data['answer'][0]) {
        this.lastWaterRecord = data['answer'][0].Date;
      }
    });
    this.commandProvider.addCommand(command).subscribe(data => {
      if(data['success']){
        setTimeout(() => {
          this.sensorProvider.getLastSensorRecord(this.userDevice.device.mac).subscribe(data => {
            if (data['success']) {
              this.lastSensorRecord = data['answer'][0];
              this.updateStatsColor();
            }
          });
          refresher.complete();
        }, 5000);
      }
      else{
        setTimeout(() => {
          refresher.complete();
        }, 2000);
      }
    });
  }
}