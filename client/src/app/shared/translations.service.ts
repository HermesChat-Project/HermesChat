import { Injectable } from '@angular/core';
import _it from "../../assets/languages/it.json"
import _en from "../../assets/languages/en.json"

@Injectable({
  providedIn: 'root'
})
export class TranslationsService {

  constructor() { }

  languageSelected: string = ""
  languageWords: any = {}

  languagesList: string[] = ['it', 'en']

  getLanguage(language?: string) {

    switch (language) {
      case 'it':
        this.languageWords = _it
        break;
      default:
        this.languageSelected = 'en'
        this.languageWords = _en
        break;
    }

    return this.languageSelected;

  }
}
