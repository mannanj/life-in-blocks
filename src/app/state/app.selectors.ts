import { createSelector, createFeatureSelector } from '@ngrx/store';
import { appState } from './app.reducer';
import * as app from 'src/app/models/app.model';
 
export const selectAppState = createFeatureSelector<appState>('app');
export const getUser$ = createSelector(
    selectAppState,
    (state: appState) => state.user
);
export const getSettings$ = createSelector(
    selectAppState,
    (state: appState) => state.settings
);

export const getZoomLevel$ = createSelector(
    getSettings$,
    (settings: app.settings) => settings.zoom.zoomLevel
);