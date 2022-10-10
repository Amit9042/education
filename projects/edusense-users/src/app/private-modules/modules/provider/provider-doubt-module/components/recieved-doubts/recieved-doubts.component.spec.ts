import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecievedDoubtsComponent } from './recieved-doubts.component';

describe('RecievedDoubtsComponent', () => {
  let component: RecievedDoubtsComponent;
  let fixture: ComponentFixture<RecievedDoubtsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecievedDoubtsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecievedDoubtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
