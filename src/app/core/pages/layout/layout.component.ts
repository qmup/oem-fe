import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AuthGuardService } from '../../services/auth-guard.service';
import { GlobalService } from '../../services/global.service';
import { Router } from '@angular/router';
import { UserAccount } from 'src/app/authorize/models/token';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  @Input() isLogin: boolean;
  userAccount: UserAccount;
  routerSubscription: Subscription;
  constructor(
    private authGuardService: AuthGuardService,
    public globalService: GlobalService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userAccount = this.globalService.getUserAccount();
  }

  logOut() {
    this.authGuardService.clearToken();
    this.globalService.isLogin = false;
    this.router.navigate(['login']);
  }

}
