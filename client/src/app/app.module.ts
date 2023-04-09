import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatSelectorComponent } from './chat/chat.component';
import { HeaderChatSelectorComponent } from './chat/header-chat-selector/header-chat-selector.component';
import { ChooseChatComponent } from './chat/choose-chat/choose-chat.component';
import { AllChatsComponent } from './chat/choose-chat/all-chats/all-chats.component';
import { FriendsListComponent } from './chat/choose-chat/friends-list/friends-list.component';
import { CallsListComponent } from './chat/choose-chat/calls-list/calls-list.component';
import { CalendarComponent } from './chat/choose-chat/calendar/calendar.component';
import { PersonalComponent } from './chat/choose-chat/calendar/personal/personal.component';
import { GroupComponent } from './chat/choose-chat/calendar/group/group.component';
import { PersonalEventComponent } from './chat/choose-chat/calendar/personal/personal-event/personal-event.component';
import { GroupEventComponent } from './chat/choose-chat/calendar/group/group-event/group-event.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { SettingsComponent } from './chat/header-chat-selector/settings/settings.component';
import { CreateChatComponent } from './chat/header-chat-selector/create-chat/create-chat.component';
import { FriendsRequestComponent } from './chat/header-chat-selector/friends-request/friends-request.component';
import { ChatViewComponent } from './chat/chat-view/chat-view.component';
import { HttpClientModule } from '@angular/common/http';
import { MessageComponent } from './chat/chat-view/message/message.component';
import { WebcamModule } from 'ngx-webcam';
import { CameraComponent } from './chat/chat-view/camera/camera.component';

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
    FriendsRequestComponent,
    ChatViewComponent,
    MessageComponent,
    CameraComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    WebcamModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
