import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoginService } from './login.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
})

export class AppLoginComponent implements OnInit {

    loading = false;
    currentUser: any;

    loginForm!: FormGroup;

    constructor(
        private router: Router, private formBuilder: FormBuilder, private loginService: LoginService) 
        {
            if (localStorage.getItem('user')) { this.router.navigate(['/pages/dashboard']) }
        }



    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.loginForm = this.formBuilder.group({
            username: 'user.demo',
            password: 'demo123'
        });
    }

    login() {
        this.loading = true;
        const data = this.loginForm.value;
        const form: any = {
            username: data.username,
            password: data.password
        }
        this.loginService.login(form);
        this.router.navigate(['/pages/dashboard']);
    }

    isLoggined() {

    }


}