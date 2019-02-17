import { Component, OnInit, EventEmitter } from '@angular/core';
import { Place } from '../../models/place';
import { BsModalRef } from 'ngx-bootstrap';
import { PlaceService } from '../../services/place.service';

@Component({
  selector: 'app-place-update',
  templateUrl: './place-update.component.html',
  styleUrls: ['./place-update.component.scss']
})
export class PlaceUpdateComponent implements OnInit {
  place: Place;
  placeUM: Place = new Place();
  optionsSelect: { value: number; label: string; }[];
  refresh: EventEmitter<any> = new EventEmitter<any>();


  constructor(
    public modalRef: BsModalRef,
    private placeService: PlaceService
  ) { }

  ngOnInit() {
    this.optionsSelect = [
      { value: 1, label: 'Beacon 1' },
      { value: 2, label: 'Beacon 2' },
      { value: 3, label: 'Beacon 3' },
    ];
  }

  updatePlace() {
    this.placeService.update(this.place)
      .then(
        response => {
          this.modalRef.hide();
          this.refresh.emit();
        },
      );
  }

}
