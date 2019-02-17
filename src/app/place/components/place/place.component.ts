import { Component, OnInit, ViewChild } from '@angular/core';
import { PlaceService } from '../../services/place.service';
import { Place } from '../../models/place';
import { BsModalService, ModalDirective, ModalOptions, BsModalRef } from 'ngx-bootstrap';
import { PlaceUpdateComponent } from '../place-update/place-update.component';

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
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.getPlace();
    this.optionsSelect = [
      { value: 1, label: 'Beacon 1' },
      { value: 2, label: 'Beacon 2' },
      { value: 3, label: 'Beacon 3' },
    ];
  }

  getPlace() {
    this.placeService.getAll()
      .then(
        (response: Place[]) => {
          this.placeList = response;
          console.log(this.placeList);
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
