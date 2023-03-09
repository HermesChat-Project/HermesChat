import { Component, ElementRef, ViewChild } from '@angular/core';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild("pwd") pwd!: ElementRef;
  password: string = '';
  email: string = '';
  showPassword: boolean = false;
  constructor(private logged: LoginService) { }
  login() {
    //log email password
    if (this.email != '' && this.password != '')
      this.logged.loggedIn = true;
  }

  register() {
    console.log('register');
  }

  changeClass() {
    this.showPassword = !this.showPassword;
    this.pwd.nativeElement.type = this.showPassword ? 'text' : 'password';
  }
}
