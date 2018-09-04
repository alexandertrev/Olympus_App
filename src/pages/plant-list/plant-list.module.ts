import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlantListPage } from './plant-list';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    PlantListPage,
  ],
  imports: [
    IonicPageModule.forChild(PlantListPage),
    PipesModule
  ],
})
export class PlantListPageModule {}
