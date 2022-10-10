import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalViewProfileComponent } from './personal-view-profile.component';

describe('PersonalViewProfileComponent', () => {
  let component: PersonalViewProfileComponent;
  let fixture: ComponentFixture<PersonalViewProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalViewProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalViewProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
