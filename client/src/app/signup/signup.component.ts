import { Component, ViewChild, ElementRef } from '@angular/core';
import { TranslationsService } from '../shared/translations.service';
import { LoginService } from '../login/login.service';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  @ViewChild("btnSubmit") btnSubmit!: ElementRef;
  @ViewChild("picture") picture!: ElementRef;
  txtEmail: string = "";
  txtPassword: string = "";
  txtNickname: string = "";

  registerWords: any = {};

  eyeCheckPwd: boolean = false;
  eyePwd: boolean = false;
  constructor(private translationService: TranslationsService, public loginService: LoginService, private _formBuilder: FormBuilder) { }
  firstFormGroup = this._formBuilder.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}")]],
      confirmPassword: ['', [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}")]],
    },
    {
      validator: this.ConfirmedValidator('password', 'confirmPassword')
    } as AbstractControlOptions);
  secondFormGroup = this._formBuilder.group({
    nome: ['', [Validators.required, Validators.pattern("^[a-zA-Z]{3,}$")]],
    cognome: ['', [Validators.required, Validators.pattern("^[a-zA-Z]{3,}$")]],
    nickname: ['', [Validators.required, Validators.pattern("^[A-Za-z][A-Za-z0-9_]{2,}$")]]
  });
  thirdFormGroup = this._formBuilder.group({
    image: [''],
  });

  ngOnInit() {
    if (window.innerWidth < 768) {
      this.loginService.seeMobilePage();
    }
    else {
      if (this.translationService.languageSelected == "")
        this.translationService.getLanguage(navigator.language.split('-')[0]);
      this.registerWords = this.translationService.languageWords["signup"];
    }

    //regex for username (at least 3 characters, only letters and numbers and _, no spaces and cannot start with a number)
    let regexUsername = /^[a-zA-Z0-9_]{3,}$/;

  }

  showPwd() {
    this.eyePwd = !this.eyePwd;
  }

  showCheckPwd() {
    this.eyeCheckPwd = !this.eyeCheckPwd;
  }

  addImg(event: Event) {
    console.log(event);
    let img = (event.target as HTMLInputElement).files![0];
    if (img) {
      this.convertToBase64(img).then((base64: any) => {
        this.thirdFormGroup.controls['image'].setValue(base64);
        this.picture.nativeElement.src = base64;
      });
    }

  }

  convertToBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string));
      reader.onerror = error => reject(error);
    });
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors["confirmedValidator"]
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  signup() {
    let email = this.firstFormGroup.value.email;
    let password = this.firstFormGroup.value.password;
    let name = this.secondFormGroup.value.nome;
    let surname = this.secondFormGroup.value.cognome;
    let nickname = this.secondFormGroup.value.nickname;
    let image = this.thirdFormGroup.value.image;
    this.txtNickname = nickname!;
    this.txtPassword = password!;

    this.loginService.registerUser(email!, password!, name!, surname!, nickname!, this.translationService.getLanguage(), image!);
  }

  disablePaste() {
    return false;
  }






  keyEvent(event: KeyboardEvent) {
    if (event.key == 'Enter'){

    }
  }

  onPaste(event: ClipboardEvent) {
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
      if (el.value.length == 1) {
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
