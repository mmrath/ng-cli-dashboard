import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';


@Component({
  moduleId: module.id,
  selector: 'app-login',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  constructor(public loginService: LoginService, public router: Router) {
  }

  login(event, username, password) {
    event.preventDefault();
    let body = { username, password };
    this.loginService.login(body).subscribe(
      response => {
        localStorage.setItem('jwt', response.id_token);
        this.router.navigateByUrl('/user');
      },
      error => {
        alert(error.text());
        console.log(error.text());
      });
  }
}
