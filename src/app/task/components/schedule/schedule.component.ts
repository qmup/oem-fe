import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../../service/schedule.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  constructor(
    private scheduleService: ScheduleService,
  ) { }

  ngOnInit() {

  }

}
