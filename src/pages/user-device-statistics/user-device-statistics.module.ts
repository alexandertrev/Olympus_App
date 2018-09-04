import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserDeviceStatisticsPage } from './user-device-statistics';

@NgModule({
  declarations: [
    UserDeviceStatisticsPage,
  ],
  imports: [
    IonicPageModule.forChild(UserDeviceStatisticsPage),
  ],
})
export class UserDeviceStatisticsPageModule {}
