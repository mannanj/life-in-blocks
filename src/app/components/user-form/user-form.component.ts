import { Component, OnInit } from '@angular/core';

// Store
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import * as appActions from 'src/app/state/actions/app.actions';
import * as userActions from 'src/app/state/actions/user.actions';
import * as appSelectors from 'src/app/state/selectors/app.selectors';

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
  appLoading = false;

  // Flags
  private _unsubscribe$ = new Subject<void>();


  constructor(
    private store: Store) { }

  ngOnInit(): void {
    // set samples for test
    // this.email = 'mannanjavid@gmail.com';
    // this.password = 'asdfghjj!@#4ascd';
    // this.cpassword = 'asdfghjj!@#4ascd';
    // this.fname = 'Mannan';
    // this.lname = 'Javid';
    // this.dob! = new Date();
    // end test
    this.store.select(appSelectors.getLoading$)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(loading => this.appLoading = loading);
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete()
  }

  changeMode(mode: Modes) {
    this.mode = mode;
  }

  login() {
    this.store.dispatch(userActions.signIn({ account: this.getAccount() }));
  }

  signup() {
    this.store.dispatch(userActions.createAccount({ account: this.getAccount() }));
  }

  getAccount(): any {
    return {
      fName: this.fname,
      lName: this.lname,
      dob: this.dob,
      email: this.email,
      password: this.password
    }
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
