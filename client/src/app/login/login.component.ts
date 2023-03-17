import { HttpHeaders } from '@angular/common/http';
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
    if (this.email != '' && this.password != '') {
      // let body = {
      //   email: this.email.toString(),
      //   password: this.password.toString(),
      //   username: this.email.toString()
      // }
      // let options = { headers : new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })};

      // this.logged.login(body, options);
      this.logged.loggedIn = true;
    }
  }

  register() {
    console.log('register');
  }

  changeClass() {
    this.showPassword = !this.showPassword;
    this.pwd.nativeElement.type = this.showPassword ? 'text' : 'password';
  }
  keyEvent(event: any) {
    if (event.key == 'Enter')
      this.login();
  }
}
