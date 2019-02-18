import { Component, OnInit, ViewChild } from '@angular/core';
import { BeaconService } from '../../services/beacon.service';
import { BsModalService, ModalOptions, BsModalRef, ModalDirective } from 'ngx-bootstrap';
import { Beacon } from '../../models/beacon';
import { BeaconUpdateComponent } from '../beacon-update/beacon-update.component';
import { PlaceService } from 'src/app/place/services/place.service';
import { Place } from 'src/app/place/models/place';

@Component({
  selector: 'app-beacon',
  templateUrl: './beacon.component.html',
  styleUrls: ['./beacon.component.scss']
})
export class BeaconComponent implements OnInit {
  id: number;
  beaconCM: Beacon = new Beacon();
  beaconList: Beacon[];
  modalRef: BsModalRef;
  optionsSelect = new Array<any>();
  workplaceName: string[];
  haveWorkplace: boolean;
  @ViewChild('create') createModal: ModalDirective;
  @ViewChild('delete') deleteModal: ModalDirective;

  searchText: string;
  placeList: Place[];
  // tableData = [
  //   { id: '1', floorName: 'Floor 1', location: '12.12312312312; -23.2323232323', time: '2015-04-20 12:12',
  //   uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e', minor: '01a1', major: '0be6'},
  //   { id: '2', floorName: 'Floor 2', location: '12.12312312312; -23.2323232323', time: '2015-04-20 12:12',
  //   uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e', minor: '01a2', major: '0be6'},
  //   { id: '3', floorName: 'Floor 3', location: '12.12312312312; -23.2323232323', time: '2015-04-20 12:12',
  //   uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e', minor: '01a3', major: '0be6'},
  //   { id: '4', floorName: 'Floor 4', location: '12.12312312312; -23.2323232323', time: '2015-04-20 12:12',
  //   uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e', minor: '01a4', major: '0be6'},
  //   { id: '5', floorName: 'Floor 5', location: '12.12312312312; -23.2323232323', time: '2015-04-20 12:12',
  //   uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e', minor: '01a5', major: '0be6'},
  //   { id: '6', floorName: 'Floor 6', location: '12.12312312312; -23.2323232323', time: '2015-04-20 12:12',
  //   uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e', minor: '01a6', major: '0be6'},
  // ];

  constructor(
    private beaconService: BeaconService,
    private modalService: BsModalService,
    private placeService: PlaceService,
  ) {}

  ngOnInit() {
    this.getBeacon();
    this.getPlace();
  }

  getBeacon() {
    this.beaconService.getAll()
      .then(
        (response: Beacon[]) => {
          this.beaconList = response;
        }
      );
  }

  getPlace() {
    this.placeService.getAll()
      .then(
        (response: Place[]) => {
          this.placeList = response;
          this.optionsSelect = response.map((place) => {
            return {
              value: place.id,
              label: place.name
            };
          });
        }
      );
  }

  getWorkplaceName() {
    for (let index = 0; index < this.beaconList.length; index++) {
      const element = this.beaconList[index];
      return (this.placeList.find(x => x.id === element.workplaceId).address);
    }
  }

  createBeacon() {
    if (!this.haveWorkplace) {
      this.beaconCM.workplaceId = 0;
    }
    this.beaconService.create(this.beaconCM)
      .then(
        () => {
          this.createModal.hide();
          this.beaconList = [];
          this.getBeacon();
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  removeBeacon() {
    this.beaconService.remove(this.id)
      .then(
        () => {
          this.deleteModal.hide();
          this.beaconList = [];
          this.getBeacon();
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
        return obj[key].includes(searchKey);
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
