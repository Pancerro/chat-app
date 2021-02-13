import {Component, HostListener, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DatabaseService} from '../../service/database.service';
import {User} from '../../model/user';
import {AuthService} from '../../service/auth.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Subject, Subscription} from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {
  @Input() me: User;
  @Output() closeSidenav = new Subject<void>();
  private subscription: Subscription = new Subscription();
  public spinner = true;
  public extend = false;
  public settings = false;
  public meForm: FormGroup;
  public userList: User[] | undefined;

  constructor(private db: DatabaseService, private  auth: AuthService, private formBuilder: FormBuilder) {
    this.meForm = this.formBuilder.group({
      darkMode: new FormControl(false),
      colorInChat: new FormControl('')
    });
    this.me = {
      email: '',
      colorInChat: '',
      status: false,
    };
  }
  ngOnInit(): void {
    this.getUserList();
  }
  private getUserList(): void {
    this.subscription = this.db.getUserList().subscribe((userList: User[]) => {
      this.userList = userList.filter(user => user.email !== this.auth.getMe()).reverse();
      this.spinner = false;
      this.meForm = this.formBuilder.group({
        colorInChat: new FormControl(this.me?.colorInChat)
      });
    });
  }
  public changeStatus(): void {
    this.db.updateUserStatus(this.me?.email, !this.me?.status);
  }
  public changeColor(): void {
    this.db.updateUserColorInChat(this.me?.email, this.meForm.get('colorInChat')?.value);
  }
  public close(): void {
    this.closeSidenav.next();
  }
  @HostListener('window:beforeunload')
  unloadHandler(): void {
    this.auth.logout().then(() => this.db.updateUserStatus(this.me?.email, false));
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
