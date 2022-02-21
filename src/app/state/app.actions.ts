import { createAction, props } from '@ngrx/store';
import * as app from 'src/app/models/app.model';

export const setIsStarting = createAction(
  '[App] Is Starting',
  props<{ isStarting: boolean }>()
);

export const setIsLoading = createAction(
  '[App] Is Loading',
  props<{ isLoading: boolean }>()
);

export const setUser = createAction(
  '[App] User',
  props<{ user: string }>()
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