// import { Injectable } from '@angular/core';
// import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
// import { catchError } from 'rxjs/operators';

// import { HandleErrService } from './handle-error';
// import { cookieObj } from '../method/handle-cookie';

// @Injectable({ providedIn: 'root' })
// export class NoopInterceptor implements HttpInterceptor {

//   constructor(
//     private he: HandleErrService
//   ) { }

//   intercept(req: HttpRequest<any>, next: HttpHandler) {
//     // 设置上 token, 从 cookie 中获取
//     if (req.url.includes('/oauth/token')) {
//       req = req.clone({ setHeaders: { Authorization: 'Basic eXotc2VydmljZS1jbGllbnQ6YWdtczEyMzQ=' } })
//     } else {
//       let token = cookieObj().find(v => v.key == 'token')
//       token && (req = req.clone({ setHeaders: { Authorization: token.value } }))
//     }
//     // 将请求返回给下一个拦截器或服务器
//     return next.handle(req)
//       // 错误处理
//       .pipe(catchError(this.he.handleErr));
//   }

// }