import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserDeviceListPage } from './user-device-list';

@NgModule({
  declarations: [
    UserDeviceListPage,
  ],
  imports: [
    IonicPageModule.forChild(UserDeviceListPage),
  ],
})
export class UserDeviceListPageModule {}
