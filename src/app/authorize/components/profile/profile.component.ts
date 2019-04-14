import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/core/services/global.service';
import { Employee } from 'src/app/employee/models/employee';
import { DashboardService } from 'src/app/dashboard/services/dashboard.service';
import { SummaryTask } from 'src/app/dashboard/models/summary-task';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ProfileUpdateAvatarComponent } from '../profile-update-avatar/profile-update-avatar.component';
import { ProfileUpdateInformationComponent } from '../profile-update-information/profile-update-information.component';
import { ProfileChangePasswordComponent } from '../profile-change-password/profile-change-password.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  info: Employee;
  defaultImage = '../../../../assets/default-image.jpg';
  startTime = new Date();
  summaryTask: SummaryTask;
  modalRef: BsModalRef;

  constructor(
    private globalService: GlobalService,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.info = this.globalService.getUserAccount();
  }

  changeAvatar() {
    const modalOptions: ModalOptions = {
      animated: true,
      class: 'modal-notify modal-primary',
      initialState: { avatar: this.info.picture }
    };
    this.modalRef = this.modalService.show(ProfileUpdateAvatarComponent, modalOptions);
    this.modalRef.content.refresh.subscribe(
      () => this.info = this.globalService.getUserAccount()
    );
  }

  changeInformation() {
    const modalOptions: ModalOptions = {
      animated: true,
      class: 'modal-lg modal-notify modal-primary',
      initialState: { info: this.info }
    };
    this.modalRef = this.modalService.show(ProfileUpdateInformationComponent, modalOptions);
    this.modalRef.content.refresh.subscribe(
      () => this.info = this.globalService.getUserAccount()
    );
  }

  changePassword() {
    const modalOptions: ModalOptions = {
      animated: true,
      class: 'modal-md modal-notify modal-primary',
    };
    this.modalRef = this.modalService.show(ProfileChangePasswordComponent, modalOptions);
  }

}
