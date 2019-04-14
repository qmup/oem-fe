import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { AuthService } from '../../services/auth.service';
import { Employee } from 'src/app/employee/models/employee';
import { GlobalService } from 'src/app/core/services/global.service';
import { ToastService } from 'ng-uikit-pro-standard';
import { AuthGuardService } from 'src/app/core/services/auth-guard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-change-password',
  templateUrl: './profile-change-password.component.html',
  styleUrls: ['./profile-change-password.component.scss']
})
export class ProfileChangePasswordComponent implements OnInit {

  password = '';
  confirm = '';
  userAccount: Employee;
  oldPass: string;

  constructor(
    public modalRef: BsModalRef,
    private globalService: GlobalService,
    private toastService: ToastService,
    private authGuardService: AuthGuardService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.userAccount = this.globalService.getUserAccount();
  }

  changePassword() {
    this.authService.changePassword(this.userAccount.email, this.password, this.oldPass)
      .then(
        (res) => {
          if (res) {
            this.modalRef.hide();
            this.toastService.success('Vui lòng đăng nhập lại', 'Đổi thành công', { positionClass: 'toast-bottom-right' });
            this.authGuardService.clearToken();
            this.router.navigate(['login']);
            this.globalService.isLogin = false;
          } else {
            this.toastService.error('Đã có lỗi xảy ra', 'Lỗi', { positionClass: 'toast-bottom-right' });
          }
        }
      );
  }

}
