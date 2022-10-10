import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordedSessionDetailsDialogComponent } from './recorded-session-details-dialog.component';

describe('RecordedSessionDetailsDialogComponent', () => {
  let component: RecordedSessionDetailsDialogComponent;
  let fixture: ComponentFixture<RecordedSessionDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordedSessionDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordedSessionDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
