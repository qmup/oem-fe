import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { PlaceService } from '../../services/place.service';
import { Place } from '../../models/place';
import { BsModalService, ModalDirective, ModalOptions, BsModalRef } from 'ngx-bootstrap';
import { PlaceUpdateComponent } from '../place-update/place-update.component';
import { Beacon } from 'src/app/beacon/models/beacon';
import { BeaconService } from 'src/app/beacon/services/beacon.service';
import { ToastService, UploadFile, UploadInput, humanizeBytes, UploadOutput } from 'ng-uikit-pro-standard';

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
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  url: any;

  constructor(
    private placeService: PlaceService,
    private beaconService: BeaconService,
    private modalService: BsModalService,
    private toastService: ToastService,
    ) {
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

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

  showFiles() {
    let files = '';
    for (let i = 0; i < this.files.length; i ++) {
      files += this.files[i].name;
       if (!(this.files.length - 1 === i)) {
         files += ',';
      }
    }
    return files;
 }

  startUpload(): void {
    const event: UploadInput = {
    type: 'uploadAll',
    url: 'your-path-to-backend-endpoint',
    method: 'POST',
    data: { foo: 'bar' },
    };
    this.files = [];
    this.uploadInput.emit(event);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  onUploadOutput(output: UploadOutput | any): void {

    if (output.type === 'allAddedToQueue') {
    } else if (output.type === 'addedToQueue') {
      this.files.push(output.file); // add file to array when added
    } else if (output.type === 'uploading') {
      // update current data in files array for uploading file
      const index = this.files.findIndex(file => file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
    this.showFiles();
  }

  onSelectFile(event: any) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event1: any) => { // called once readAsDataURL is completed

        // this.employee.picture ? this.employee.picture = event1.target.result : this.url = event1.target.result;

      };
    }
  }
}
