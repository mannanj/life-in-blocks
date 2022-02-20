import { createAction, props } from '@ngrx/store';
import * as app from 'src/app/models/app.model';

export const setIsStarting = createAction(
  '[App] Set Is Starting',
  props<{ isStarting: boolean }>()
);

export const setUser = createAction(
  '[App] Set User',
  props<{ user: string }>()
);

export const setDob = createAction(
  '[App] Set Dob',
  props<{ dob: Date }>()
);

export const setSettings = createAction(
  '[App] Set Settings',
  props<{ settings: app.settings }>()
);


// Zoom
export const setZoom = createAction(
  '[App] Set Zoom',
  props<{ zoom: number }>()
)