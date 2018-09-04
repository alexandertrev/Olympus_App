import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsDevicePage } from './settings-device';

@NgModule({
  declarations: [
    SettingsDevicePage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsDevicePage),
  ],
})
export class SettingsDevicePageModule {}
