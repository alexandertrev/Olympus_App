import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, PopoverController } from 'ionic-angular';
import { LoginPopoverPage } from '../login-popover/login-popover';
import { AuthProvider, SharedProvider } from '../../providers/providers';
import { Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  cur_user:any;
  isAdmin: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public menu: MenuController,
    public events: Events,
    public popoverCtrl: PopoverController,
    public auth: AuthProvider) {
  }

  ionViewDidEnter() {
    this.menu.enable(false, "menu1"); 
    this.auth.loggedIn((success) => {
      if(success)
      {
        this.auth.getUserName((username) => {
          this.cur_user = username;
        }); 
      } 
    });   
    this.auth.isAdmin((isAdmin) =>{
      if(isAdmin)
        this.isAdmin = isAdmin;
    })
  }
  
  presentRadioPopover(ev: UIEvent) {
    let popover = this.popoverCtrl.create(LoginPopoverPage, {cur_user: this.cur_user, isAdmin: this.isAdmin}, 
      {cssClass: 'my-popover'});
    popover.onDidDismiss(data => {

    });
    popover.present({
      ev: ev
    });
  }
}
