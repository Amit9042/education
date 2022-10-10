import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMobileDialogComponent } from './edit-mobile-dialog.component';

describe('EditMobileDialogComponent', () => {
  let component: EditMobileDialogComponent;
  let fixture: ComponentFixture<EditMobileDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMobileDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMobileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
