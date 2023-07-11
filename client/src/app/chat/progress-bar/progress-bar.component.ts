import { Component } from '@angular/core';
import { ChatSelectorService } from '../chat.service';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent {
  constructor(public chatSelector: ChatSelectorService) {}
}
