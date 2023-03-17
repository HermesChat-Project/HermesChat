import { Injectable } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loggedIn: boolean = false;
  constructor(private dataStorage: DataStorageService) {}

  login(body: any, options: any) {
    this.dataStorage.PostRequestWithOptions("login", body, options).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error: Error) => {
        console.log(error);
      }
    );
  }

}
