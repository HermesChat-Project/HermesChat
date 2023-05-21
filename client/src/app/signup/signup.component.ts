import { Component } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  constructor() { }

  txtEmail: string = "";
  txtPassword: string = "";
  txtConfirmPassword: string = "";
  txtName: string = "";
  txtSurname: string = "";
  txtNickname: string = "";
}
