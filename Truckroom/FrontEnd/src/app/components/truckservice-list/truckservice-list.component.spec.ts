import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckServiceListComponent } from './truckservice-list.component';

describe('TruckServiceListComponent', () => {
  let component: TruckServiceListComponent;
  let fixture: ComponentFixture<TruckServiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TruckServiceListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TruckServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
