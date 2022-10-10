import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentClassesDetailsDialogComponent } from './parent-classes-details-dialog.component';

describe('ParentClassesDetailsDialogComponent', () => {
  let component: ParentClassesDetailsDialogComponent;
  let fixture: ComponentFixture<ParentClassesDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParentClassesDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentClassesDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
