import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlantAddPage } from './plant-add';

@NgModule({
  declarations: [
    PlantAddPage,
  ],
  imports: [
    IonicPageModule.forChild(PlantAddPage),
  ],
})
export class PlantAddPageModule {}
