import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalViewProfileOtherComponent } from './personal-view-profile-other.component';

describe('PersonalViewProfileOtherComponent', () => {
  let component: PersonalViewProfileOtherComponent;
  let fixture: ComponentFixture<PersonalViewProfileOtherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalViewProfileOtherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalViewProfileOtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
