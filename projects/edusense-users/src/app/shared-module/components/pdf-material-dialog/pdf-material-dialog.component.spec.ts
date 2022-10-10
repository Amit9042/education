import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfMaterialDialogComponent } from './pdf-material-dialog.component';

describe('PdfMaterialDialogComponent', () => {
  let component: PdfMaterialDialogComponent;
  let fixture: ComponentFixture<PdfMaterialDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfMaterialDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfMaterialDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
