import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueBankSubjectComponent } from './que-bank-subject.component';

describe('QueBankSubjectComponent', () => {
  let component: QueBankSubjectComponent;
  let fixture: ComponentFixture<QueBankSubjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueBankSubjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueBankSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
