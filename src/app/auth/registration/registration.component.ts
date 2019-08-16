import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {UsersService} from '../../shared/services/users.service';
import {User} from '../../shared/model/user.model';
import {Meta, Title} from '@angular/platform-browser';


@Component({
  selector: 'wfm-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  form: FormGroup;

  constructor(
      private  usersService: UsersService,
      private  router: Router,
      private title: Title, // SEO
      private meta: Meta // SEO
  ) {
      // SEO;
      title.setTitle('Вход в систему');
      meta.addTags([
          { name: 'keywords', content: 'Регистрация, вход, система' },
          { name: 'description', content: '....описание' }
      ]);
  }

   ngOnInit() {
      this.form = new FormGroup({
          'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails.bind(this)),
          'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
          'name': new FormControl(null, [Validators.required]),
          'agree': new FormControl(false, [Validators.requiredTrue])
      });
   }

    onSubmit() {
      const {email, password, name} = this.form.value;
      const user = new User(email, password, name);

       this.usersService.createNewUser(user)
           .subscribe(() => {
               // Redirect;
              this.router.navigate(['/login'], {
                  queryParams: {
                      nowCanLogin: true
                  }
              });
           });
    }

    forbiddenEmails(control: FormControl): Promise<any> {
       return new Promise((resolve, reject) => {
             this.usersService.getUserByemail(control.value)
                 .subscribe((user: User) => {
                     if (user) {
                         resolve({forbiddenEmails: true});
                     } else {
                         resolve(null);
                     }
                 });
       });
    }


}
