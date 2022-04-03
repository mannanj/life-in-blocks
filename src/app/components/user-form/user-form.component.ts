import { Component, OnInit } from '@angular/core';

enum Modes {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
}
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  mode = Modes.SIGNUP;
  LOGIN = Modes.LOGIN;
  SIGNUP = Modes.SIGNUP;
  // form values
  email = '';
  password = '';
  fname = '';
  lname = '';
  dob!:Date;


  constructor() { }

  ngOnInit(): void {
  }

  changeMode(mode: Modes) {
    this.mode = mode;
  }

  login() {
    console.log('loggingin!');
  }

  signup() {
    console.log('signing up!');
  }

}
