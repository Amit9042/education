import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProviderDialogComponent } from './edit-provider-dialog.component';

describe('EditProviderDialogComponent', () => {
  let component: EditProviderDialogComponent;
  let fixture: ComponentFixture<EditProviderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProviderDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProviderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
