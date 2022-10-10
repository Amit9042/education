import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { classAttendanceViewComponent } from './class-attendance-view.component';


describe('classAttendanceViewComponent', () => {
  let component: classAttendanceViewComponent;
  let fixture: ComponentFixture<classAttendanceViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ classAttendanceViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(classAttendanceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
