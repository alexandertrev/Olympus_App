import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExplorePage } from './explore';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ExplorePage,
  ],
  imports: [
    IonicPageModule.forChild(ExplorePage),
    PipesModule
  ],
})
export class ExplorePageModule {}
