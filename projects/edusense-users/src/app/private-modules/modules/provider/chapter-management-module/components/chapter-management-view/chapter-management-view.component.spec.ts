import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterManagementViewComponent } from './chapter-management-view.component';

describe('ChapterManagementViewComponent', () => {
  let component: ChapterManagementViewComponent;
  let fixture: ComponentFixture<ChapterManagementViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChapterManagementViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChapterManagementViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
