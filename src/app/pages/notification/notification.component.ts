import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {

  @Input() title: string = '';

  constructor(protected ref: NbDialogRef<NotificationComponent>) { }

  dismiss(value: boolean) {
    this.ref.close(value);
  }

}
