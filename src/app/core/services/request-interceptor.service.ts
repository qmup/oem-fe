import {
  Injectable
} from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import {
  Observable
} from 'rxjs';
import {
  GlobalService
} from './global.service';
import {
  AuthGuardService
} from './auth-guard.service';
import {
  map,
  finalize
} from 'rxjs/operators';
import 'rxjs/add/operator/do';
import {
  Router
} from '@angular/router';
import { ToastService } from 'ng-uikit-pro-standard';

@Injectable({
  providedIn: 'root'
})
export class RequestInterceptorService implements HttpInterceptor {

  constructor(
    private globalService: GlobalService,
    private router: Router,
    private authGuardService: AuthGuardService,
    private toastService: ToastService,
  ) {}

  intercept(request: HttpRequest < any > , next: HttpHandler): Observable < HttpEvent < any >> {
    if (request.url.includes('suggestion')) {
      this.globalService.isRequestingGoogleMap.emit(true);
    } else {
      this.globalService.isRequesting.emit(true);
    }
    const token = this.authGuardService.getToken();
    if (token != null) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token.token}`,
        },
      });
    }

    return next.handle(request)
      .pipe(
        map(event => {
          return event;
        }),
        finalize(() => {
          request.url.includes('suggestion') ?
            this.globalService.isRequestingGoogleMap.emit(false) :
            this.globalService.isRequesting.emit(false);
        })
      )
      .do(
        (event: HttpEvent < any > ) => {},
        (error: any) => {
          if (error instanceof HttpErrorResponse) {
            const now = new Date().getTime();
            if (token.expired_time < now) {
              this.toastService.info('Phiên đăng nhập hết hạn', 'Vui lòng đăng nhập lại', { positionClass: 'toast-bottom-right'});
              this.authGuardService.clearToken();
              this.globalService.isLogin = false;
              this.router.navigate(['login']);
            }
          }
        }
      );
  }
}
