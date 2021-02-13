import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StarterPageComponent} from './starter-page/starter-page.component';
import {AuthGuard} from './guard/auth.guard';
import {ChatroomComponent} from './chatroom/chatroom.component';

const routes: Routes = [
  { path: '', redirectTo: '/starter-page', pathMatch: 'full' },
  { path: 'starter-page', component: StarterPageComponent},
  { path: 'chatroom', component: ChatroomComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/starter-page' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
