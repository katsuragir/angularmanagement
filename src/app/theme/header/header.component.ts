import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userMenu = [{ title: 'Log out' }];
  tag = 'my-context-menu';
  userPictureOnly: boolean = false;
  namaUser: any = 'test';
  profilePicture: any = '';
  jabatan: any = '';
  tombol: any;

  constructor(
    private sidebarService: NbSidebarService,
    private router: Router,
    private menuService: NbMenuService
  ) { }

  ngOnInit(): void {
    // action logout
    this.menuService.onItemClick()
      .pipe(filter(({ tag }) => tag === this.tag))
      .subscribe(tag => {
        this.tombol = tag.item;
        if (this.tombol.title == "Log out") {
          this.logOut();
        }

    });
  }

  // saat klik logo
  navigateHome() {
    this.router.navigate(['/pages/dashboard']);
    return false;
  }

  // action untuk show/hide side menu
  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');

    return false;
  }

  logOut() {
    try {
      localStorage.removeItem("user");
    } catch (error) {
      console.log(error);
    }
    this.router.navigate(['/auth/login']);
  }

}
