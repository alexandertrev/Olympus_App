import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserDeviceTabsPage } from './user-device-tabs';

@NgModule({
  declarations: [
    UserDeviceTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(UserDeviceTabsPage),
  ]
})
export class UserDeviceTabsPageModule {}
