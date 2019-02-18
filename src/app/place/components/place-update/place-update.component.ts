import { Component, OnInit, EventEmitter } from '@angular/core';
import { Place } from '../../models/place';
import { BsModalRef } from 'ngx-bootstrap';
import { PlaceService } from '../../services/place.service';
import { Beacon } from 'src/app/beacon/models/beacon';
import { BeaconService } from 'src/app/beacon/services/beacon.service';

@Component({
  selector: 'app-place-update',
  templateUrl: './place-update.component.html',
  styleUrls: ['./place-update.component.scss']
})
export class PlaceUpdateComponent implements OnInit {
  place: Place;
  placeUM: Place = new Place();
  beaconList: Beacon[];
  optionsSelect: any[] = [];
  refresh: EventEmitter<any> = new EventEmitter<any>();


  constructor(
    public modalRef: BsModalRef,
    private placeService: PlaceService,
    private beaconService: BeaconService
  ) { }

  ngOnInit() {
    this.getBeacon();
    console.log(this.optionsSelect);
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

  getBeacon() {
    this.beaconService.getAll()
      .then(
        (response: Beacon[]) => {
          this.optionsSelect = response.map((beacon) => {
            return {
              value: beacon.workplaceId,
              label: beacon.name
            };
          });
        }
      );
  }

}
