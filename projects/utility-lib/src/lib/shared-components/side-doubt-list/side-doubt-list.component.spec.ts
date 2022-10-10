import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideDoubtListComponent } from './side-doubt-list.component';

describe('SideDoubtListComponent', () => {
  let component: SideDoubtListComponent;
  let fixture: ComponentFixture<SideDoubtListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideDoubtListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideDoubtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
