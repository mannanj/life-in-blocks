import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as app from 'src/app/models/app.model';
 
export const selectAppState = createFeatureSelector<app.appState>('app');
export const getIsStarting$ = createSelector(
    selectAppState,
    (state: app.appState) => state.isStarting
);
export const getUser$ = createSelector(
    selectAppState,
    (state: app.appState) => state.user
);
export const getSettings$ = createSelector(
    selectAppState,
    (state: app.appState) => state.settings
);

export const getZoom$ = createSelector(
    getSettings$,
    (settings: app.settings) => settings.zoom
);