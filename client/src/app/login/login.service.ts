import { Injectable } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loggedIn: boolean = false;
  constructor(private dataStorage: DataStorageService) {}

  login(body: any) {
    this.dataStorage.PostRequest("login", body).subscribe(
      (response: any) => {
        console.log(response);
        this.loggedIn = true;
      }
    );
  }

}
