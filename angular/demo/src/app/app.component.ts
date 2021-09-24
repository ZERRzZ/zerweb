import { Component } from '@angular/core';

import { AppService } from './app.service';

import { AMenu, RTBody, SMenu } from 'yz/src/public-api';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private app: AppService) {
    this.app.getSMenu().subscribe(smenu => this.smenu = smenu)
    this.app.getRTBody().subscribe(rtbody => this.rtbody = rtbody)
  }

  smenu: Array<SMenu> = []

  rtbody: Array<RTBody> = []

  getCount = (e: number) => console.log(e)

  getSMenu = (e: [SMenu, AMenu]) => console.log(e)

}
