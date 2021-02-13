import { Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {Message} from '../model/message';
import {Observable} from 'rxjs';
import {User} from '../model/user';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private messageList: AngularFireList<Message>;
  private userList: AngularFireList<User>;
  private updateUserList: any[];
  constructor(private db: AngularFireDatabase) {
    this.updateUserList = [];
    this.messageList = this.db.list('message', ref => ref.orderByChild('time'));
    this.userList = this.db.list('user', ref => ref.orderByChild('status'));
    this.userList.snapshotChanges().subscribe(list => this.updateUserList = list);
  }
  public getMessageList(): Observable<Message[]> {
    return this.messageList.valueChanges();
  }
  public insertMessage(message: Message): void {
    message.time = firebase.database.ServerValue.TIMESTAMP;
    this.messageList.push(message);
  }
  public getUserList(): Observable<User[]> {
    return this.userList.valueChanges();
  }
  public insertUser(user: User): void {
    this.userList.push(user);
  }
  public updateUserStatus(userEmail: string, status: boolean): void {
    this.updateUserList = this.updateUserList.filter(item => item.payload.val().email === userEmail);
    this.userList.update(this.updateUserList[0].key, { 'status': status });
  }
  public updateUserColorInChat(userEmail: string, colorInChat: string): void {
    this.updateUserList = this.updateUserList.filter(item => item.payload.val().email === userEmail);
    this.userList.update(this.updateUserList[0].key, { 'colorInChat': colorInChat });
  }
}
