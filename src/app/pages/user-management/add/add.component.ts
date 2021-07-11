import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersTable } from '../../../core/_fakeDB/users.table';
import { Users } from '../../../core/models/users.model';
import { Observable, OperatorFunction } from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  user!:Users; 
  maxDate: any;
  title: string = '';
  dynamicForm!: FormGroup; // inisiasi form
  submitted = false;
  group: any[] = [];
  edit: boolean = false;
  formatter = (result: string) => result.toUpperCase();

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.group.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: NbToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    ) { }

  ngOnInit(): void {
    this.newForm();
    // pengecekan apakah url mengandung id user bila iya makan form akan terisi dengan data user
    this.activatedRoute.params.subscribe(params => {
		  const id = params['id'];
      if (id) {
        this.user = UsersTable.Users[id - 1];
        this.title = 'Edit data user ' + this.user.userName;
        this.generateFormValue();
        this.edit = true;
      } else {
        this.title = 'Add new data user';
      }
    });
    // pengumpulan semua user group untuk di jadian object array untuk autocomplate
    let groups: any[] = []
    UsersTable.Users.forEach((item:Users, index: any) => {
      groups.push(item.group);
    });
    const unique = new Set(groups); // pengampusan duplicate dengan *set: array bersifat unique 
    this.group = [...unique];
    this.maxDate = {
      year: new Date().getFullYear(), month: new Date().getMonth(), day: new Date().getDate() // validate datepicker tidak boleh lebih dari hari ini
    }
  }

  newForm() {
    this.dynamicForm = this.formBuilder.group({
      user: new FormArray([this.newActionFormGroup()]) // pembuatan form array *Reactive dynamic form
    });
  }

  newActionFormGroup(): FormGroup {
    let actionGroup = new FormGroup({
      username: new FormControl('', Validators.required),
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      birhdate: new FormControl('', Validators.required),
      basicsalary: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      group: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
    return actionGroup;
  }

  // penginputan data bila url edit
  generateFormValue() {
    const [month, day, year] = this.user.birthDate.toString().split('/');
    const birthDate = { year: parseInt(year), month: parseInt(month), day: 
      parseInt(day.split(' ')[0].trim()) };
    const [month2, day2, year2] = this.user.description.toString().split('/');
    const description = { year: parseInt(year2), month: parseInt(month2), day: 
      parseInt(day2.split(' ')[0].trim()) };
    console.log(birthDate,description);
    (this.dynamicForm.controls['user'] as FormArray).controls[0].get('username')?.setValue(this.user.userName);
    (this.dynamicForm.controls['user'] as FormArray).controls[0].get('firstname')?.setValue(this.user.firstName);
    (this.dynamicForm.controls['user'] as FormArray).controls[0].get('lastname')?.setValue(this.user.lastName);
    (this.dynamicForm.controls['user'] as FormArray).controls[0].get('email')?.setValue(this.user.email);
    (this.dynamicForm.controls['user'] as FormArray).controls[0].get('birhdate')?.setValue(new NgbDate(birthDate.year,birthDate.month,birthDate.day));
    (this.dynamicForm.controls['user'] as FormArray).controls[0].get('basicsalary')?.setValue(this.user.basicSalary);
    (this.dynamicForm.controls['user'] as FormArray).controls[0].get('status')?.setValue(this.user.status);
    (this.dynamicForm.controls['user'] as FormArray).controls[0].get('group')?.setValue(this.user.group);
    (this.dynamicForm.controls['user'] as FormArray).controls[0].get('description')?.setValue(new NgbDate(description.year,description.month,description.day));
  }
  
  // inisiasi untuk memudahkan pemanggilan
  get f() { return this.dynamicForm.controls; }
  get t() { return (this.dynamicForm.controls['user'] as FormArray).controls; }

  getFormGroupAt(i: number) {
    return (this.dynamicForm.controls['user'] as FormArray).at(i) as FormGroup;
  }

  return() {
    this.router.navigate(['/pages/users/list']);
  }

  onSubmit() {
    this.submitted = true;

    if (this.dynamicForm.invalid) {
      // jika ada data yg belum terisi atau invalid maka sistem berhenti
      return;
    }
    if (this.edit) {

      const value = this.dynamicForm.value;

      const newUser = {
        id: this.user.id,
        userName: value.user[0].username,
        firstName: value.user[0].firstname,
        lastName: value.user[0].lastname,
        email: value.user[0].email,
        birthDate: value.user[0].birhdate.month + '/' + value.user[0].birhdate.day + '/' + value.user[0].birhdate.year,
        basicSalary: value.user[0].basicsalary,
        status: value.user[0].status,
        group: value.user[0].group,
        description: value.user[0].description.month + '/' + value.user[0].description.day + '/' + value.user[0].description.year,
      }

      UsersTable.Users[this.user.id - 1] = newUser;

      const config = {
        status: 'success',
        destroyByClick: true,
        duration: 2000,
        hasIcon: true,
        position: NbGlobalPhysicalPosition.TOP_RIGHT,
        preventDuplicates: false,
      };

      this.toastrService.show(
        'Succeeded in update user data',
        `Updating Success`,
        config);

      this.router.navigate(['/pages/users/list']);

    } else {
      
      const last: Users = UsersTable.Users[UsersTable.Users.length - 1];
      const value = this.dynamicForm.value;

      const newUser = {
        id: last.id + 1,
        userName: value.user[0].username,
        firstName: value.user[0].firstname,
        lastName: value.user[0].lastname,
        email: value.user[0].email,
        birthDate: value.user[0].birhdate.month + '/' + value.user[0].birhdate.day + '/' + value.user[0].birhdate.year,
        basicSalary: value.user[0].basicsalary,
        status: value.user[0].status,
        group: value.user[0].group,
        description: value.user[0].description.month + '/' + value.user[0].description.day + '/' + value.user[0].description.year,
      }
      
      UsersTable.Users.push(newUser);

      const config = {
        status: 'success',
        destroyByClick: true,
        duration: 2000,
        hasIcon: true,
        position: NbGlobalPhysicalPosition.TOP_RIGHT,
        preventDuplicates: false,
      };
      
      this.toastrService.show(
        'Succeeded in Add new user data',
        `Adding Success`,
        config);

      this.router.navigate(['/pages/users/list']);
    }
  }

}
