import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesListDialogComponent } from './classes-list-dialog.component';

describe('ClassesListDialogComponent', () => {
  let component: ClassesListDialogComponent;
  let fixture: ComponentFixture<ClassesListDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassesListDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassesListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
