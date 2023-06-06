import { Component, ViewChild, ElementRef } from '@angular/core';
import { TranslationsService } from '../shared/translations.service';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  @ViewChild("btnSubmit") btnSubmit!: ElementRef;
  txtEmail: string = "";
  txtPassword: string = "";
  txtConfirmPassword: string = "";
  txtName: string = "";
  txtSurname: string = "";
  txtNickname: string = "";

  progress: number = 0;

  registerWords: any = {};

  constructor(private translationService: TranslationsService, public loginService: LoginService) { }

  ngOnInit() {
    if (window.innerWidth < 600) {
      this.loginService.seeMobilePage();
    }
    else {
      if (this.translationService.languageSelected == "")
        this.translationService.getLanguage();
      this.registerWords = this.translationService.languageWords["signup"];
    }
  }


  getWidth() {
    this.progress = 0;
    if (this.checkMail(this.txtEmail))
      this.progress++;
    if (this.checkName(this.txtName))
      this.progress++;
    if (this.checkName(this.txtSurname))
      this.progress++;
    if (this.checkNickname(this.txtNickname))
      this.progress++;
    if (this.checkPassword(this.txtPassword))
      this.progress++;
    if (this.txtConfirmPassword != "" && this.txtConfirmPassword == this.txtPassword)
      this.progress++;

    return this.progress * 16.66666667 + "%"
  }

  checkMail(mail: string): boolean {
    let mailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");
    return mailRegex.test(mail);
  }

  checkName(name: string): boolean {
    let nameRegex = new RegExp("^[a-zA-Z]{2,}$");
    return nameRegex.test(name);
  }

  checkNickname(nickname: string): boolean {
    //atleast 3 characters, no spaces
    let nicknameRegex = new RegExp("^[a-zA-Z0-9]{3,}$");
    return nicknameRegex.test(nickname);
  }

  checkPassword(password: string): boolean {
    //atleast 8 characters, atleast 1 uppercase, atleast 1 lowercase, atleast 1 number
    let passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
    return passwordRegex.test(password);
  }

  register(e: Event) {
    if(e instanceof KeyboardEvent){
      e.preventDefault();
    }
    console.log("register");
    this.loginService.registerUser(this.txtEmail, this.txtPassword, this.txtName, this.txtSurname, this.txtNickname, this.translationService.getLanguage());
  }

  keyEvent(event: KeyboardEvent) {
    if (event.key == 'Enter' && this.progress == 6)
      this.register(event);
  }

  onPaste(event: ClipboardEvent){
    let pastedData = event.clipboardData!.getData("text/plain");
    pastedData = pastedData.trim();
    console.log(pastedData);
    if (pastedData.length == 6) {
      //copio ogni singolo carattere e lo inserisco in ogni input
      let el = event.target as HTMLInputElement;
      let parent = (el.parentElement as HTMLElement)
      for (let i = 0; i < 6; i++) {
        (parent.children[i] as HTMLInputElement).value = pastedData[i];
      }
    }
    event.preventDefault();
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
      this.loginService.checkOtp(this.txtNickname, value, this.txtNickname, this.txtPassword);

  }
}
