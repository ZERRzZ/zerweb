import { Component } from '@angular/core';

import { AppService } from './app.service';

import { AMenu, BTBody, PlayBar, SMenu } from 'yz/public-api';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private app: AppService) {

    this.app.getSMenu().subscribe(smenu => this.smenu = smenu) // 路由菜单

  }

  smenu: Array<SMenu> = []

  getCount = (e: number) => console.log(e)

  getSMenu = (e: [SMenu, AMenu]) => console.log(e)

  clickTr = (e: BTBody) => console.log(e)

  onplaybar = (e: PlayBar) => console.log(e)

}
