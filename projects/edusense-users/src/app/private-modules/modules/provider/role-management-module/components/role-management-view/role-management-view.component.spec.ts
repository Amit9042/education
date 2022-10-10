import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleManagementViewComponent } from './role-management-view.component';

describe('RoleManagementViewComponent', () => {
  let component: RoleManagementViewComponent;
  let fixture: ComponentFixture<RoleManagementViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleManagementViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleManagementViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
