import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'

import { RTBody, SMenu } from 'yz/src/public-api';

@Injectable()
export class AppService {

  constructor(private http: HttpClient) { }

  getSMenu = () => this.http.get<Array<SMenu>>('/assets/s-menu.json')

  getRTBody = () => this.http.get<Array<RTBody>>('assets/readonly-table.json')

  // private handleError(error: HttpErrorResponse) {
  //   if (error.status === 0) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     console.error('An error occurred:', error.error);
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong.
  //     alert(error.error)
  //     console.error(
  //       `Backend returned code ${error.status}, ` +
  //       `body was: ${error.error}`);
  //   }
  //   // Return an observable with a user-facing error message.
  //   return throwError('Something bad happened; please try again later.');
  // }

}