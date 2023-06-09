import { Component, ViewChild, ElementRef } from '@angular/core';
import { ChatSelectorService } from 'src/app/chat/chat.service';

@Component({
  selector: 'app-info-chat',
  templateUrl: './info-chat.component.html',
  styleUrls: ['./info-chat.component.css']
})
export class InfoChatComponent {

  @ViewChild("rcOption") rcOption!: ElementRef;
  constructor(public chatSelector: ChatSelectorService) { }
  selected_member: { idUser: string, image: string, nickname: string, role:string } | null = null;
  closeInfo(){
    this.chatSelector.closeInfo();
  }

  leaveGroup(){
    this.chatSelector.leaveGroup();
  }

  report(){

  }

  removeUser(member: { idUser: string; image: string; nickname: string; role:string }){
    this.chatSelector.removeUser(member.idUser, this.chatSelector.selectedChat!._id);
    this.chatSelector.openOption = false;
  }

  checkAdmin(){
    let member = this.chatSelector.selectedChat?.users.find(member => member.idUser == this.chatSelector.infoUser._id);
    if(member && member.role == "admin"){
      return true;
    }
    return false;

  }


  rightClick(event: MouseEvent, member: { idUser: string; image: string; nickname: string; role:string }){
    event.preventDefault();
    event.stopPropagation();
    this.chatSelector.openOption = true;
    this.selected_member = member;

    let x = event.clientX;
    let y = event.clientY;
    this.rcOption.nativeElement.style.top = (y-100) + "px";
    this.rcOption.nativeElement.style.left = x + "px";
  }

  addUser(){
    this.chatSelector.userNonChatFriendList = this.chatSelector.friendList.filter(friend => !this.chatSelector.selectedChat?.users.find(member => member.idUser == friend.id));
    this.chatSelector.openAddUserDialog();
  }

  changeRole(member: { idUser: string; image: string; nickname: string; role:string }){
    let role = member.role == "normal" ? "admin" : "normal";

    let body = {
      user: member.idUser,
      role: role,
      chatId: this.chatSelector.selectedChat!._id
    }
    this.chatSelector.changeRole(body);
    this.chatSelector.openOption = false;
  }
}
