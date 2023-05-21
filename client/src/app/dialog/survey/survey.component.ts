import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChatSelectorService } from 'src/app/chat/chat.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SurveyComponent {
  @ViewChild('options') options!: ElementRef;
  @ViewChild('content') content!: ElementRef;
  option_number: number = 2;
  txtTitle: string = "";
  exclude: boolean = false;
  constructor(private dialog: MatDialogRef<SurveyComponent>, public chatSelector: ChatSelectorService) { }
  eightoptionsfull: boolean = false;
  closeSurvey() {
    //close the angular dialog
    this.dialog.close();

  }
  checkText(event: Event, number: number) {
    let el = (event.currentTarget as HTMLInputElement)
    let data = el.value;
    if (data?.trim() != "" && number >= this.option_number) {
      this.generateAnotherOption();
    }
  }

  changeSurveyCheckbox(event: Event) {
    this.exclude = (event.currentTarget as HTMLInputElement).checked;
  }

  controlElement(event: FocusEvent, number: number) {
    if (this.option_number > 2 && number < this.option_number) {
      let el = (event.currentTarget as HTMLInputElement)
      let data = el.value;
      if (data?.trim() == "") {

        el.parentElement?.remove();
        this.option_number--;
        this.eightoptionsfull = false;

      }

      let divs = this.options.nativeElement.children;
      let option_list: string[] = [];
      for (const div of divs) {
        let input = div.children[0] as HTMLInputElement;
        if (input.value.trim() != "") {
          if (!option_list.includes(input.value)) {
            option_list.push(input.value);
            (div.children[1] as HTMLElement).style.visibility = "hidden";
          }
          else {
            (div.children[1] as HTMLElement).style.visibility = "visible";
          }
        }
      }

    }
  }

  generateAnotherOption() {
    this.option_number++;
    let text_number = this.option_number

    let div = document.createElement('div');
    div.className = "survey_option";
    let option = document.createElement('input');
    let same_value = document.createElement('p');
    option.type = "text";
    option.className = "survey_option_text";
    option.placeholder = "Inserisci l'opzione";

    option.addEventListener('input', (event) => this.checkText(event, text_number));
    option.addEventListener('blur', (event) => this.controlElement(event, text_number));


    same_value.className = "no-same-option";
    same_value.innerHTML = "Opzione già inserita";
    div.appendChild(option);
    div.appendChild(same_value);
    this.options.nativeElement.appendChild(div);

    this.bottomScroll();
  }

  bottomScroll() {
    this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
  }

  checkSurvey() {
    if (this.txtTitle.trim() == "")
      return;
    let option_list: string[] = [];
    let divs = this.options.nativeElement.children;
    for (const div of divs) {
      let input = div.children[0] as HTMLInputElement;
      if (input.value.trim() != "") {
        if (option_list.includes(input.value))
          return;
        option_list.push(input.value);

      }
    }
    if (option_list.length < 2)
      return;
    this.sendSurvey(option_list);
  }

  sendSurvey(option_list: string[]) {
    let body: { title: string,survey: { options: Array<{ text: string, user_voted: Array<string> }>, exclusion: boolean} } = { title: this.txtTitle,survey:{ options: [], exclusion: this.exclude} };
    for (const option of option_list) {
      body.survey.options.push({ text: option, user_voted: [] });

      this.dialog.close(body);
    }
  }
}
