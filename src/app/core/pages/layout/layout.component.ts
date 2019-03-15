import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { UserAccount } from 'src/app/authorize/models/token';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnChanges {
  @Input() isLogin: boolean;
  userAccount: UserAccount = new UserAccount();

  constructor(
    public globalService: GlobalService,
  ) { }

  ngOnChanges() {
    this.userAccount = this.globalService.getUserAccount();
  }

}
