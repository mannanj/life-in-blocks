import { createReducer, on } from '@ngrx/store';
import * as userActions from './user.actions';
import * as user from 'src/app/models/user.model';
import * as DEFAULTS from 'src/app/state/DEFAULTS';

export const initialState: user.userState = getDefault();

function getDefault() {
  return {...DEFAULTS.NO_USER};
}
 
export const userReducer = createReducer(
  initialState,
  on(userActions.setAccount, (state, { account }) => {
      return {
        ...state,
        account
      }
  }),
  on(userActions.setLoggedIn, (state, { loggedIn }) => {
      return {
        ...state,
        loggedIn
      }
  }),
  on(userActions.setLoading, (state, { loading }) => {
      return {
        ...state,
        loading
      }
  }),
);