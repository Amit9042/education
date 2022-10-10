import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseGradePracticeComponent } from './choose-grade-practice.component';

describe('ChooseGradePracticeComponent', () => {
  let component: ChooseGradePracticeComponent;
  let fixture: ComponentFixture<ChooseGradePracticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseGradePracticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseGradePracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
