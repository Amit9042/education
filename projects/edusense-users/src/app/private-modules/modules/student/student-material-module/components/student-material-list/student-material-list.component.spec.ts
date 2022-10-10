import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentMaterialListComponent } from './student-material-list.component';

describe('StudentMaterialListComponent', () => {
  let component: StudentMaterialListComponent;
  let fixture: ComponentFixture<StudentMaterialListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentMaterialListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentMaterialListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
