import { Component, Directive, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { UsersTable } from '../../core/_fakeDB/users.table';
import { Users } from '../../core/models/users.model';
import { FormControl } from '@angular/forms';
import { NbDialogService, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { NotificationComponent } from '../notification/notification.component';
import { ActivatedRoute, Router } from '@angular/router';

export type SortColumn = keyof Users | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdSortableHeader {

  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  users: Users[] = UsersTable.Users; // list all data users yg di dapat dari fakeDB
  //tempo: Users[] = [];
  page = 1; //halaman awal untuk pagging tabel
  pageSize = 10; //jumlah data yg ingin di tampilkan
  maxSize = 5; //jumlah kotak paging number yg ingin di tampilkan
  collectionSize = UsersTable.Users.length; //total data users
  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>; //inisiasi sort data di table
  search: string = ''; //data search
  status: any = ''; //data filter status

  constructor(
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // pengecekan apakah ada data tempo search di localstorage bila ada 
    // maka di implementasikan ke dalam serach dan filter status lalu hapus data di localstorage
    if(localStorage.getItem('searchParam')) {
      const param:any = JSON.parse(localStorage.getItem('searchParam') || '{}');
      this.search = param.search;
      this.status = param.status;
      localStorage.removeItem('searchParam');
    }
  }

  // setting pagination data users untuk di tampilkan di table
  setPagging(array: Users[], index: number) {
    // console.log(array.length);
    const data = array;
    this.page = index;
    this.collectionSize = data.length;
    //this.tempo = data;
    return data.slice((index - 1) * this.pageSize, index * this.pageSize); // jumlah data yg akan di tampilkan harus sesuai dengan variable page size
  }

  // sorting data pada table
  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting user data by asc / desc
    if (direction === '' || column === '') {
      this.users = UsersTable.Users;
    } else {
      this.users = [...UsersTable.Users].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  // search dan filter status data users
  filter(search: string, status: string) {
    // data yg di tampilkan harus mengandung kata yg ada yg search
    let data = UsersTable.Users.filter((fil:Users) => 
    fil.userName.toLowerCase().includes(search.toLowerCase()) || 
    fil.firstName.toLowerCase().includes(search.toLowerCase()) || 
    fil.lastName.toLowerCase().includes(search.toLowerCase()) || 
    fil.email.toLowerCase().includes(search.toLowerCase()) || 
    fil.basicSalary.toString().includes(search.toString()) || 
    fil.group.toLowerCase().includes(search.toLowerCase())
    );

    if (status !== '') data = data.filter((fil:Users) => fil.status.toString().includes(status.toString())); // data yg di tampilkan harus sesuai dengan status yg di pilih

    this.users = data; // setelah di filter maka di kempalikan untuk di tampilkan ke dalam table
  }

  clear() {
    this.users = UsersTable.Users;
    this.status = '';
    this.search = '';
  }

  delete(user:Users) {
    const data: Users[] = UsersTable.Users;
    // saat ingin menghapus data makan akan muncul notifikasi kepastian
    this.dialogService.open(NotificationComponent, {
      context: {
        title: 'Are you sure you want to delete this data? ',
      },
      closeOnBackdropClick: false
    }).onClose.subscribe(
      (res:boolean) => {

        if (res) {

          for (let i=0;i<data.length;i++) {

            if(data[i].id === user.id) {
              data.splice(i,1);
            }

          }
          // setelah berhasil di hapus makan akan muncul notifikasi berhasil
          const config = {
            status: 'danger',
            destroyByClick: true,
            duration: 2000,
            hasIcon: true,
            position: NbGlobalPhysicalPosition.TOP_RIGHT,
            preventDuplicates: false,
          };

          this.toastrService.show(
            'Succeeded in deleting ' + user.userName + ' data',
            `Delete Success`,
            config);
        }
        
      }      
     );
  }

  createComponent(flag: string, data: Users) {
    if (flag === 'new') {
      this.router.navigate(['/pages/users/add']);
    }else{
      this.router.navigate(['/pages/users/edit', data.id], { relativeTo: this.activatedRoute });
    }
  }

  review(user:Users) {
    const dataSearch = {
      search : this.search,
      status : this.status
    }
    localStorage.setItem('searchParam', JSON.stringify(dataSearch));
    this.router.navigate(['/pages/users/detail', user.id], { relativeTo: this.activatedRoute });
  }

}
