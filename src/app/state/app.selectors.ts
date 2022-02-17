import { createSelector, createFeatureSelector } from '@ngrx/store';
import { appState } from './app.reducer';
 
export const selectAppState = createFeatureSelector<appState>('app');
export const getUser$ = createSelector(
    selectAppState,
    (state: appState) => state.user
);
export const getSettings$ = createSelector(
    selectAppState,
    (state: appState) => state.settings
);