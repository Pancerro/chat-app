import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../service/auth.service';
import {DatabaseService} from '../../service/database.service';
import {User} from '../../model/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public registerForm: FormGroup;
  public hide = true;
  public registerSuccess = false;
  constructor(private formBuilder: FormBuilder, private auth: AuthService, private db: DatabaseService) {
    this.registerForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.email,
        Validators.required
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
      ])),
      confirmPassword: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
      ])),
    }, {
      validators: this.password.bind(this)
    });
  }
  public password(formGroup: FormGroup): any {
    const password  = formGroup.get('password')?.value;
    const confirmPassword  = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }
  public registerUser(): void {
    const user: User = {
      email: this.registerForm.get('email')?.value,
      colorInChat : 'red',
      status: false
    };
    this.auth.register(this.registerForm.get('email')?.value, this.registerForm.get('password')?.value).then(() => {
      this.db.insertUser(user);
      this.registerSuccess = true;
    });
  }

}
