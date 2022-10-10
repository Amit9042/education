import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpTypeComponent } from './sign-up-type.component';

describe('SignUpTypeComponent', () => {
  let component: SignUpTypeComponent;
  let fixture: ComponentFixture<SignUpTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
