import { Injectable } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';

import { Router } from '@angular/router';
import { ChatSelectorService } from '../chat/chat.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private dataStorage: DataStorageService, private router: Router, private chatSelector: ChatSelectorService) { }
  loginSuccess: boolean = true;
  registerSuccess: boolean = false;
  login(body: any, options: { headers: any; observe: string; withCredentials: boolean }) {
    console.log("login")
    this.dataStorage.PostRequestWithHeaders(`login`, body, options).subscribe({
      next: (response: any) => {
        this.router.navigate(['/chat']);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        if(error.error == "{\"ris\":\"check otp\"}{\"ris\":\"ok\"}")
          this.loginSuccess = false;
      }
    });
  }
  seeMobilePage() {
    this.router.navigate(['/mobile']);
  }
  register() {
    this.router.navigate(['/signup']);
  }

  checkOtp(email: string, otp: string, username="", password="") {
    let body = { nickname:email, otp }
    this.dataStorage.PostRequestWithHeaders(`checkOtp`, body, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      observe: "response" as "response",
      withCredentials: true
    }).subscribe({
      next: (response: any) => {
        console.log(response);
        let body = { username, password }
        console.log(body);
        this.login(body, {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          observe: "response" as "response",
          withCredentials: true
        })


      },
      error: (error: Error) => {
        console.log(error);
      }
    });
  }
  registerUser(email: string, password: string, name: string, surname: string, username: string, lang: string) {
    let body = { email, password, name, surname, username, lang}
    this.dataStorage.PostRequestWithHeaders(`signup`, body, {
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
        this.registerSuccess = false;
      }
    });
  }

}
