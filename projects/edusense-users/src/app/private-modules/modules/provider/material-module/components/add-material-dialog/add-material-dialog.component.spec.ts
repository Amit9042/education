import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaterialDialogComponent } from './add-material-dialog.component';

describe('AddMaterialDialogComponent', () => {
  let component: AddMaterialDialogComponent;
  let fixture: ComponentFixture<AddMaterialDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMaterialDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMaterialDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
