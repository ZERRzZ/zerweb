import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SuperMenu } from 'yz/public-api';

@Injectable()
export class AppService {

  constructor(private http: HttpClient) { }

  getSuperMenu = () => this.http.get<SuperMenu[]>('/assets/super-menu.json')

}
