import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDetailsProfileComponent } from './personal-details-profile.component';

describe('PersonalDetailsProfileComponent', () => {
  let component: PersonalDetailsProfileComponent;
  let fixture: ComponentFixture<PersonalDetailsProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalDetailsProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalDetailsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
