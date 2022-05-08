import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        //If we do not have a user logged in yet, send the request without the jsonToken added
        if (!user) return next.handle(req);

        const modifiedReq = req.clone({
          //Here a can add the jsonToken of the user to the header of the http calls to
          //show that the user is authenticated and the api will send the data
          //e.g if a wanted to add the token as params
          //params: new HttpParams().set('auth', user.jsonToken),
          setHeaders: {
            Authorization: `Bearer ${user.jsonToken}`,
          },
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
