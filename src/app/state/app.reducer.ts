import { createReducer, on } from '@ngrx/store';
import * as appActions from './app.actions';
import * as app from 'src/app/models/app.model';
import * as DEFAULTS from 'src/app/state/DEFAULTS';

export const initialState: app.appState = getDefault();
 
export const appReducer = createReducer(
  initialState,
  on(appActions.setIsStarting, (state, { isStarting }) => {
      return {
        ...state,
        isStarting
      }
  }),
  on(appActions.setIsLoading, (state, { isLoading }) => {
      return {
        ...state,
        isLoading
      }
  }),
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
  on(appActions.setDob, (state, { dob }) => {
      return {
        ...state,
        settings: {
          ...state.settings,
          dob
        }
      }
  }),
  on(appActions.setZoom, (state, { zoom }) => {
    return {
      ...state,
      settings: {
        ...state.settings,
        zoom
      }
    }
  }),
);

function getDefault() {
  return  {
    user: DEFAULTS.NO_USER,
    settings: DEFAULTS.NO_SETTINGS,
    isStarting: DEFAULTS.APP_IS_STARTING,
    isLoading: DEFAULTS.APP_IS_LOADING,
  };
}