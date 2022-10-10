import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-students-page',
    templateUrl: './students-page.component.html',
    styleUrls: ['./students-page.component.scss']
})
export class StudentsPageComponent implements OnInit {
    config: SwiperOptions = {
        initialSlide: 1,
        slidesPerView: 1,
        spaceBetween: 0,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev'
    };

    // Data list
    studentFaqsList = [
        {
            title: 'Can I access study material while I am in live class?',
            // tslint:disable-next-line: max-line-length
            description: 'Yes. If your phone runs on OS newer than android 8.0 or iOS 9, you can use Picture in Picture mode. That will help to simultaneously interact with study material and live class. Otherwise you won’t be able to see the video feed of your teacher, but will be able to hear his voice while accessing study material.'
        },
        {
            title: 'From where can I download EduSense App?',
            description: 'Coming Soon'
        },
        {
            title: 'Can I use EduSense for Free?',
            // tslint:disable-next-line: max-line-length
            description: 'Yes, EduSense charges to institutes. If you are a registered student to any institute then you can use this application without any fees.'
        },
        {
            title: 'Can I enroll in any institute by myself ?',
            // tslint:disable-next-line: max-line-length
            description: 'You require institute code to send enrollment requests to institute and acceptance for the same. Without institute code you can not enroll with any institute.'
        },
        {
            title: 'Can I talk with other students during live class?',
            description: 'Yes, if your teacher allows it.'
        },
        {
            title: 'Can I use EduSense with low bandwidth?',
            // tslint:disable-next-line: max-line-length
            description: 'Yes, EduSense has a low bandwidth mode, in which users will only hear the voice of the teacher and other students and video will be paused for that student. Teachers and other students can still see each other except who has enabled low bandwidth mode.'
        },
        {
            title: 'Can students invite their friends to join class?',
            description: 'No, only teachers have access and rights to invite and admit students to class.'
        },
        {
            title: 'Can students share phone screens?',
            description: 'No. Currently screen sharing is only available on Web App.'
        },
        {
            title: 'Can I receive any notification about the live class?',
            description: 'Yes, you will receive notification when the teacher starts or ends class you are registered with.'
        },
        {
            title: 'Can I remove any student from live class?',
            description: 'No. Only teachers can remove students from live class.'
        },
        {
            title: 'Can I access a live session later if I was not present during live class?',
            description: 'Yes, you can access class later if your teacher has recorded live class.'
        },
        {
            title: 'If I have doubt during live class and I’m mute by the teacher, how can I notify the teacher?',
            description: 'You can use the Hand Raise feature to notify your teacher that you have a question.'
        },
        {
            title: 'Live class has ended and I have a question, how can I approach the teacher?',
            description: 'You can use the doubt room, here you can ask your questions and discuss your doubts with the teacher.'
        }
    ];

    constructor() {}

    ngOnInit(): void {}
}
