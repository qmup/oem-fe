import { Component, OnInit, ViewChild } from '@angular/core';
import { BeaconService } from '../../services/beacon.service';
import { BsModalService, ModalOptions, BsModalRef, ModalDirective } from 'ngx-bootstrap';
import { Beacon } from '../../models/beacon';
import { BeaconUpdateComponent } from '../beacon-update/beacon-update.component';
import { PlaceService } from 'src/app/place/services/place.service';
import { Place } from 'src/app/place/models/place';
import { ToastService } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-beacon',
  templateUrl: './beacon.component.html',
  styleUrls: ['./beacon.component.scss']
})
export class BeaconComponent implements OnInit {
  id: number;
  beaconCM: Beacon = new Beacon();
  beaconList: any[];
  modalRef: BsModalRef;
  optionsSelect = new Array<any>();
  haveWorkplace: boolean;
  @ViewChild('create') createModal: ModalDirective;
  @ViewChild('delete') deleteModal: ModalDirective;
  asd: any;

  searchText: string;
  placeList: Place[];

  constructor(
    private beaconService: BeaconService,
    private modalService: BsModalService,
    private workplaceService: PlaceService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.getBeacon();
    // this.getPlace();
  }

  getBeacon() {
    this.beaconService.getAll()
      .then(
        (response: any[]) => {
          this.beaconList = response;
          this.beaconList[0].minor = '1132';
          this.beaconList[0].major = '4421';
          this.beaconList[0].uuid = '12g31wqe28ne31df3g18124';
          this.beaconList[0].address = 'Nhà vệ sinh 1';
          this.beaconList[1].minor = '1293';
          this.beaconList[1].major = '4569';
          this.beaconList[1].address = 'Nhà vệ sinh 2';
          this.beaconList[1].uuid = 'f2u3fnu8dfne3jknfne';
          this.beaconList[2].minor = '1237';
          this.beaconList[2].major = '4563';
          this.beaconList[2].uuid = '2398gh394hnfndu239f';
          this.beaconList[2].address = 'Nhà vệ sinh 3';
          for (let index = 0; index < this.beaconList.length; index++) {
            const element = this.beaconList[index];
            // if (element.workplace) {
            //   element.placeName = `${element.workplace.address}` + ' - ' + `${element.workplace.name}`;
            // }
          }
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
    if (!this.haveWorkplace) {
      this.beaconCM.workplace = null;
      this.beaconCM.workplaceId = null;
    }
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

  search() {
    if (!this.searchText) {
      return this.beaconList;
    }
    if (this.searchText) {
      return this.filterIt(this.beaconList, this.searchText);
    }
  }
}
