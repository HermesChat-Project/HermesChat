import { Component } from '@angular/core';
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HermesChat';

  userLang = navigator.language;
  constructor(public logged: LoginService) {}

  ngOnInit() {
    console.log(this.userLang);
  }
}
