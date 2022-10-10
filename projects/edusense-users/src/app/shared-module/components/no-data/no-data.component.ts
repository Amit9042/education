import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-no-data",
  templateUrl: "./no-data.component.html",
  styleUrls: ["./no-data.component.scss"],
})
export class NoDataComponent implements OnInit {
  // Angular  variables
  @Input() message: string;
  @Input() smallText: string;

  constructor() {}

  ngOnInit() {}
}
