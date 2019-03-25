import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalService } from './global.service';
import { AuthGuardService } from './auth-guard.service';
import { map, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequestInterceptorService implements HttpInterceptor {

  constructor(
    private globalService: GlobalService,
    private authGuardService: AuthGuardService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('suggestion')) {
      this.globalService.isRequestingGoogleMap.emit(true);
    } else {
      this.globalService.isRequesting.emit(true);
    }
    const token = this.authGuardService.getToken();
    if (token != null) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      map(event => {
        return event;
      }),
      finalize(() => {
        request.url.includes('suggestion') ?
        this.globalService.isRequestingGoogleMap.emit(false) :
        this.globalService.isRequesting.emit(false);
      })
    );
  }
}
