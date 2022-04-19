import { createAction, props } from '@ngrx/store';
import * as user from 'src/app/models/user.model';

export const setAccount = createAction(
  '[User] Account',
  props<{ account: user.account }>()
);

export const setLoggedIn = createAction(
  '[User] Logged In',
  props<{ loggedIn: boolean }>()
);

export const setLoading = createAction(
  '[User] Loading',
  props<{ loading: boolean }>()
);

export const createAccount = createAction(
  '[User] Create Account',
  props<{ account: user.account }>()
);

export const signIn = createAction(
  '[User] Sign In',
  props<{ account: user.account }>()
);

export const sendEmail = createAction('[User] Send Activation Email');
export const emailSent = createAction('[User] Email Verification Sent');