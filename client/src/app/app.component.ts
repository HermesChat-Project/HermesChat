import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HermesChat';

  userLang = navigator.language;

  ngOnInit() {
    console.log(this.userLang);
  }
}
