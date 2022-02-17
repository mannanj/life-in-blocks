import { createReducer, on } from '@ngrx/store';
import * as appActions from './app.actions';
import * as app from 'src/app/models/app.model';
import * as DEFAULTS from 'src/app/state/DEFAULTS';
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
  on(appActions.setSettings, (state, { settings }) => {
      return {
        ...state,
        settings
      }
  }),
);

function getDefault() {
  return  {
    user: DEFAULTS.NEW_USER,
    settings: DEFAULTS.SETTINGS
  };
}