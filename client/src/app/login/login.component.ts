import { Component, ElementRef, ViewChild} from '@angular/core';

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

  login(){
    //log email password
    console.log(this.email, this.password);
  }

  register(){
    console.log('register');
  }

  changeClass(){
    this.showPassword = !this.showPassword;
    this.pwd.nativeElement.type = this.showPassword ? 'text' : 'password';
  }
}
