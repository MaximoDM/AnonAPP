import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  brand: string = 'BH';
  model: string = 'star';
  constructor(private router: Router) {}

  gotoMyBicycles(){
    this.router.navigate(['/my-bicycles']);
  }

}
