import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor() { }

  typeOfAction: number = 0;
  chatCreationType: number = 0;
  generalClosing() {
    this.typeOfAction = 0;
  }
}
