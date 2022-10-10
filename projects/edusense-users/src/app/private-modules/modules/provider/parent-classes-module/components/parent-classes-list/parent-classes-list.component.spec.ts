import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentClassesListComponent } from './parent-classes-list.component';

describe('ParentClassesListComponent', () => {
  let component: ParentClassesListComponent;
  let fixture: ComponentFixture<ParentClassesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParentClassesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentClassesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
