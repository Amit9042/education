import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialSelectionComponent } from './material-selection.component';

describe('MaterialSelectionComponent', () => {
  let component: MaterialSelectionComponent;
  let fixture: ComponentFixture<MaterialSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
