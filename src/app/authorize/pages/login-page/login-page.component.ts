import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/core/services/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(
    private globalService: GlobalService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  login() {
    this.globalService.isLogin = true;
    this.router.navigate(['']);
  }

}
