import { Component, OnInit, EventEmitter } from '@angular/core';
import { Place } from '../../models/place';
import { BsModalRef } from 'ngx-bootstrap';
import { PlaceService } from '../../services/place.service';
import { Beacon } from 'src/app/beacon/models/beacon';
import { BeaconService } from 'src/app/beacon/services/beacon.service';
import { ToastService, UploadFile, UploadInput, humanizeBytes, UploadOutput } from 'ng-uikit-pro-standard';

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
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  url: any;
  filesToUpload: FileList;

  constructor(
    public modalRef: BsModalRef,
    private placeService: PlaceService,
    private beaconService: BeaconService,
    private toastService: ToastService,
    ) {
      this.files = [];
      this.uploadInput = new EventEmitter<UploadInput>();
      this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.getBeacon();
    console.log(this.optionsSelect);
  }

  updatePlace() {
    this.placeService.update(this.place)
      .then(
        response => {
          this.toastService.success('Cập nhật nơi làm việc thành công', '', { positionClass: 'toast-bottom-right'} );
          this.modalRef.hide();
          this.refresh.emit();
        },
        () => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
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
              label: beacon.name
            };
          });
        }
      );
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

      this.filesToUpload = event.target.files;

    }
  }

}
