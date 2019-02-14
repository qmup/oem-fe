import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ToastService } from 'ng-uikit-pro-standard';
import { Http } from '@angular/http';

@Component({
  selector: 'app-notification',
  template: `
    <p>
      notification works!
    </p>
  `,
  styles: []
})
export class NotificationComponent implements AfterViewInit {
  getDataInterval: any;

  constructor(
    private toastService: ToastService, private http: Http
  ) { }

  ngAfterViewInit() {
    const pushSocket = new WebSocket('https://');
  }

}
