import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, MenuController } from 'ionic-angular';
import { MainPage } from '../pages';
import { AuthProvider } from '../../providers/providers';

// TODO: Add form validation

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  submitAttempt: boolean = false;
  account: { email: string, password: string } = {
    email: '',
    password: ''
  };

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              private authProvider: AuthProvider,
              public menu: MenuController) {
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true, 'menu1');
  }

  doLogin() {
    this.submitAttempt = true;
    this.authProvider.authenticateUser(this.account).subscribe(data => {
      console.log(data["messages"])
      if (data["success"]) {
        let toast = this.toastCtrl.create({
          message: data["messages"],
          duration: 3000,
          position: 'bottom',
          cssClass: 'toast-success'
        });
        toast.present();
        setTimeout(() => {
          this.navCtrl.setRoot(MainPage);
        }, 2000);
        
      }
      else {
        this.submitAttempt = false;
        let toast = this.toastCtrl.create({
          message: data["error"],
          duration: 3000,
          position: 'bottom',
          cssClass: 'toast-error'
        });
        toast.present();
      }
    });
  }
}
