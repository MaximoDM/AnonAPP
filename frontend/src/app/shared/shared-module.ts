import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { MainHeaderComponent } from '../components/main-header/main-header.component';

@NgModule({
  declarations: [
    MainHeaderComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    MainHeaderComponent
  ]
})
export class SharedModule {}
