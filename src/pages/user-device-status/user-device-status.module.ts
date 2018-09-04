import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserDeviceStatusPage } from './user-device-status';

@NgModule({
  declarations: [
    UserDeviceStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(UserDeviceStatusPage),
  ],
})
export class UserDeviceStatusPageModule {}
