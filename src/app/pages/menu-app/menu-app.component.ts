import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-app',
  templateUrl: './menu-app.component.html',
  styleUrls: ['./menu-app.component.scss']
})
export class MenuAppComponent {

  @Input() title: string = '';
  @Input() type: string = '';
  @Input() desc: string = '';

  constructor() { }

}
