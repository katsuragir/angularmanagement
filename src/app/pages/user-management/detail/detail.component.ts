import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Users } from 'src/app/core/models/users.model';
import { UsersTable } from 'src/app/core/_fakeDB/users.table';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  
  user!: Users;
  title: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
		  const id = params['id'];
      if (id) {
        const user = UsersTable.Users[id - 1];
        this.title = 'Detail data user ' + user.userName;
        this.user = user;
      }
    });
  }

  return() {
    this.router.navigate(['/pages/users/list']);
  }

}
