import { Injectable } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { TranslationsService } from '../shared/translations.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private dataStorage: DataStorageService, private translationsService: TranslationsService, private router:Router) {}

  login(body: any, errors: HTMLElement) {
    this.router.navigate(['/chat']);
    // this.dataStorage.PostRequest(`login`, body).subscribe(
    //   (response: any) => {
    //     console.log(response);
    //     this.router.navigate(['/chat']);
    //   },
    //   (error: Error) => {
    //     console.log(error);
    //     errors.innerHTML = this.translationsService.languageWords["login"]["wrong-credentials"];
    //   }
    // );
  }

}
