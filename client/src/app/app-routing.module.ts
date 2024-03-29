import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatSelectorComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MobileComponent } from './mobile/mobile.component';

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "signup",
    component: SignupComponent
  },
  {
    path: "chat",
    component: ChatSelectorComponent
  },
  {
    path: "mobile",
    component: MobileComponent
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
