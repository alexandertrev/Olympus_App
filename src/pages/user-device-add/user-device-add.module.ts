import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserDeviceAddPage } from './user-device-add';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  declarations: [
    UserDeviceAddPage,
  ],
  imports: [
    IonicPageModule.forChild(UserDeviceAddPage),
    NgxQRCodeModule,
  ],
})
export class UserDeviceAddPageModule {}
