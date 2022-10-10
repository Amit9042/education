import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeResultDialogComponent } from './practice-result-dialog.component';

describe('PracticeResultDialogComponent', () => {
  let component: PracticeResultDialogComponent;
  let fixture: ComponentFixture<PracticeResultDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticeResultDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
