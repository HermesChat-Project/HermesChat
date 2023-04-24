import { Injectable } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { TranslationsService } from '../shared/translations.service';
import { Router } from '@angular/router';
import { ChatSelectorService } from '../chat/chat.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private dataStorage: DataStorageService, private translationsService: TranslationsService, private router: Router, private chatSelector:ChatSelectorService) { }

  login(body: any, errors: HTMLElement, options: { headers: any; observe: string; }) {
    this.router.navigate(['/chat']);
    // this.dataStorage.PostRequestWithHeaders(`login`, body, options).subscribe(
    //   (response: any) => {
    //     console.log(response.headers.get('Authorization'));
    //     console.log(response)
    //     let authorization = response.headers.get('Authorization');
    //     this.chatSelector.token = authorization;
    //     let d = new Date()
    //     d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
    //     let expires = "expires=" + d.toUTCString();
    //     let cookie = `token=${authorization};${expires};path=/;HttpOnly`
    //     console.log(cookie);
    //     document.cookie = `Authorization=${authorization};${expires};path=/;`;
    //     this.router.navigate(['/chat']);
    //   },
    //   (error: Error) => {
    //     console.log(error);
    //     errors.innerHTML = this.translationsService.languageWords["login"]["wrong-credentials"];
    //   }
    // );
  }

}
