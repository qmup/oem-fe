import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { Company } from '../../models/company';
import { BsModalRef, ModalDirective, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { UploadFile, UploadInput, ToastService, humanizeBytes, UploadOutput } from 'ng-uikit-pro-standard';
import { CompanyService } from '../../services/company.service';
import { CompanyUpdateComponent } from '../company-update/company-update.component';
import { Employee } from 'src/app/employee/models/employee';
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
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
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
  userAccount: Employee;
  companyCM: Company = new Company();
  companyList: Company[];
  modalRef: BsModalRef;
  optionsSelect = new Array<any>();
  @ViewChild('create') createModal: ModalDirective;
  @ViewChild('delete') deleteModal: ModalDirective;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  url: any;
  filesToUpload: FileList;
  currentPage = 0;
  companyResponse: PaginationResponse;
  defaultImage = '../../../../assets/default-image.jpg';
  showAll = false;
  timeoutSearchMap: any;
  warningMessage: any[];
  companyStatusList = [];
  currentStatus = 1;
  searchText = '';
  timeoutSearch: any;

  constructor(
    private companyService: CompanyService,
    private modalService: BsModalService,
    private toastService: ToastService,
    private globalService: GlobalService,
    public mapsApiLoader: MapsAPILoader
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
    this.companyStatusList = this.globalService.companyStatus;
    this.userAccount = this.globalService.getUserAccount();
    this.getCompany();
  }

  getCompany() {
    this.userAccount.roleId === 1 ? this.getCompanyByAdmin() : this.getCompanyByManager();
  }


  getCompanyByAdmin() {
    this.companyService.getAll('', this.searchText, 'id', this.currentStatus, 0, 6)
      .then(
        (response: PaginationResponse) => {
          this.companyResponse = response;
          this.companyList = response.content;
        }
      );
  }

  getCompanyByManager() {
    this.companyService.getCompanyByManager(this.userAccount.id, '',  this.searchText, 'id', this.currentPage, 6)
      .then(
        (response: PaginationResponse) => {
          this.companyResponse = response;
          this.companyList = response.content;
        }
      );
  }

  search() {
    if (this.timeoutSearch) {
      clearTimeout(this.timeoutSearch);
    }
    this.timeoutSearch = setTimeout(() => {
      this.getCompany();
    }, 500);
  }

  createCompany() {
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
          this.companyCM.address = this.location.address_level_1;
          this.companyCM.picture = response;
          this.companyCM.latitude = this.location.lat;
          this.companyCM.longitude = this.location.lng;
          this.companyService.create(this.companyCM)
            .then(
              () => {
                this.toastService.success('Tạo công ty thành công', '', { positionClass: 'toast-bottom-right'} );
                this.createModal.hide();
                this.companyList = [];
                this.getCompany();
              },
              (error: any) => {
                this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
              }
            );
        }
      );
  }

  checkRemovable(id: number) {
    this.warningMessage = [];
    this.companyService.checkRemove(id)
      .then(
        (response: any) => {
          response.removeAble ?
          this.deleteModal.show() :
          (this.warningMessage = response.message.split(';'), this.deleteModal.show());
        }
      );
  }

  removeCompany() {
    this.companyService.remove(this.id)
      .then(
        (response) => {
          if (response) {
            this.toastService.success('Xóa công ty thành công', '', { positionClass: 'toast-bottom-right'} );
            this.deleteModal.hide();
            this.companyList = [];
            this.getCompany();
          } else {
            this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
            this.deleteModal.hide();
          }
        },
        () => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
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

  openUpdateModal(company: Company) {
    const modalOptions: ModalOptions = {
      animated: true,
      class: 'modal-notify modal-primary',
      initialState: { company }
    };
    this.modalRef = this.modalService.show(CompanyUpdateComponent, modalOptions);
    this.modalRef.content.refresh.subscribe(() => this.getCompany());

  }

  changePage(event) {
    this.currentPage = event - 1;
    this.getCompany();
  }

  // show + update files

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

        this.companyCM.picture ? this.companyCM.picture = event1.target.result : this.url = event1.target.result;

      };

      this.filesToUpload = event.target.files;

    }
  }

  // Google map

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
          this.location.lat = results[0].geometry.location.lat();
          this.location.lng = results[0].geometry.location.lng();
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
