import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'my-bicycles',
    loadChildren: () => import('./my-bicycles/my-bicycles.module').then( m => m.MyBicyclesPageModule)
  },
  {
    path: 'add-bicycle',
    loadChildren: () => import('./add-bicycle/add-bicycle.module').then( m => m.AddBicyclePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
