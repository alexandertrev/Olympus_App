import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileAddPage } from './profile-add';

@NgModule({
  declarations: [
    ProfileAddPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileAddPage),
  ],
})
export class ProfileAddPageModule {}
