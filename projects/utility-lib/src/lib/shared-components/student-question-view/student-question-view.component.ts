import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'es-user-student-question-view',
  templateUrl: './student-question-view.component.html',
  styleUrls: ['./student-question-view.component.scss']
})
export class StudentQuestionViewComponent implements OnInit {

  @Input() questionDetail;
  
  constructor() { }

  ngOnInit(): void {
  }

}
