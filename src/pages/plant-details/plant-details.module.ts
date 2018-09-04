import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlantDetailsPage } from './plant-details';

@NgModule({
  declarations: [
    PlantDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(PlantDetailsPage),
  ],
})
export class PlantDetailsPageModule {}
