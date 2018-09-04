import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeviceDetailsPage } from './device-details';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  declarations: [
    DeviceDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(DeviceDetailsPage),
    NgxQRCodeModule,
  ],
})
export class DeviceDetailsPageModule {}
