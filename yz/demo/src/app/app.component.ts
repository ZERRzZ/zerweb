import { Component } from '@angular/core';

import { RouterMenu } from './app.model';

import { AppService } from './app.service';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private app: AppService) {
    this.app.getRouterMenu().subscribe(menu => this.routerMenu = menu, err => alert(err))
  }

  routerMenu: Array<RouterMenu> = []

}
