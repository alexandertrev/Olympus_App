import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-user-device-tabs',
  templateUrl: 'user-device-tabs.html'
})
export class UserDeviceTabsPage {

  tabsStatusRoot = 'UserDeviceStatusPage'
  tabsLogsRoot = 'UserDeviceLogPage'
  tabsWaterRoot = 'UserDeviceWaterPage'
  tabsStatisticsRoot = 'UserDeviceStatisticsPage'

  userDevice: any;

  constructor(public navCtrl: NavController, params: NavParams, public events: Events, public viewCtrl: ViewController,) {
    this.userDevice = params.get('item');

    events.subscribe('close-modal', () => {
      this.viewCtrl.dismiss();
    });
  }
}
