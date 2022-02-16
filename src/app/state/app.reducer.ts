import { createReducer, on } from '@ngrx/store';
import * as appActions from './app.actions';
import * as app from 'src/app/models/app.model';

export interface appState {
  user: string;
  settings: app.settings;
}

export const initialState: appState = getDefault();
 
export const appReducer = createReducer(
  initialState,
  on(appActions.setUser, (state, { user }) => {
      return {
        ...state,
        user
      }
  }),
);

function getDefault() {
  return  {
    user: '',
    settings: { yearHasData: {} }
  };
}