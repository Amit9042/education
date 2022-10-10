import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordFlowContainerComponent } from './forgot-password-flow-container.component';

describe('ForgotPasswordFlowContainerComponent', () => {
  let component: ForgotPasswordFlowContainerComponent;
  let fixture: ComponentFixture<ForgotPasswordFlowContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotPasswordFlowContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordFlowContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
