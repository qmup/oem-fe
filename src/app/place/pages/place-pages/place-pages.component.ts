import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ZoneService } from '../../services/zone.service';

@Component({
  selector: 'app-place-pages',
  templateUrl: './place-pages.component.html',
  styleUrls: ['./place-pages.component.scss']
})
export class PlacePagesComponent implements OnInit {

  sub: any;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private zoneService: ZoneService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
  }

}
