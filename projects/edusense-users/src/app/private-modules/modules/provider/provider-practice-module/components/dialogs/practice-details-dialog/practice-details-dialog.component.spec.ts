import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeDetailsDialogComponent } from './practice-details-dialog.component';

describe('AddPracticeDialogComponent', () => {
  let component: PracticeDetailsDialogComponent;
  let fixture: ComponentFixture<PracticeDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticeDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
