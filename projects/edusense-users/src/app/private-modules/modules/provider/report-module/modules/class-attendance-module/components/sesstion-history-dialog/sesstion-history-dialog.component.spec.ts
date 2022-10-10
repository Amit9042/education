import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SesstionHistoryDialogComponent } from './sesstion-history-dialog.component';

describe('SesstionHistoryDialogComponent', () => {
  let component: SesstionHistoryDialogComponent;
  let fixture: ComponentFixture<SesstionHistoryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SesstionHistoryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SesstionHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
