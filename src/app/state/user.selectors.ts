import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as user from 'src/app/models/user.model';
 
export const selectUserState = createFeatureSelector<user.userState>('user');

export const getAccount = createSelector(
    selectUserState,
    (state: user.userState) => state.account
);

export const getLoggedIn = createSelector(
    selectUserState,
    (state: user.userState) => state.loggedIn
);

export const getLoading = createSelector(
    selectUserState,
    (state: user.userState) => state.loading
);