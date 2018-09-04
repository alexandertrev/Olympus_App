import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController, AlertController, LoadingController } from 'ionic-angular';

@Injectable()
export class MessageProvider {
  loader: any;

  constructor(
    public http: HttpClient,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private toastController : ToastController) {
    
  }

  presentAlertOk(title, msg) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['Ok']
    });
    alert.present();
  }

  presentToastSuccess(msg, position, callback?){
    let toast = this.toastController.create({
      message: msg,
      duration: 3000,
      position: position,
      cssClass: 'toast-success',
      dismissOnPageChange: true
    });
    toast.present();
    if(arguments[2] != null)
      callback();
  }

  presentToastError(msg, position, callback?){
    let toast = this.toastController.create({
      message: msg,
      duration: 3000,
      position: position,
      cssClass: 'toast-error',
      dismissOnPageChange: true
    });
    toast.present();
    if(arguments[2] != null)
      callback();
  }

  presentLoading(loadingMsg) {
    this.loader = this.loadingCtrl.create({
      content: loadingMsg,
    });
    this.loader.present();
  }

  dismissLoading(waitTime, callback?){
    setTimeout(() => {
      this.loader.dismiss();
      callback();
    }, waitTime);
  }
}
