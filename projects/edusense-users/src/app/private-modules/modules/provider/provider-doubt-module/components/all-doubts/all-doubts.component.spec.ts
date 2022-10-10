import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDoubtsComponent } from './all-doubts.component';

describe('AllDoubtsComponent', () => {
  let component: AllDoubtsComponent;
  let fixture: ComponentFixture<AllDoubtsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllDoubtsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllDoubtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
