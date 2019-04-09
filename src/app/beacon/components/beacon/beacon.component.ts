import { Component, OnInit, ViewChild } from '@angular/core';
import { BeaconService } from '../../services/beacon.service';
import { BsModalService, ModalOptions, BsModalRef, ModalDirective } from 'ngx-bootstrap';
import { Beacon } from '../../models/beacon';
import { BeaconUpdateComponent } from '../beacon-update/beacon-update.component';
import { PlaceService } from 'src/app/place/services/place.service';
import { Place } from 'src/app/place/models/place';
import { ToastService } from 'ng-uikit-pro-standard';
import { PaginationResponse } from 'src/app/core/models/shared';

@Component({
  selector: 'app-beacon',
  templateUrl: './beacon.component.html',
  styleUrls: ['./beacon.component.scss']
})
export class BeaconComponent implements OnInit {
  id: number;
  beaconCM: Beacon = new Beacon();
  beaconList = [];
  modalRef: BsModalRef;
  optionsSelect = new Array<any>();
  haveWorkplace: boolean;
  @ViewChild('create') createModal: ModalDirective;
  @ViewChild('delete') deleteModal: ModalDirective;
  currentPage = 0;

  searchText: string;
  placeList: Place[];
  beaconResponse: PaginationResponse;
  timeoutSearch: any;

  constructor(
    private beaconService: BeaconService,
    private modalService: BsModalService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.getBeacon();
  }

  getBeacon() {
    this.beaconService.getAll('', 'id', this.currentPage, 10)
      .then(
        (response: PaginationResponse) => {
          this.beaconList = response.content;
          this.beaconResponse = response;
        }
      );
  }

  // getPlace() {
  //   this.workplaceService.getAll()
  //     .then(
  //       (response: Place[]) => {
  //         this.placeList = response;
  //         this.optionsSelect = response.map((place) => {
  //           return {
  //             value: place.id,
  //             label: place.name
  //           };
  //         });
  //       }
  //     );
  // }

  createBeacon() {
    const options = { positionClass: 'toast-bottom-right' };
    this.beaconCM.workplaceId = 0;
    this.beaconService.create(this.beaconCM)
      .then(
        () => {
          this.toastService.success('Tạo mới beacon thành công', '', options);
          this.createModal.hide();
          this.beaconList = [];
          this.getBeacon();
        },
        () => {
          this.toastService.error('Đã có lỗi xảy ra' , '', options);
        }
      );
  }

  removeBeacon() {
    const options = { positionClass: 'toast-bottom-right' };
    this.beaconService.remove(this.id)
      .then(
        () => {
          this.toastService.success('Xóa beacon thành công', '', options);
          this.deleteModal.hide();
          this.beaconList = [];
          this.getBeacon();
        },
        () => {
          this.toastService.error('Đã có lỗi xảy ra' , '', options);
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

  openUpdateModal(beacon: Beacon) {
    const modalOptions: ModalOptions = {
      animated: true,
      class: 'modal-notify modal-primary',
      initialState: { beacon }
    };
    this.modalRef = this.modalService.show(BeaconUpdateComponent, modalOptions);
    this.modalRef.content.refresh.subscribe(() => this.getBeacon());

  }

  filterIt(arr: any, searchKey: any) {
    return arr.filter((obj: any) => {
      return Object.keys(obj).some((key) => {
        if (obj[key] !== null) {
          const tempKey = obj[key].toString().toLowerCase();
          const tempSearch = searchKey.toLowerCase();
          return tempKey.includes(tempSearch);
        }
      });
    });
  }

  searchBeacon() {
    if (this.timeoutSearch) {
      clearTimeout(this.timeoutSearch);
    }
    this.timeoutSearch = setTimeout(() => {
      this.getBeacon();
    }, 500);
  }

  changePage(event) {
    this.currentPage = event - 1;
    this.getBeacon();
  }
}
