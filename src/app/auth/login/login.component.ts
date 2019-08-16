import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Meta, Title} from '@angular/platform-browser';

import {UsersService} from '../../shared/services/users.service';
import {User} from '../../shared/model/user.model';
import {Message} from '../../shared/model/message.model';
import {AuthService} from '../../shared/services/auth.service';
import {fadeStateTrigger} from '../../shared/animations/fade.animations';




@Component({
  selector: 'wfm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeStateTrigger] // Анимация страницы;
})
export class LoginComponent implements OnInit {

    form: FormGroup;
    message: Message;

  constructor(
      private usersService: UsersService,
      private authService: AuthService,
      private router: Router,
      private route: ActivatedRoute,
      private title: Title, // SEO
      private meta: Meta // SEO
  ) {
      // SEO;
      title.setTitle('Вход в систему');
      meta.addTags([
          { name: 'keywords', content: 'Логин, вход, система' },
          { name: 'description', content: '....описание' }
      ]);
  }

  ngOnInit() {
      this.message = new Message('danger', '');
      // Выводим сообщение для нового Юзера;
      this.route.queryParams
          .subscribe((params: Params) => {
              if (params['nowCanLogin']) {
                  this.showMessage({
                      text: 'Теперь вы можете зайти в систему',
                      type: 'success'
                  });
              } else if (params['accessDenied']) {
                  this.showMessage({
                      text: 'Для работы с системой вам необходимо войти',
                      type: 'warning'
                  });
              }
          });
      // Инилизация объекты;
     this.form = new FormGroup ({
         'email': new FormControl(null, [Validators.required, Validators.email]),
         'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
     });
  }
  // Универсальный собщение об ошибки;
  private showMessage(message: Message) {
      this.message = message;
      window.setTimeout(() => {
          this.message.text = '';
      }, 5000);
  }

  onSubmit() {

       const formData = this.form.value;
       // Отправляем сервер данные;
       this.usersService.getUserByemail(formData.email)
           .subscribe((user: User) => {
              if (user) {
                 if (user.password === formData.password) {
                     this.message.text = '';
                     window.localStorage.setItem('user', JSON.stringify(user));
                     this.authService.login();
                     this.router.navigate(['/system', 'bill']);
                 } else {
                     this.showMessage({
                         text: 'Пароль не верный',
                         type: 'danger'
                     });
                 }
              } else {
                  this.showMessage({
                      text: 'Такого пользователя не существует',
                      type: 'danger'
                  });
              }
           });
  }

}
