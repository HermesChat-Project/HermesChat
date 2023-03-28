import { Injectable } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { TranslationsService } from '../shared/translations.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loggedIn: boolean = false;
  constructor(private dataStorage: DataStorageService, private translationsService: TranslationsService) {}

  login(body: any, errors: HTMLElement) {
    this.dataStorage.PostRequest(`login`, body).subscribe(
      (response: any) => {
        console.log(response);
        this.loggedIn = true;
      },
      (error: Error) => {
        console.log(error);
        errors.innerHTML = this.translationsService.languageWords["login"]["wrong-credentials"];
      }
    );
  }

}
