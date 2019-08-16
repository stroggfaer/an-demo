import {Http, Response} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {User} from '../model/user.model';
import {BaseApi} from '../core/base-api';

@Injectable()



export class UsersService extends BaseApi{
    constructor(
        public  http: Http,
    ) {
        super(http);
    }
    /*
    getUserByemail(email: string): Observable<User> {
        return this.http.get(domenUrl + `/users?email=${email}`)
            .map((response: Response) => response.json())
            .map((user: User[]) => user[0] ? user[0] : undefined);

    }*/

    getUserByemail(email: string): Observable<User> {
        return this.get(`users?email=${email}`)
            .map((user: User[]) => user[0] ? user[0] : undefined);
    }

    createNewUser(user: User): Observable <User> {
        return this.post('users', user);
    }
}
