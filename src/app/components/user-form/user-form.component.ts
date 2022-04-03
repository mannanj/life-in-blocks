import { Component, OnInit } from '@angular/core';

enum Modes {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
}

const emailExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
const pwExp = new RegExp("^(?=.*[a-z])(?=.*[0-9])(?=.{8,})");
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
  cpassword = '';
  fname = '';
  lname = '';
  dob!: Date;


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

  loginValid(): boolean {
    const emailValid = this.emailValid(this.email);
    const pwValid = this.pwValid(this.password);
    return emailValid && pwValid;
  }

  signupValid(): boolean {
    const emailValid = this.emailValid(this.email);
    const pwValid = this.pwValid(this.password) && this.password === this.cpassword;
    const fNameValid = this.nameValid(this.fname);
    const lNameValid = this.nameValid(this.lname);
    const dobValid = this.dobValid(this.dob);
    return emailValid && pwValid && fNameValid && lNameValid && dobValid;
  }

  emailValid(email: string) {
    return email.length > 0 && emailExp.test(email);
  }

  pwValid(password: string) {
    return password.length > 0 && pwExp.test(password);
  }

  nameValid(name: string) {
    return name.length > 0;
  }

  dobValid(dob: Date) {
    return !!dob;
  }
}
