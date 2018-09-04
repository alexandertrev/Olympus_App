import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InfoPopoverPage } from './info-popover';

@NgModule({
  declarations: [
    InfoPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(InfoPopoverPage),
  ],
})
export class InfoPopoverPageModule {}
