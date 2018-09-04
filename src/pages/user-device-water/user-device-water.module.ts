import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserDeviceWaterPage } from './user-device-water';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    UserDeviceWaterPage,
  ],
  imports: [
    IonicPageModule.forChild(UserDeviceWaterPage),
    PipesModule
  ],
})
export class UserDeviceWaterPageModule {}
