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
    if (event.key == 'Enter' )
      this.login(event);
  }
  onPaste(event: ClipboardEvent){
    let pastedData = event.clipboardData!.getData("text/plain");
    pastedData = pastedData.trim();
    console.log(pastedData);
    if (pastedData.length == 6) {
      //copio ogni singolo carattere e lo inserisco in ogni input
      let el = event.target as HTMLInputElement;
      let parent = (el.parentElement as HTMLElement);
      for (let i = 0; i < 6; i++) {
        parent.children[i].innerHTML = pastedData[i];
      }
    }
    event.preventDefault();
  }
  keyEventOtp(event: KeyboardEvent) {
    let el = event.target as HTMLInputElement;
    //chekf if backspace
    if (!event.altKey && event.key != "caps lock") {

      if (event.key == 'Backspace') {
        let prev = el.previousElementSibling as HTMLInputElement;
        if (prev != null)
          prev.focus();
      }
      else if (event.key == 'Space') {
        el.value = el.value = "";
      }
      else if (event.key != "delete") {
        let next = el.nextElementSibling as HTMLInputElement;
        if (next != null)
          next.focus();
        else
          this.btnSubmit.nativeElement.focus();
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
