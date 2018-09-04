import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserDeviceDetailsPage } from './user-device-details';

@NgModule({
  declarations: [
    UserDeviceDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(UserDeviceDetailsPage),
  ],
  entryComponents: [
    UserDeviceDetailsPage,
  ]
})
export class UserDeviceDetailsPageModule {}
