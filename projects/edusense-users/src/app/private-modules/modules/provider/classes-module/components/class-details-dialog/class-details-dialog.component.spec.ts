import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassDetailsDialogComponent } from './class-details-dialog.component';

describe('ClassDetailsDialogComponent', () => {
  let component: ClassDetailsDialogComponent;
  let fixture: ComponentFixture<ClassDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
