import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SMenu } from 'yz/public-api';

@Injectable()
export class AppService {

  constructor(private http: HttpClient) { }

  getSMenu = () => this.http.get<Array<SMenu>>('/assets/s-menu.json')

}
