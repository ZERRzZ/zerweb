import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'

import { BTBody, SMenu } from 'yz/src/public-api';

@Injectable()
export class AppService {

  constructor(private http: HttpClient) { }

  getSMenu = () => this.http.get<Array<SMenu>>('/assets/s-menu.json')

  getRTBody = () => this.http.get<Array<BTBody>>('assets/readonly-table.json')

  // handleErr = (err: HttpErrorResponse) => {

  //   switch (err.status) {

  //     case 0:
  //       this.modal.error({ nzTitle: '错误', nzContent: '未知错误!' })
  //       console.error(err); break

  //     case 401:
  //       this.modal.error({ nzTitle: '错误', nzContent: '未授权!' })
  //       console.error(err); break

  //     case 404:
  //       this.modal.warning({ nzTitle: '提示', nzContent: '找不到路径!' })
  //       console.error(err); break

  //     default:
  //       if (err.error && err.error.message)
  //         this.modal.error({ nzTitle: '错误', nzContent: `${err.error.message}` })
  //       console.error(err)

  //   }

  //   // Return an observable with a user-facing error message.
  //   return throwError('Something bad happened; please try again later.')

  // }

}
