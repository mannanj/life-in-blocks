import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as app from 'src/app/models/app.model';
 
export const selectAppState = createFeatureSelector<app.appState>('app');

export const getStarting$ = createSelector(
    selectAppState,
    (state: app.appState) => state.starting
);

export const getLoading$ = createSelector(
    selectAppState,
    (state: app.appState) => state.loading
);

export const getSettings$ = createSelector(
    selectAppState,
    (state: app.appState) => state.settings
);

export const getDob$ = createSelector(
    getSettings$,
    (settings: app.settings) => settings.dob
);

export const getZoom$ = createSelector(
    getSettings$,
    (settings: app.settings) => settings.zoom
);