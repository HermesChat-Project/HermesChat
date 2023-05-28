import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
import { SettingsComponent } from './chat/header-chat-selector/settings/settings.component';
import { CreateChatComponent } from './chat/header-chat-selector/create-chat/create-chat.component';
import { FriendsRequestComponent } from './chat/header-chat-selector/friends-request/friends-request.component';
import { ChatViewComponent } from './chat/chat-view/chat-view.component';
import { MessageComponent } from './chat/chat-view/message/message.component';
import { CameraComponent } from './chat/chat-view/camera/camera.component';
import { FullCalendarComponent } from './chat/right-view/full-calendar/full-calendar.component';
import { RightViewComponent } from './chat/right-view/right-view.component';
import { FriendDetailsComponent } from './chat/right-view/friend-details/friend-details.component';
import { TempChatComponent } from './chat/header-chat-selector/temp-chat/temp-chat.component';
import { InfoUserComponent } from './chat/header-chat-selector/settings/info-user/info-user.component';
import { DeleteMessageComponent } from './dialog/delete-message/delete-message.component';
import { ProgressBarComponent } from './chat/progress-bar/progress-bar.component';
import { SurveyComponent } from './dialog/survey/survey.component';
import { ChartComponent } from './dialog/chart/chart.component';
import { InfoChatComponent } from './chat/header-chat-selector/settings/info-chat/info-chat.component';
import { SignupComponent } from './signup/signup.component';
import { ChatCreationComponent } from './dialog/chat-creation/chat-creation.component';
import { MobileComponent } from './mobile/mobile.component';
import { FriendComponent } from './chat/header-chat-selector/create-chat/group-friend/groupFriend.component';
import { ShareCalendarComponent } from './dialog/share-calendar-list/share-calendar/share-calendar.component';

import { HttpClientModule } from '@angular/common/http';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { WebcamModule } from 'ngx-webcam';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LottieModule } from 'ngx-lottie';
import { ShareCalendarListComponent } from './dialog/share-calendar-list/share-calendar-list.component';

export function playerFactory() {
  return import(/* webpackChunkName: 'lottie-web' */ 'lottie-web');
}
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
    CameraComponent,
    FullCalendarComponent,
    RightViewComponent,
    FriendDetailsComponent,
    TempChatComponent,
    InfoUserComponent,
    DeleteMessageComponent,
    ProgressBarComponent,
    SurveyComponent,
    ChartComponent,
    InfoChatComponent,
    SignupComponent,
    ChatCreationComponent,
    MobileComponent,
    FriendComponent,
    ShareCalendarComponent,
    ShareCalendarListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    WebcamModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    NgApexchartsModule,
    LottieModule.forRoot({ player: playerFactory })
  ],
  providers: [
    MatDatepickerModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
