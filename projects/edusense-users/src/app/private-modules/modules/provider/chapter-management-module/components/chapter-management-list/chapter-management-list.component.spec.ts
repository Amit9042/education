import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterManagementListComponent } from './chapter-management-list.component';

describe('ChapterManagementListComponent', () => {
  let component: ChapterManagementListComponent;
  let fixture: ComponentFixture<ChapterManagementListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChapterManagementListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChapterManagementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
