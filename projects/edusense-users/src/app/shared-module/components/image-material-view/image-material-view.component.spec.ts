import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageMaterialViewComponent } from './image-material-view.component';

describe('ImageMaterialViewComponent', () => {
  let component: ImageMaterialViewComponent;
  let fixture: ComponentFixture<ImageMaterialViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageMaterialViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageMaterialViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
