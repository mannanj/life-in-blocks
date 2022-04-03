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