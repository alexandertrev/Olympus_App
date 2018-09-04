import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FamilyAddPage } from './family-add';

@NgModule({
  declarations: [
    FamilyAddPage,
  ],
  imports: [
    IonicPageModule.forChild(FamilyAddPage),
  ],
})
export class FamilyAddPageModule {}
