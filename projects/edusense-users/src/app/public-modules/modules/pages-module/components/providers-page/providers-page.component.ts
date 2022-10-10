import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-providers-page',
    templateUrl: './providers-page.component.html',
    styleUrls: ['./providers-page.component.scss']
})
export class ProvidersPageComponent implements OnInit {
    // Data list
    providerFaqsList = [
        {
            title: 'Is it possible to remove Student from live class?',
            description: 'Yes, Students can be removed from live class, but students can rejoin.'
        },
        {
            title: 'Is it possible to change student class or move students from one class to another?',
            description: 'Yes, from class settings you can add new students to class. By visiting class details you can remove any student.'
        },
        {
            title: 'Can I mute all students during live class?',
            description: 'Yes, teachers can use Mute All feature by clicking on the mic icon during live class to mute all students.'
        },
        {
            title: 'Can I remove a student from class so he can not join again? ',
            // tslint:disable-next-line: max-line-length
            description: 'Yes, students can be removed from class by teacher only. Once a student is removed they will not get your Institute/Class name in the Join class list.'
        },
        {
            title: 'I no longer require class, can I delete it?',
            description: 'Created class can not be completely removed. But you can disable it from class settings.'
        },
        {
            title: 'What is the pricing structure?',
            // tslint:disable-next-line: max-line-length
            description: 'You can visit pricing section in our website for information related to available plans: https://theedusense.io/pricing.'
        },
        {
            title: 'What are the benefits for large organizations?',
            description: 'You can reach to us at https://theedusense.io for more information.'
        },
        {
            title: 'The pricing structure does not fit my requirement. Customisation available?',
            description: 'You can reach to us at https://theedusense.io for more information.'
        },
        {
            title: 'Is it possible to start two live classes in the same account?',
            // tslint:disable-next-line: max-line-length
            description: 'Yes, teachers can use the same account to start two classes. It is recommended to use different systems (computer or mobile phone) to connect to another class.'
        },
        {
            title: 'I have some study material for students, can I share?',
            // tslint:disable-next-line: max-line-length
            description: 'Yes, study material can be shared with students using the Material section. Also, you can disable access of shared material to students without deleting it from the system.'
        },
        {
            title: 'Is my data and online class secure?',
            // tslint:disable-next-line: max-line-length
            description: 'Yes, EduSense allows only registered students to join the class and also it uses industry standard encryption for data protection.'
        },
        {
            title: 'Can anyone join class anonymously?',
            description: 'No, only registered students approved by teachers can join class.'
        },
        {
            title: 'Can I invite students to join a class without an enrollment request?',
            // tslint:disable-next-line: max-line-length
            description: 'No, students have to send enrollment requests and require prior acceptance and allocation of class by teacher. This restriction has been imposed to maintain privacy and security of online class.'
        },
        {
            title: 'Can I change the name of a class?',
            description: 'Yes, a class name can be updated.'
        },
        {
            title: 'Is it possible to take an online exam in edusense?',
            // tslint:disable-next-line: max-line-length
            description: 'Yes, EduSense is planning to include a test and examination section. But, in the current release it’s not supported.'
        },
        {
            title: 'Can I record more than one live class?',
            description: 'Yes, you can record your live class according to the plan you have subscribed to.'
        },
        {
            title: 'How many students join class at a time?',
            description: 'It will depend on the plan you have purchased. You can visit https://theedusense.io/pricing for more information.'
        }
    ];
    constructor() {}

    ngOnInit(): void {}
}
