import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDetailsProfileOtherComponent } from './personal-details-profile-other.component';

describe('PersonalDetailsProfileOtherComponent', () => {
  let component: PersonalDetailsProfileOtherComponent;
  let fixture: ComponentFixture<PersonalDetailsProfileOtherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalDetailsProfileOtherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalDetailsProfileOtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
