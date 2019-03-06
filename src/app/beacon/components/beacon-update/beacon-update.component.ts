import { Component, OnInit, EventEmitter } from '@angular/core';
import { BeaconService } from '../../services/beacon.service';
import { BsModalRef } from 'ngx-bootstrap';
import { Beacon } from '../../models/beacon';
import { PlaceService } from 'src/app/place/services/place.service';
import { Place } from 'src/app/place/models/place';
import { ToastService } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-beacon-update',
  templateUrl: './beacon-update.component.html',
  styleUrls: ['./beacon-update.component.scss']
})
export class BeaconUpdateComponent implements OnInit {

  beacon: Beacon;
  beaconUM: Beacon = new Beacon();
  optionsSelect: { value: number; label: string; }[];
  refresh: EventEmitter<any> = new EventEmitter<any>();
  placeList: Place[];


  constructor(
    public modalRef: BsModalRef,
    private beaconService: BeaconService,
    private workplaceService: PlaceService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    // this.getPlace();
  }

  updateBeacon() {
    const options = { positionClass: 'toast-bottom-right' };
    this.beaconService.update(this.beacon)
      .then(
        () => {
          this.toastService.success('Cập nhật beacon thành công', '', options );
          this.modalRef.hide();
          this.refresh.emit();
        },
        () => {
          this.toastService.error('Đã có lỗi xảy ra' , '', options );

        }
      );
  }

  // getPlace() {
  //   this.workplaceService.getAll()
  //     .then(
  //       (response: Place[]) => {
  //         this.optionsSelect = response.map((place) => {
  //           return {
  //             value: place.id,
  //             label: place.name
  //           };
  //         });
  //       }
  //     );
  // }
}
