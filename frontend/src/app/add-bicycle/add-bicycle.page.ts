import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-bicycle',
  templateUrl: './add-bicycle.page.html',
  styleUrls: ['./add-bicycle.page.scss'],
  standalone: false,
})
export class AddBicyclePage implements OnInit {

  bicycleForm = {
    brand: '',
    model: '',
    color: '',
    year: new Date().getFullYear()
  };

  constructor() { }

  ngOnInit() {
  }

}
