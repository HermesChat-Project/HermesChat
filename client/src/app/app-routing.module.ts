import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatSelectorComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "chat",
    component: ChatSelectorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
