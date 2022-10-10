import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileContainerComponent } from './edit-profile-container.component';

describe('EditProfileContainerComponent', () => {
  let component: EditProfileContainerComponent;
  let fixture: ComponentFixture<EditProfileContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProfileContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
