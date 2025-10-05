import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyBicyclesPage } from './my-bicycles.page';

describe('MyBicyclesPage', () => {
  let component: MyBicyclesPage;
  let fixture: ComponentFixture<MyBicyclesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyBicyclesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
