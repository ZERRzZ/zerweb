import { Component } from '@angular/core';

import { AppService } from './app.service';

import { AMenu, SMenu } from 'yz/src/public-api';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private app: AppService) {
    this.app.getSMenu().subscribe(smenu => this.smenu = smenu)
  }

  smenu: Array<SMenu> = []

  getCount = (e: number) => console.log(e)

  getSMenu = (e: [SMenu, AMenu]) => console.log(e)

}
