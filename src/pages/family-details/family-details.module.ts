import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FamilyDetailsPage } from './family-details';

@NgModule({
  declarations: [
    FamilyDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(FamilyDetailsPage),
  ],
})
export class FamilyDetailsPageModule {}
