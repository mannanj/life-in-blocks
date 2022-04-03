import { createReducer, on } from '@ngrx/store';
import * as appActions from './app.actions';
import * as app from 'src/app/models/app.model';
import * as DEFAULTS from 'src/app/state/DEFAULTS';

export const initialState: app.appState = getDefault();

function getDefault() {
  return  {
    settings: DEFAULTS.NO_SETTINGS,
    starting: DEFAULTS.APP_IS_STARTING,
    loading: DEFAULTS.APP_IS_LOADING,
  };
}
 
export const appReducer = createReducer(
  initialState,
  on(appActions.setStart, (state, { starting }) => {
      return {
        ...state,
        starting
      }
  }),
  on(appActions.setLoading, (state, { loading }) => {
      return {
        ...state,
        loading
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