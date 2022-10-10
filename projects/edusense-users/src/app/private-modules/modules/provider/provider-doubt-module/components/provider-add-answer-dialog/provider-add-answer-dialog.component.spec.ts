import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderAddAnswerDialogComponent } from './provider-add-answer-dialog.component';

describe('ProviderAddAnswerDialogComponent', () => {
  let component: ProviderAddAnswerDialogComponent;
  let fixture: ComponentFixture<ProviderAddAnswerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderAddAnswerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderAddAnswerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
