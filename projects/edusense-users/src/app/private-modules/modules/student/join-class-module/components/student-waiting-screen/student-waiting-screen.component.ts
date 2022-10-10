import {Component, Input, OnInit} from '@angular/core';
import {Classes} from '@sharedModule/models';

@Component({
  selector: 'app-student-waiting-screen',
  templateUrl: './student-waiting-screen.component.html',
  styleUrls: ['./student-waiting-screen.component.scss']
})
export class StudentWaitingScreenComponent implements OnInit {

  @Input() classDetails: Classes = null;
  constructor() { }

  ngOnInit(): void {
  }

}
