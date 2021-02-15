import { Component } from '@angular/core';

@Component({
  selector: 'app-starter-page',
  templateUrl: './starter-page.component.html',
  styleUrls: ['./starter-page.component.css']
})
export class StarterPageComponent {
  public register = false;
  constructor() { }
  public goLogin(): void {
    this.register = false;
  }
  public goRegister(): void {
    this.register = true;
  }
}
