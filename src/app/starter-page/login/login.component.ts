import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../service/auth.service';
import { Router } from '@angular/router';
import {DatabaseService} from '../../service/database.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public loginForm: FormGroup;
  public hide = true;
  public wrongLogin = false;
  constructor(private formBuilder: FormBuilder, private auth: AuthService, private db: DatabaseService, private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.email,
        Validators.required
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
      ]))
    });
  }
  public loginUser(): void {
      this.auth.login(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value)
        .catch(() => this.wrongLogin = true)
        .then(() => {
        this.router.navigate(['/chatroom']).then(() =>
        this.db.updateUserStatus(this.loginForm.get('email')?.value, true));
      });
  }
}
