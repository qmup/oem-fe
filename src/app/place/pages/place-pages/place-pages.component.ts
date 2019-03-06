import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-place-pages',
  templateUrl: './place-pages.component.html',
  styleUrls: ['./place-pages.component.scss']
})
export class PlacePagesComponent implements OnInit {

  sub: any;
  id: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
  }

}
