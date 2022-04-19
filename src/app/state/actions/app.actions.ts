import { createAction, props } from '@ngrx/store';
import * as app from 'src/app/models/app.model';

export const setStart = createAction(
  '[App] Starting',
  props<{ starting: boolean }>()
);

export const setLoading = createAction(
  '[App] Loading',
  props<{ loading: boolean }>()
);

export const setDob = createAction(
  '[App] DOB',
  props<{ dob: Date }>()
);

export const setSettings = createAction(
  '[App] Settings',
  props<{ settings: app.settings }>()
);

// Zoom
export const setZoom = createAction(
  '[App] Zoom',
  props<{ zoom: number }>()
)