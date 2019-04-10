import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { Employee } from '../../models/employee';
import { BsModalRef } from 'ngx-bootstrap';
import { EmployeeService } from '../../services/employee.service';
import { ToastService, humanizeBytes, UploadInput, UploadFile, UploadOutput } from 'ng-uikit-pro-standard';
import { ManagerService } from 'src/app/manager/services/manager.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { PaginationResponse } from 'src/app/core/models/shared';
import { AgmMap } from '@agm/core';
import { CoordinateService } from 'src/app/core/services/coordinate.service';
import { Coordinate } from 'src/app/core/models/coordinate';

declare var google: any;

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

interface Location {
  lat: number;
  lng: number;
  viewport?: Object;
  zoom: number;
  address_level_1?: string;
  address_level_2?: string;
  address_country?: string;
  address_zip?: string;
  address_state?: string;
  marker?: Marker;
}

@Component({
  selector: 'app-employee-update',
  templateUrl: './employee-update.component.html',
  styleUrls: ['./employee-update.component.scss']
})
export class EmployeeUpdateComponent implements OnInit {

  geocoder: any;
  public location: Location = {
    lat: 51.678418,
    lng: 7.809007,
    marker: {
      lat: 51.678418,
      lng: 7.809007,
      draggable: true
    },
    zoom: 15
  };

  @ViewChild(AgmMap) map: AgmMap;

  coordinate: Coordinate = new Coordinate();
  gender: number;
  employee: Employee;
  employeeUM: Employee = new Employee();
  optionsSelect: { value: number; label: string; }[];
  optionsSex: { value: number; label: string; }[];
  refresh: EventEmitter<any> = new EventEmitter<any>();
  filesToUpload: FileList;
  managerList = [];
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  url: any;
  isExist: boolean;
  roleList: any;
  isDuplicate = false;
  role: number;
  timeoutSearch: any;
  timeoutSearchMap: any;
  warningMessage = [];
  canChange: boolean;

  constructor(
    public modalRef: BsModalRef,
    private employeeService: EmployeeService,
    private toastService: ToastService,
    private coordinateSerivce: CoordinateService,
    private globalService: GlobalService
    ) {
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.getManager();
    this.getRole();
    this.optionsSex = [
      { value: 1, label: 'Nam'},
      { value: 2, label: 'Nữ'},
    ];
    if (this.employee.sex === true) {
      this.gender = 1;
    } else {
      this.gender = 2;
    }
    this.location.address_level_1 = this.employee.address;
    this.location.lat = this.employee.latitude;
    this.location.lng = this.employee.longitude;
  }

  checkEmailExist() {
    this.employeeService.checkExist(this.employee.email)
      .then(
        (response) => {
          this.isExist = response;
        }
      );
  }

  getRole() {
    this.employeeService.getRole()
      .then(
        (response) => {
          response.shift();
          response.splice(2, 1);
          this.roleList = response.map((role) => {
            return {
              value: role.id,
              label: role.roleName,
            };
          });
        }
      );
  }

  selectRole(e: any) {
    this.employeeService.checkConstraint(this.employee.id)
      .then(
        (res) => {
          if (res.removeAble) {
            this.canChange = res.removeAble;
            this.employee.roleId = e.value;
          } else {
            this.canChange = res.removeAble;
            this.employee.roleId = this.employee.roleId;
            this.warningMessage = [];
            this.warningMessage = res.message.split(';');
          }
        }
      );
  }

  getManager() {
    this.employeeService.getByRole(2, '', '', 'id', 0, 10)
      .then(
        (response: PaginationResponse) => {
          this.managerList = response.content.map((manager) => {
            return {
              value: manager.id,
              label: manager.fullName,
              icon: manager.picture
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

  updateEmployee() {
    this.employeeUM.latitude = this.employee.latitude;
    this.employeeUM.longitude = this.employee.longitude;
    this.employeeUM.address = this.location.address_level_1;
    this.employeeUM.status = this.employee.status;
    this.employee.fullName = `${this.employee.firstName} ${this.employee.lastName}`;
    this.employeeUM.id = this.employee.id;
    this.employeeUM.employeeId = this.employee.employeeId;
    this.employeeUM.firstName = this.employee.firstName;
    this.employeeUM.fullName = this.employee.fullName;
    this.employeeUM.picture = this.employee.picture;
    this.employeeUM.lastName = this.employee.lastName;
    this.employeeUM.password = this.employee.password;
    this.employeeUM.managerId = this.employee.managerId;
    this.employeeUM.phoneMacAddress = this.employee.phoneMacAddress;
    this.employeeUM.phoneNumber = this.employee.phoneNumber;
    this.employeeUM.resetPasswordToken = this.employee.resetPasswordToken;
    this.employeeUM.roleId = this.employee.roleId;
    this.employeeUM.sex = this.employee.sex;
    (this.gender === 1) ? this.employeeUM.sex = true : this.employeeUM.sex = false;
    this.employeeUM.birthDate = this.globalService.convertToYearMonthDay(new Date(this.employee.birthDate));
    this.employeeUM.email = this.employee.email;
    this.employeeUM.coordinateId = this.employee.coordinateId;
    this.coordinate.id = this.employee.coordinateId;
    this.coordinate.latitude = this.employee.latitude;
    this.coordinate.longitude = this.employee.longitude;
    if (this.employeeUM.roleId === 2) {
      this.employeeUM.managerId = 0;
    }
    this.filesToUpload ? this.updateEmployeeWithImage() : this.updateEmployeeWithoutImage();
  }

  updateEmployeeWithImage() {
    const formData: FormData = new FormData();
    if (!!this.filesToUpload) {
      for (let index = 0; index < this.filesToUpload.length; index++) {
        const file: File = this.filesToUpload[index];
        formData.append('dataFile', file);
      }
    }
    this.globalService.uploadFile(formData, 'image/employee/')
      .then(
        (response) => {
          this.employeeUM.picture = response;
          this.coordinateSerivce.update(this.coordinate)
            .then(
              () => {
                this.employeeService.update(this.employeeUM)
                  .then(
                    () => {
                      this.toastService.success('Cập nhật thông tin thành công', '', { positionClass: 'toast-bottom-right'} );
                      this.modalRef.hide();
                      this.refresh.emit();
                    },
                    () => {
                      this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
                    }
                  );
              }
            );
        },
        (error) => {
          console.error(error);
        }
      );
  }

  updateEmployeeWithoutImage() {
    this.coordinateSerivce.update(this.coordinate)
      .then(
        () => {
          this.employeeService.update(this.employeeUM)
            .then(
              () => {
                this.toastService.success('Cập nhật thông tin thành công', '', { positionClass: 'toast-bottom-right'} );
                this.modalRef.hide();
                this.refresh.emit();
              },
              () => {
                this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
              }
            );
        }
      );
  }

  changeAddress(e: any) {
    this.location.address_level_1 = e;
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

        this.url = event1.target.result;

        this.employee.picture ? this.employee.picture = event1.target.result : this.url = event1.target.result;

      };

      this.filesToUpload = event.target.files;

    }
  }

  checkDuplicateId() {
    this.employeeService.checkDuplicateId(this.employee.employeeId)
      .then(
        (res) => {
          this.isDuplicate = res;
        }
      );
  }

  updateOnMap() {
    if (this.timeoutSearchMap) {
      clearTimeout(this.timeoutSearchMap);
    }
    this.timeoutSearchMap = setTimeout(() => {
      if (this.location.address_level_1) {
        let full_address: string = this.location.address_level_1 || '';
        if (this.location.address_level_2) { full_address = full_address + ' ' + this.location.address_level_2; }
        if (this.location.address_state) { full_address = full_address + ' ' + this.location.address_state; }
        if (this.location.address_country) { full_address = full_address + ' ' + this.location.address_country; }

        this.findLocation(full_address);
      }
    }, 500);
  }

  findLocation(address) {
    if (!this.geocoder) { this.geocoder = new google.maps.Geocoder(); }
    this.geocoder.geocode({
      'address': address
    }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        for (let i = 0; i < results[0].address_components.length; i++) {
          const types = results[0].address_components[i].types;

          if (types.indexOf('locality') !== -1) {
            this.location.address_level_2 = results[0].address_components[i].long_name;
          }
          if (types.indexOf('country') !== -1) {
            this.location.address_country = results[0].address_components[i].long_name;
          }
          if (types.indexOf('postal_code') !== -1) {
            this.location.address_zip = results[0].address_components[i].long_name;
          }
          if (types.indexOf('administrative_area_level_1') !== -1) {
            this.location.address_state = results[0].address_components[i].long_name;
          }
        }

        if (results[0].geometry.location) {
          this.employee.latitude = results[0].geometry.location.lat();
          this.employee.longitude = results[0].geometry.location.lng();
          this.location.marker.lat = results[0].geometry.location.lat();
          this.location.marker.lng = results[0].geometry.location.lng();
          this.location.marker.draggable = true;
          this.location.viewport = results[0].geometry.viewport;
        }

        this.map.triggerResize();
      } else {
        this.toastService.warning('Không tìm thấy địa chỉ trên Google Map' , 'Không tìm thấy', { positionClass: 'toast-bottom-right'});
      }
    });
  }

  findAddressByCoordinates() {
    this.geocoder.geocode({
      'location': {
        lat: this.location.marker.lat,
        lng: this.location.marker.lng
      }
    }, (results, status) => {
      this.decomposeAddressComponents(results);
    });
  }

  decomposeAddressComponents(addressArray) {
    if (addressArray.length === 0) { return false; }
    const address = addressArray[0].address_components;

    for (const element of address) {
      if (element.length === 0 && !element['types']) { continue; }

      if (element['types'].indexOf('street_number') > -1) {
        this.location.address_level_1 = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('route') > -1) {
        this.location.address_level_1 += ', ' + element['long_name'];
        continue;
      }
      if (element['types'].indexOf('locality') > -1) {
        this.location.address_level_2 = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('administrative_area_level_1') > -1) {
        this.location.address_state = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('country') > -1) {
        this.location.address_country = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('postal_code') > -1) {
        this.location.address_zip = element['long_name'];
        continue;
      }
    }
  }

}
