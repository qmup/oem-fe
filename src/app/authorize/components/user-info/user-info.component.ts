import { Component, OnInit, Input } from '@angular/core';
import { UserAccount } from '../../models/token';
import { AuthGuardService } from 'src/app/core/services/auth-guard.service';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/core/services/global.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  @Input() userAccount: UserAccount;

  constructor(
    private authGuardService: AuthGuardService,
    private router: Router,
    private globalService: GlobalService
  ) { }

  ngOnInit() {
  }

  logOut() {
    this.authGuardService.clearToken();
    this.globalService.isLogin = false;
    this.router.navigate(['login']);
  }

}
