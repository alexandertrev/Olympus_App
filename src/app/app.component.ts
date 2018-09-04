import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FirstRunPage, MainPage } from '../pages/pages';
import { AuthProvider, SharedProvider } from '../providers/providers';
import { Events } from 'ionic-angular';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = FirstRunPage;
  username: string = "";
  loggedIn = false;

  @ViewChild(Nav) nav: Nav;

  pagesUser: any[] = [
    { title: 'Plants family', component: 'FamilyListPage' },
    { title: 'All plants', component: 'PlantListPage' },
    // { title: 'Login', component: 'LoginPage' },
    // { title: 'Signup', component: 'SignupPage' },
  ]
  pagesAdmin: any[] = [
    { title: 'Plants family', component: 'FamilyListPage' },
    { title: 'All plants', component: 'PlantListPage' },
    { title: 'Devices list', component: 'DeviceListPage' },
    // { title: 'Login', component: 'LoginPage' },
    // { title: 'Signup', component: 'SignupPage' },
  ]
  pages:any = this.pagesUser;
  constructor(platform: Platform,
              statusBar: StatusBar, 
              splashScreen: SplashScreen,
              private auth: AuthProvider, 
              public events: Events,
              private sharedProvider: SharedProvider) {
                
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    events.subscribe('dc-emmited', () => {
      console.log('lol')
      this.logOut();
    });

    this.sharedProvider.changeEmitted$.subscribe(
      text => {
        this.auth.getUserName((username) => {
          this.username = username;
          if(this.username != 'You are not logged in'){
            this.auth.isAdmin((isAdmin) =>{
              if(isAdmin)
                this.pages = this.pagesAdmin;
              else
                this.pages = this.pagesUser;
            })
          }
        }); 
    });

    this.auth.loggedIn((success) => {
      if(success)
      {
        this.rootPage = MainPage;
        this.auth.getUserName((username) => {
          this.username = username;
        }); 
      } 
    });
    
    this.auth.isAdmin((isAdmin) =>{
      if(isAdmin)
        this.pages = this.pagesAdmin;
      else
        this.pages = this.pagesUser;
    })
  }
  
  logOut(){
    this.auth.logOut();
    this.nav.setRoot(FirstRunPage);
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    //this.navCtrl.push(page.component);
    this.nav.push(page.component);
  }
}
