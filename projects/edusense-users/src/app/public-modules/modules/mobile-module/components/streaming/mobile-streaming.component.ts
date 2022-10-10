import {Component, OnInit} from '@angular/core';
import {UserConfigModel} from '../../../../models';

@Component({
  selector: 'app-mobile-streaming',
  templateUrl: './mobile-streaming.component.html',
  styleUrls: ['./mobile-streaming.component.scss']
})
export class MobileStreamingComponent implements OnInit {

  userDetails = {
    first_name: 'smartSense',
    last_name: ' User'
  };

  constructor() {
  }

  ngOnInit(): void {
    // const req = new XMLHttpRequest();
    // req.open('GET', window.location.href, false);
    // req.send(null);
    // const headers = req.getAllResponseHeaders().toLowerCase();
    // alert(headers);
  }

  onEnd() {
    this.userDetails = null;
    console.log('<==End Class==>');
  }
}
