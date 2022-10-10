import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfirmationMessageDialogComponent} from './confirmation-message-dialog.component';

describe('ConfirmMessageComponent', () => {
  let component: ConfirmationMessageDialogComponent;
  let fixture: ComponentFixture<ConfirmationMessageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationMessageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationMessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
