import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FamilyListPage } from './family-list';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    FamilyListPage,
  ],
  imports: [
    IonicPageModule.forChild(FamilyListPage),
    PipesModule
  ],
})
export class FamilyListPageModule {}
