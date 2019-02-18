import { Component, OnInit, ViewChild } from '@angular/core';
import { PlaceService } from '../../services/place.service';
import { Place } from '../../models/place';
import { BsModalService, ModalDirective, ModalOptions, BsModalRef } from 'ngx-bootstrap';
import { PlaceUpdateComponent } from '../place-update/place-update.component';
import { Beacon } from 'src/app/beacon/models/beacon';
import { BeaconService } from 'src/app/beacon/services/beacon.service';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss']
})
export class PlaceComponent implements OnInit {
  id: number;
  placeCM: Place = new Place();
  placeList: Place[];
  modalRef: BsModalRef;
  optionsSelect = new Array<any>();
  @ViewChild('create') createModal: ModalDirective;
  @ViewChild('delete') deleteModal: ModalDirective;

  constructor(
    private placeService: PlaceService,
    private beaconService: BeaconService,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.getPlace();
    this.getBeacon();
  }

  getPlace() {
    this.placeService.getAll()
      .then(
        (response: Place[]) => {
          this.placeList = response;
        }
      );
  }

  getBeacon() {
    this.beaconService.getAll()
      .then(
        (response: Beacon[]) => {
          this.optionsSelect = response.map((beacon) => {
            return {
              value: beacon.workplaceId,
              label: beacon.name,
            };
          });
        }
      );
  }

  createPlace() {
    this.placeService.create(this.placeCM)
      .then(
        () => {
          this.createModal.hide();
          this.placeList = [];
          this.getPlace();
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  removePlace() {
    this.placeService.remove(this.id)
      .then(
        () => {
          this.deleteModal.hide();
          this.placeList = [];
          this.getPlace();
        }
      );
  }

  changeBeacon(beaconId: number) {
    this.placeCM.address = this.optionsSelect[beaconId].label;
  }

  openCreateModal() {
    this.createModal.show();
  }

  openDeleteModal(id: number) {
    this.id = id;
    this.deleteModal.show();
  }

  openUpdateModal(place: Place) {
    const modalOptions: ModalOptions = {
      animated: true,
      class: 'modal-notify modal-primary',
      initialState: { place }
    };
    this.modalRef = this.modalService.show(PlaceUpdateComponent, modalOptions);
    this.modalRef.content.refresh.subscribe(() => this.getPlace());

  }
}
