import { Injectable } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';

import { Router } from '@angular/router';
import { ChatSelectorService } from '../chat/chat.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private dataStorage: DataStorageService, private router: Router, private chatSelector: ChatSelectorService) { }
  loginSuccess: boolean = true;
  registerSuccess: boolean = false;
  login(body: any, options: { headers: any; observe: string; }) {
    this.dataStorage.PostRequestWithHeaders(`login`, body, options).subscribe({
      next: (response: any) => {
        this.router.navigate(['/chat']);
      },
      error: (error: Error) => {
        console.log(error);
        this.loginSuccess = false;
      }
    });
  }

  register() {
    this.router.navigate(['/signup']);
  }
  registerUser(email: string, password: string, name: string, surname: string, username: string, language: string) {
    let body = { email, password, name, surname, username, language }
    this.dataStorage.PostRequestWithHeaders(`register`, body, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      observe: "response" as "response",
      withCredentials: true
    }).subscribe({
      next: (response: any) => {
        console.log(response);
        this.registerSuccess = true;
      },
      error: (error: Error) => {
        console.log(error);
      }
    });
  }

}
