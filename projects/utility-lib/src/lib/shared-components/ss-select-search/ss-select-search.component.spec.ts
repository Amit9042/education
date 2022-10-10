import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SsSelectSearchComponent } from './ss-select-search.component';

describe('SsSelectSearchComponent', () => {
    let component: SsSelectSearchComponent;
    let fixture: ComponentFixture<SsSelectSearchComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SsSelectSearchComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SsSelectSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
