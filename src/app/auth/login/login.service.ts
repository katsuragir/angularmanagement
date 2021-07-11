import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from 'src/app/core/models/users.model';
import { UsersTable } from 'src/app/core/_fakeDB/users.table';
import { find } from 'lodash';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    localStorageKey = 'user';

    constructor(private http: HttpClient) { }

    login(data: any) {
        const user = find(UsersTable.Users, function(user: Users) {
            return (user.userName.toLowerCase() === data.username.toLowerCase());
        });

        if (user) {
            const auth = user;
            localStorage.setItem(this.localStorageKey, JSON.stringify(auth));
            return user;
        }
    }

    isLoggedin() {
        if (localStorage.getItem('user')) {
            return true;
        } else {
            return false;
        }


    }

    logout() {
        localStorage.removeItem(this.localStorageKey);
    }
}
