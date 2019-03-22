import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';
import { ModalDirective, ToastService, UploadInput, UploadFile, humanizeBytes, UploadOutput } from 'ng-uikit-pro-standard';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { EmployeeUpdateComponent } from '../employee-update/employee-update.component';
import { ManagerService } from 'src/app/manager/services/manager.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { PaginationResponse } from 'src/app/core/models/shared';
import { AgmMap, MapsAPILoader } from '@agm/core';

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
  selector: 'app-laborer',
  templateUrl: './laborer.component.html',
  styleUrls: ['./laborer.component.scss']
})
export class LaborerComponent implements OnInit {

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

  id: number;
  searchText = '';
  employeeList: Employee[];
  employeeResponse: PaginationResponse;
  managerList = new Array<any>();
  optionsSex = new Array<any>();
  gender: number;
  modalRef: BsModalRef;
  employeeCM: Employee = new Employee();
  @ViewChild('create') createModal: ModalDirective;
  @ViewChild('delete') deleteModal: ModalDirective;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  url: any;
  filesToUpload: FileList;
  isExist = false;
  roleList = [];
  currentPage = 0;
  userAccount: Employee;
  isDuplicate = false;
  fieldSort = 'id';
  sortBoolean = false;
  sortValue = '';

  constructor(
    private employeeService: EmployeeService,
    private modalService: BsModalService,
    private managerService: ManagerService,
    private toastService: ToastService,
    private globalService: GlobalService,
    public mapsApiLoader: MapsAPILoader,
    ) {
    if (navigator) {
      navigator.geolocation.getCurrentPosition( pos => {
          this.location.lng = +pos.coords.longitude;
          this.location.lat = +pos.coords.latitude;
        });
      }
    this.mapsApiLoader = mapsApiLoader;

    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.optionsSex = this.globalService.optionsSex;
    this.userAccount = this.globalService.getUserAccount();
    this.getManager();
    this.getRole();
    this.getEmployee();
  }

  getEmployee() {
    this.userAccount.roleId === 1 ? this.getEmployeeByAdmin() : this.getEmployeeByManager();
  }

  getEmployeeByAdmin() {
    this.employeeService.getAll(this.sortValue, this.fieldSort, this.currentPage, 10)
      .then(
        (response: PaginationResponse) => {
          this.employeeList = response.content;
          this.employeeResponse = response;
        }
      );
  }

  getEmployeeByManager() {
    this.employeeService.getEmployeeByManager(this.userAccount.id, 3, this.sortValue, this.fieldSort, this.currentPage, 10)
      .then(
        (response: PaginationResponse) => {
          this.employeeResponse = response;
          this.employeeList = response.content;
        }
      );
  }

  getRole() {
    this.employeeService.getRole()
      .then(
        (response) => {
          response.shift();
          this.roleList = response.map((role) => {
            return {
              value: role.id,
              label: (role.id === 2) ? 'Quản lý' : 'Nhân viên',
            };
          });
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

  sort(field: string) {
    this.sortBoolean = ! this.sortBoolean;
    if (this.sortBoolean) {
      this.sortValue = 'asc';
    } else {
      this.sortValue = 'desc';
    }
    this.fieldSort = field;
    this.getEmployee();
  }

  // getEmployeeByManager() {
  //   this.employeeService.getEmployeeByManager(2, 'asc', 1, 5)
  //     .then(
  //       (response: PaginationResponse) => {
  //         console.log(response);
  //         this.employeeList = response.content;
  //       }
  //     );
  // }

  openCreateModal() {
    this.createModal.show();
  }

  openDeleteModal(id: number) {
    this.id = id;
    this.deleteModal.show();
  }

  openUpdateModal(employee: Employee) {
    const modalOptions: ModalOptions = {
      animated: true,
      class: 'modal-lg modal-notify modal-primary',
      initialState: { employee }
    };
    this.modalRef = this.modalService.show(EmployeeUpdateComponent, modalOptions);
    this.modalRef.content.refresh.subscribe(
      () => this.getEmployee()
    );

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
      return this.employeeList;
    }
    if (this.searchText) {
      return this.filterIt(this.employeeList, this.searchText);
    }
  }

  checkEmailExist() {
    this.employeeService.checkExist(this.employeeCM.email)
      .then(
        (response) => {
          this.isExist = response;
        }
      );
  }

  createEmployee() {
    this.employeeCM.fullName = `${this.employeeCM.firstName} ${this.employeeCM.lastName}`;
    this.employeeCM.address = this.location.address_level_1;
    this.employeeCM.longitude = this.location.lng;
    this.employeeCM.latitude = this.location.lat;
    this.filesToUpload ? this.createEmployeeWithImage() : this.createEmployeeWithoutImage();
  }

  createEmployeeWithImage() {
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
          (this.gender === 0) ? this.employeeCM.sex = false : this.employeeCM.sex = true;
          this.employeeCM.birthDate = this.globalService.convertToYearMonthDay(new Date(this.employeeCM.birthDate));
          this.employeeCM.picture = response;
          this.employeeService.create(this.employeeCM)
            .then(
              () => {
                this.toastService.success('Tạo nhân viên thành công', '', { positionClass: 'toast-bottom-right'} );
                this.createModal.hide();
                this.employeeList = [];
                this.getEmployee();
              },
              () => {
                this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
              }
            );
        },
        (error) => {
          console.error(error);
        }
      );
  }

  createEmployeeWithoutImage() {
    (this.gender === 0) ? this.employeeCM.sex = false : this.employeeCM.sex = true;
    this.employeeCM.birthDate = this.globalService.convertToYearMonthDay(new Date(this.employeeCM.birthDate));
    this.employeeService.create(this.employeeCM)
      .then(
        () => {
          this.toastService.success('Tạo nhân viên thành công', '', { positionClass: 'toast-bottom-right'} );
          this.createModal.hide();
          this.employeeList = [];
          this.getEmployee();
        },
        (error: any) => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

  removeEmployee() {
    this.employeeService.checkConstraint(this.id)
      .then(
        (res) => {
          if (res.removable) {
            this.employeeService.remove(this.id)
              .then(
                () => {
                  this.toastService.success('Xóa nhân viên thành công', '', { positionClass: 'toast-bottom-right'} );
                  this.deleteModal.hide();
                  this.employeeList = [];
                  this.getEmployee();
                },
                () => {
                  this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
                }
              );
          } else {
          this.toastService.error(res.message , '', { positionClass: 'toast-bottom-right'});
          }
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

        this.url = event1.target.result;

        this.employeeCM.picture ? this.employeeCM.picture = event1.target.result : this.url = event1.target.result;

      };

      this.filesToUpload = event.target.files;

    }
  }

  changePage(event) {
    this.currentPage = event - 1;
    this.getEmployee();
  }

  checkDuplicateId() {
    this.employeeService.checkDuplicateId(this.employeeCM.employeeId)
      .then(
        (res) => {
          this.isDuplicate = res;
        }
      );
  }

  checkConstraint() {
    this.employeeService.checkDuplicateId(this.employeeCM.employeeId)
      .then(
        (res) => {
          this.isDuplicate = res;
        }
      );
  }

  updateOnMap() {
    let full_address: string = this.location.address_level_1 || '';
    if (this.location.address_level_2) { full_address = full_address + ' ' + this.location.address_level_2; }
    if (this.location.address_state) { full_address = full_address + ' ' + this.location.address_state; }
    if (this.location.address_country) { full_address = full_address + ' ' + this.location.address_country; }

    this.findLocation(full_address);
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
          this.location.lat = results[0].geometry.location.lat();
          this.location.lng = results[0].geometry.location.lng();
          this.location.marker.lat = results[0].geometry.location.lat();
          this.location.marker.lng = results[0].geometry.location.lng();
          this.location.marker.draggable = true;
          this.location.viewport = results[0].geometry.viewport;
        }

        this.map.triggerResize();
      } else {
        alert('Sorry, this search produced no results.');
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
