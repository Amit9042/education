import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueBankChapterListComponent } from './que-bank-chapter-list.component';

describe('QueBankChapterListComponent', () => {
  let component: QueBankChapterListComponent;
  let fixture: ComponentFixture<QueBankChapterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueBankChapterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueBankChapterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
