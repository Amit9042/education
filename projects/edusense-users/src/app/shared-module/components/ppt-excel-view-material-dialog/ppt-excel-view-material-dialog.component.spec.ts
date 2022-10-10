import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PptExcelViewMaterialDialogComponent } from './ppt-excel-view-material-dialog.component';

describe('PptExcelViewMaterialDialogComponent', () => {
  let component: PptExcelViewMaterialDialogComponent;
  let fixture: ComponentFixture<PptExcelViewMaterialDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PptExcelViewMaterialDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PptExcelViewMaterialDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
