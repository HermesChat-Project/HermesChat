import { Component, Input } from '@angular/core';
import { callsModel } from 'model/calls.model';
import { userModel } from 'model/user.model';

@Component({
  selector: 'app-calls-list',
  templateUrl: './calls-list.component.html',
  styleUrls: ['./calls-list.component.css']
})
export class CallsListComponent {
  @Input() callsList!: callsModel[];
  name_receivers: any[]=[];

  ngOnInit(){
    //get name of the receiver

    for (const item of this.callsList) {
      this.name_receivers.push({'name': this.callsList[item.id_receiver].id_user, 'img': ""});

    }
    //add name of the receiver to the callsList
    for (let i = 0; i < this.callsList.length; i++) {
      this.callsList[i].name_receiver = this.name_receivers[i].name;
      this.callsList[i].img_receiver = this.name_receivers[i].img;
    }

  }

  getDate(date: Date){
    let today = date.getDate();
    let hour: string = date.getHours().toString();
    let minute: string = date.getMinutes().toString();
    if (today + 1 == new Date().getDate())
      return 'ieri';
    else {
      if (hour.length < 2)
        hour = '0' + hour;
      if (minute.length < 2)
        minute = '0' + minute;
      return hour + ':' + minute;
    }
  }

}
