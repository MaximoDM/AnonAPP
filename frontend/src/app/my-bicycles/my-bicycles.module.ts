import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyBicyclesPageRoutingModule } from './my-bicycles-routing.module';

import { MyBicyclesPage } from './my-bicycles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyBicyclesPageRoutingModule
  ],
  declarations: [MyBicyclesPage]
})
export class MyBicyclesPageModule {}
