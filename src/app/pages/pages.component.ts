import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent {

  menu: NbMenuItem[] = [];

  constructor() {
    this.menu = [{
      title: 'User Management',
      icon: 'people-outline',
      link: '/pages/users',
      children: [
        {
          title: 'Users',
          link: '/pages/users/list',
        },
      ],
    }];
  }

}
