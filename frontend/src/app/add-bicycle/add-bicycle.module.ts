import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddBicyclePageRoutingModule } from './add-bicycle-routing.module';

import { AddBicyclePage } from './add-bicycle.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    AddBicyclePageRoutingModule
  ],
  declarations: [AddBicyclePage]
})
export class AddBicyclePageModule {}
