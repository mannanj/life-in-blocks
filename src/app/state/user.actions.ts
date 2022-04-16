import { createAction, props } from '@ngrx/store';

export const setAccount = createAction(
  '[User] Account',
  props<{ account: any }>()
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
  props<{ account: any }>()
);

export const signIn = createAction(
  '[User] Sign In',
  props<{ account: any }>()
);