import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserDeviceLogPage } from './user-device-log';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    UserDeviceLogPage,
  ],
  imports: [
    IonicPageModule.forChild(UserDeviceLogPage),
    PipesModule
  ],
})
export class UserDeviceLogPageModule {}
