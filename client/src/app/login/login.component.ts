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
  @ViewChild("btnSubmit") btnSubmit!: ElementRef;
  password: string = '';
  email: string = '';
  showPassword: boolean = false;
  loginWords: any = {};
  constructor(public loginService: LoginService, public translationService: TranslationsService) { }

  ngOnInit() {
    //check if the width is less than 600px
    if (window.innerWidth < 600) {
      this.loginService.seeMobilePage();
    }
    else {
      this.loginService.onEndLogin = false;
      this.loginService.checkToken();
      if (this.translationService.languageSelected == "")
        this.translationService.getLanguage();
      this.loginWords = this.translationService.languageWords["login"];
    }
  }
  login( e: Event) {
    if(e instanceof KeyboardEvent){
      e.preventDefault();
    }
    //log email password
    if (this.email != '' && this.password != '') {
      this.loginService.onEndLogin = false;
      let body = {
        password: this.password.toString(),
        username: this.email.toString()
      }
      let options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
        }),
        observe: "response" as "response",
        withCredentials: true
      }
      this.loginService.login(body, options);
    }
    else {
      this.errors.nativeElement.innerHTML = this.loginWords["missing-fields"];
    }
  }

  register() {
    console.log("register");
    this.loginService.register();
  }

  changeClass() {
    this.showPassword = !this.showPassword;
    this.pwd.nativeElement.type = this.showPassword ? 'text' : 'password';
  }
  keyEvent(event: KeyboardEvent) {
    if (event.key == 'Enter' && this.loginService.onEndLogin )
      this.login(event);
  }
  onPaste(event: ClipboardEvent){
    event.preventDefault();
    let pastedData = event.clipboardData!.getData("text/plain");
    pastedData = pastedData.trim();
    console.log(pastedData);
    if (pastedData.length == 6) {
      //copio ogni singolo carattere e lo inserisco in ogni input
      let el = event.target as HTMLInputElement;

      let parent = (el.parentElement as HTMLElement);
      for (let i = 0; i < 6; i++) {
        (parent.children[i] as HTMLInputElement).value = pastedData[i];
      }
    }
  }
  keyEventOtp(event: KeyboardEvent) {
    let el = event.target as HTMLInputElement;
    if (event.key.length == 1 && !event.shiftKey) {
      if(el.value.length == 1)
      {
        el.value = event.key;
      }
      //check if the input is the last one
      if (el.nextElementSibling == null) {
        this.btnSubmit.nativeElement.focus();
      }
      else {
        (el.nextElementSibling as HTMLInputElement).focus();
      }
    }
  }

  getOtp() {
    let value = ""
    let parent = (this.btnSubmit.nativeElement.parentElement as HTMLElement).previousElementSibling as HTMLElement;
    let inputs = parent.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
      value += inputs[i].value;
    }

    if (value.length == 6)
    {
      this.loginService.checkOtp(this.email, value, this.email, this.password);

    }

  }
}
