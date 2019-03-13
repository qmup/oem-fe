import { Component, OnInit, Input } from '@angular/core';
import { AuthGuardService } from '../../services/auth-guard.service';
import { GlobalService } from '../../services/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  @Input() isLogin: boolean;

  constructor(
    private authGuardService: AuthGuardService,
    public globalService: GlobalService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  logOut() {
    this.authGuardService.clearToken();
    this.router.navigate(['login']);
  }

}
