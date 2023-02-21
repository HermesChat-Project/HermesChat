import { Component, Input } from '@angular/core';
import { callsModel } from 'model/calls.model';
import { userModel } from 'model/user.model';

@Component({
  selector: 'app-calls-list',
  templateUrl: './calls-list.component.html',
  styleUrls: ['./calls-list.component.css']
})
export class CallsListComponent {
  @Input() userList!: userModel;

  callsList: callsModel[] = []
  name_receivers: any[]=[];

  ngOnInit(){
    //get name of the receiver
    this.callsList = this.userList.calls;
    let chatList = this.userList.chatList
    for (const item of this.callsList) {
      this.name_receivers.push({'name': chatList[item.id_receiver].name, 'img': chatList[item.id_receiver].img});

    }
    //add name of the receiver to the callsList
    for (let i = 0; i < this.callsList.length; i++) {
      this.callsList[i].name_receiver = this.name_receivers[i].name;
      this.callsList[i].img_receiver = this.name_receivers[i].img;
    }

  }

  getDate(date: Date){
    return (date.toLocaleString().split(',')[1]).trim()
  }

}
