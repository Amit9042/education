import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocMaterialViewDialogComponent } from './doc-material-view-dialog.component';

describe('DocMaterialViewDialogComponent', () => {
  let component: DocMaterialViewDialogComponent;
  let fixture: ComponentFixture<DocMaterialViewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocMaterialViewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocMaterialViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
