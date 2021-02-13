import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DatabaseService} from '../../service/database.service';
import {Message} from '../../model/message';
import {User} from '../../model/user';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterContentChecked, OnDestroy {
  @Input() me: User;
  private subscription = new Subscription();
  private startApp = true;
  private audio = new Audio();
  public messageForm: FormGroup;
  public messageList: Message[] | undefined;
  constructor(private db: DatabaseService, private formBuilder: FormBuilder, private cd: ChangeDetectorRef, private title: Title) {
    this.me = {
      email: '',
      colorInChat: '',
      status: false,
    };
    this.messageForm = this.formBuilder.group({
      message: new FormControl(''),
    });
  }
  ngOnInit(): void {
    this.getMessage();
  }
  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }
  private getMessage(): void {
    this.db.getMessageList().subscribe((messageList: Message[]) => {
      this.messageList = messageList;
      if (this.startApp) {
        this.startApp = false;
      } else {
        if (messageList[messageList.length - 1].email !== this.me.email) {
          this.title.setTitle('Chat app - nowa wiadomosc');
          this.audio.src = 'assets/new-message.mp3';
          this.audio.load();
          this.audio.play();
        }
      }
      this.cd.detectChanges();
    });
  }
  public sendMessage(): void {
    const message: Message = {
      email: this.me.email,
      message: this.messageForm.get('message')?.value,
      time: {},
      color: this.me.colorInChat
    };
    this.db.insertMessage(message);
    this.messageForm = this.formBuilder.group({
      message: new FormControl(''),
    });
  }
  public readMessage(): void {
    this.title.setTitle('ChatApp');
  }
  ngOnDestroy(): void {
    this.readMessage();
    this.subscription.unsubscribe();
  }
}
