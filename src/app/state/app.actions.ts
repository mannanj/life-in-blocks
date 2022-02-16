import { createAction, props } from '@ngrx/store';

export const setUser = createAction(
  '[App] Set User',
  props<{ user: string }>()
);