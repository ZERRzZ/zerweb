import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { RouterMenu } from './app.model'

@Injectable()
export class AppService {

  constructor(private http: HttpClient) { }

  getRouterMenu = () => this.http.get<Array<RouterMenu>>('/assets/router-menu.json')
}