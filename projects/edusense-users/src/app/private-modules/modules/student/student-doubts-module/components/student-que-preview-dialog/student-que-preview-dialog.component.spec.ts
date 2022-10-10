import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentQuePreviewDialogComponent } from './student-que-preview-dialog.component';

describe('StudentQuePreviewDialogComponent', () => {
  let component: StudentQuePreviewDialogComponent;
  let fixture: ComponentFixture<StudentQuePreviewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentQuePreviewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentQuePreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
