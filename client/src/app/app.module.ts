import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatSelectorComponent } from './chat-selector/chat-selector.component';
import { HeaderChatSelectorComponent } from './chat-selector/header-chat-selector/header-chat-selector.component';
import { ChooseChatComponent } from './chat-selector/choose-chat/choose-chat.component';
import { FooterChatSelectorComponent } from './chat-selector/footer-chat-selector/footer-chat-selector.component';
import { VerticalBarComponent } from './vertical-bar/vertical-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatSelectorComponent,
    HeaderChatSelectorComponent,
    ChooseChatComponent,
    FooterChatSelectorComponent,
    VerticalBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
