import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserDeviceConfigPage } from './user-device-config';

@NgModule({
  declarations: [
    UserDeviceConfigPage,
  ],
  imports: [
    IonicPageModule.forChild(UserDeviceConfigPage),
  ],
})
export class UserDeviceConfigPageModule {}
