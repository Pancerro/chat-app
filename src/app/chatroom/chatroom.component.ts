import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DatabaseService} from '../service/database.service';
import {AuthService} from '../service/auth.service';
import {Router} from '@angular/router';
import {User} from '../model/user';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) private sidenav: any;
  public me: User;
  constructor(private auth: AuthService, private db: DatabaseService, private router: Router) {
    this.me = {
      email: '',
      colorInChat: '',
      status: false,
    };
  }

  ngOnInit(): void {
    this.db.getUserList().subscribe((userList: User[]) => {
    this.me = userList.filter(user => user.email === this.auth.getMe())[0];
    });
    setTimeout(() =>
      this.db.updateUserStatus(this.me.email, true)
    , 1000);
  }
  public closeSidenav(): void {
    this.sidenav.toggle();
  }
  public logout(): void {
    this.auth.logout().then(() => {
      this.router.navigate(['/starter-page']);
      this.db.updateUserStatus(this.me.email, false);
      }
    );
  }
  @HostListener('window:beforeunload')
  unloadHandler(): void {
    this.db.updateUserStatus(this.me?.email, false);
  }
  ngOnDestroy(): void {
    this.db.updateUserStatus(this.me?.email, false);
  }
}

