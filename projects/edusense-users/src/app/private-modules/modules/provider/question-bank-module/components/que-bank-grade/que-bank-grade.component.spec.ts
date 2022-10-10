import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueBankGradeComponent } from './que-bank-grade.component';

describe('QueBankGradeComponent', () => {
  let component: QueBankGradeComponent;
  let fixture: ComponentFixture<QueBankGradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueBankGradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueBankGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
