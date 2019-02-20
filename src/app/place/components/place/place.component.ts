import { Component, OnInit, ViewChild } from '@angular/core';
import { PlaceService } from '../../services/place.service';
import { Place } from '../../models/place';
import { BsModalService, ModalDirective, ModalOptions, BsModalRef } from 'ngx-bootstrap';
import { PlaceUpdateComponent } from '../place-update/place-update.component';
import { Beacon } from 'src/app/beacon/models/beacon';
import { BeaconService } from 'src/app/beacon/services/beacon.service';
import { ToastService } from 'ng-uikit-pro-standard';

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
  beaconName: string;
  @ViewChild('create') createModal: ModalDirective;
  @ViewChild('delete') deleteModal: ModalDirective;

  constructor(
    private placeService: PlaceService,
    private beaconService: BeaconService,
    private modalService: BsModalService,
    private toastService: ToastService,
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
          for (let index = 0; index < this.placeList.length; index++) {
            const element = this.placeList[index];
            this.beaconService.getByWorkplace(element.id)
              .then(
                (response2: Beacon) => {
                  if (response2) {
                    element.beaconName = response2.name;
                  }
                }
              );
          }
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
          this.toastService.success('Tạo nơi làm việc thành công', '', { positionClass: 'toast-bottom-right'} );
          this.createModal.hide();
          this.placeList = [];
          this.getPlace();
        },
        (error: any) => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

  removePlace() {
    this.placeService.remove(this.id)
      .then(
        () => {
          this.toastService.success('Xóa nơi làm việc thành công', '', { positionClass: 'toast-bottom-right'} );
          this.deleteModal.hide();
          this.placeList = [];
          this.getPlace();
        },
        () => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
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
