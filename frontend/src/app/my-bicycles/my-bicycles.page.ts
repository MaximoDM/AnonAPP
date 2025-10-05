import { Component, OnInit } from '@angular/core';
import { Bicycleservice } from '../services/bicycleservice';

@Component({
  selector: 'app-my-bicycles',
  templateUrl: './my-bicycles.page.html',
  styleUrls: ['./my-bicycles.page.scss'],
  standalone: false,
})
export class MyBicyclesPage implements OnInit {

  bicycles = [
    { id: 1, brand: 'Giant', model: 'Defy Advanced', color: 'Black', year: 2020 },
    { id: 2, brand: 'Trek', model: 'Domane SL 7', color: 'Red', year: 2021 },
    { id: 3, brand: 'Specialized', model: 'Roubaix', color: 'Blue', year: 2019 },
    { id: 4, brand: 'Cannondale', model: 'Synapse Carbon', color: 'Green', year: 2022 }
  ]

  constructor( private bicycleService: Bicycleservice) { }

  ngOnInit() {
    this.getallBicycles();
  }

  getallBicycles(){
    // Lógica para obtener las bicicletas desde un servicio o API
    this.bicycleService.getBicycles().subscribe((data: any) => {
      this.bicycles = data;
    });
  }

}
