import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase';
import auth = firebase.auth;
import {Observable} from 'rxjs';
import User = firebase.User;

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private fireAuth: AngularFireAuth) {
  }
  readonly authState$: Observable<User | null> = this.fireAuth.authState;
  public async register(email: string, password: string): Promise<void> {
    try {
      await this.fireAuth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
      window.alert(error);
    }
  }
  public login(email: string, password: string): Promise<auth.UserCredential> {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }
  public logout(): Promise<void> {
    return this.fireAuth.signOut();
  }
  public getMe(): string | null | undefined {
    return auth().currentUser?.email;
  }
}
