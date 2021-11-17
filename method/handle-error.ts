// import { HttpErrorResponse } from "@angular/common/http";
// import { Injectable } from "@angular/core";
// import { NzModalService } from "ng-zorro-antd";
// import { throwError } from "rxjs";

// @Injectable()
// export class HandleErrService {

//   constructor(private modal: NzModalService) { }

//   handleErr = (err: HttpErrorResponse) => {

//     switch (err.status) {

//       case 0:
//         this.modal.error({ nzTitle: '错误', nzContent: '未知错误!' })
//         console.error(err); break

//       case 401:
//         this.modal.error({ nzTitle: '错误', nzContent: '未授权!' })
//         console.error(err); break

//       case 404:
//         this.modal.warning({ nzTitle: '提示', nzContent: '找不到路径!' })
//         console.error(err); break

//       case 405:
//         this.modal.error({ nzTitle: '错误', nzContent: '请求方法错误!' })
//         console.error(err); break

//       default:
//         if (err.error && err.error.message)
//           this.modal.error({ nzTitle: '错误', nzContent: `${err.error.message}` })
//         console.error(err)

//     }

//     // Return an observable with a user-facing error message.
//     return throwError('Something bad happened; please try again later.')

//   }

// }
