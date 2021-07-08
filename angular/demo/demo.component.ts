import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MenuOne, MenuTwo } from 'yz/menu-two/menu-two.model';
import { Single, SingleChoice } from 'yz/single-choice/single-choice.model';
import { Count } from 'yz/count/count.model';

import { dragsort } from '../../method/dragsort'

@Component({
  selector: 'demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  constructor(private http: HttpClient) {
    this.http.get('assets/menu-two.json').subscribe(data => this.menuTwo = data as Array<MenuTwo>)
    this.http.get('assets/single-choice.json').subscribe(data => this.singleChoice = data as SingleChoice)
    this.http.get('assets/count.json').subscribe(data => this.counts = data as Array<Count>)
  }

  menuTwo: Array<MenuTwo> = []
  singleChoice: SingleChoice = { id: 0, title: 'sadanya', list: [] }
  counts: Array<Count> = []

  getMenu(e: [MenuTwo, MenuOne]) {
    console.log(e)
  }

  getSingle(e: [SingleChoice, Single]) {
    console.log(e)
  }

  getCount(e: Count) {
    console.log(e)
  }

  ngOnInit() {
    let ul = document.getElementById('ul')
    ul && dragsort(ul)
  }
}
