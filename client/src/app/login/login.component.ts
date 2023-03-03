import { Component} from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  password: string = '';
  email: string = '';

  login(){
    //log email password
    console.log(this.email, this.password);
  }

  register(){
    console.log('register');
  }
}
