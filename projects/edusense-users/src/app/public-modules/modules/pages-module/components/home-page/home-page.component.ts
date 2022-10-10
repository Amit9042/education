import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
    config: SwiperOptions = {
        pagination: '.swiper-pagination',
        initialSlide: 1,
        slidesPerView: 1,
        paginationClickable: true,
        spaceBetween: 3
    };

    constructor() {}

    ngOnInit(): void {}
}
