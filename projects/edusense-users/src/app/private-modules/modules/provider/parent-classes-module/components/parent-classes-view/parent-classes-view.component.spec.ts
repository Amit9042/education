import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentClassesViewComponent } from './parent-classes-view.component';

describe('ParentClassesViewComponent', () => {
  let component: ParentClassesViewComponent;
  let fixture: ComponentFixture<ParentClassesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParentClassesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentClassesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
