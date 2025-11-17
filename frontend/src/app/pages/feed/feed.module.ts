import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { FeedPage } from './feed.page';
import { SharedModule } from 'src/app/shared/shared-module';

const routes: Routes = [
  { path: '', component: FeedPage }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FeedPage]
})
export class FeedPageModule {}
