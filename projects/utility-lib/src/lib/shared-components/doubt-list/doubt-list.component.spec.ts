import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoubtListComponent } from './doubt-list.component';

describe('DoubtListComponent', () => {
  let component: DoubtListComponent;
  let fixture: ComponentFixture<DoubtListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoubtListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoubtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
