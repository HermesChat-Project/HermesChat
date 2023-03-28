import { HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslationsService } from '../shared/translations.service';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild("pwd") pwd!: ElementRef;
  @ViewChild("errors") errors!: ElementRef;
  password: string = '';
  email: string = '';
  showPassword: boolean = false;
  loginWords: any = {};
  constructor(private logged: LoginService, public translationsService: TranslationsService) { }

  ngOnInit()
  {
    this.translationsService.getLanguage();
    this.loginWords = this.translationsService.languageWords["login"];
  }
  login() {
    //log email password
    if (this.email != '' && this.password != '') {
      // let body = {
      //   email: this.email.toString(),
      //   password: this.password.toString(),
      //   username: this.email.toString()
      // }
      // let options = { headers : new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })};

      // this.logged.login(body, options, this.errors.nativeElement);
      this.logged.loggedIn = true;
    }
    else {
      this.errors.nativeElement.innerHTML = this.loginWords["missing-fields"];
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
