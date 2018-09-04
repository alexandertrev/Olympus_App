import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  constructor(public navCtrl: NavController, public menu: MenuController) { }

  ionViewDidLoad() {
    this.menu.enable(false, "menu1");    
  }

  login() {
    this.navCtrl.push('LoginPage');
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }
}
