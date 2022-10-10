import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMaterialDialogComponent } from './view-material-dialog.component';

describe('ViewMaterialDialogComponent', () => {
  let component: ViewMaterialDialogComponent;
  let fixture: ComponentFixture<ViewMaterialDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMaterialDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMaterialDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
