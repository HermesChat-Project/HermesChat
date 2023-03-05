import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatSelectorComponent } from './chat-selector/chat-selector.component';
import { HeaderChatSelectorComponent } from './chat-selector/header-chat-selector/header-chat-selector.component';
import { ChooseChatComponent } from './chat-selector/choose-chat/choose-chat.component';
import { AllChatsComponent } from './chat-selector/choose-chat/all-chats/all-chats.component';
import { FriendsListComponent } from './chat-selector/choose-chat/friends-list/friends-list.component';
import { CallsListComponent } from './chat-selector/choose-chat/calls-list/calls-list.component';
import { CalendarComponent } from './chat-selector/choose-chat/calendar/calendar.component';
import { PersonalComponent } from './chat-selector/choose-chat/calendar/personal/personal.component';
import { GroupComponent } from './chat-selector/choose-chat/calendar/group/group.component';
import { PersonalEventComponent } from './chat-selector/choose-chat/calendar/personal/personal-event/personal-event.component';
import { GroupEventComponent } from './chat-selector/choose-chat/calendar/group/group-event/group-event.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { SettingsComponent } from './chat-selector/header-chat-selector/settings/settings.component';
import { CreateChatComponent } from './chat-selector/header-chat-selector/create-chat/create-chat.component';
import { FriendsRequestComponent } from './chat-selector/header-chat-selector/friends-request/friends-request.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatSelectorComponent,
    HeaderChatSelectorComponent,
    ChooseChatComponent,
    AllChatsComponent,
    FriendsListComponent,
    CallsListComponent,
    CalendarComponent,
    PersonalComponent,
    GroupComponent,
    PersonalEventComponent,
    GroupEventComponent,
    LoginComponent,
    SettingsComponent,
    CreateChatComponent,
    FriendsRequestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
