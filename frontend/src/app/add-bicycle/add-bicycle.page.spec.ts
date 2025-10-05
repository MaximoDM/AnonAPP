import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddBicyclePage } from './add-bicycle.page';

describe('AddBicyclePage', () => {
  let component: AddBicyclePage;
  let fixture: ComponentFixture<AddBicyclePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBicyclePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
