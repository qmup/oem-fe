import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-zone-pages',
  templateUrl: './zone-pages.component.html',
  styleUrls: ['./zone-pages.component.scss']
})
export class ZonePagesComponent implements OnInit {

  sub: any;
  id: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
  }

}
