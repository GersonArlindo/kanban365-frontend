import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HandlerErrorService {

  public handlerError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = `Bad Request`;
          break;
        case 401:
          errorMessage = `Unauthorized`;
          break;
        case 403:
          errorMessage = `Forbidden`;
          break;
        case 404:
          errorMessage = `Not Found`;
          break;
        case 500:
          errorMessage = `Internal Server Error`;
          break;
        default:
          errorMessage = `Unknown Server Error`;
          break;
      }
    }

    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
