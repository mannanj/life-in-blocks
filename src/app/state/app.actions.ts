import { createAction, props } from '@ngrx/store';
import * as app from 'src/app/models/app.model';

export const setUser = createAction(
  '[App] Set User',
  props<{ user: string }>()
);

export const setSettings = createAction(
  '[App] Set Settings',
  props<{ settings: app.settings }>()
);


// Zoom
export const setZoomLevel = createAction(
  '[App] Set Zoom Level',
  props<{ zoomLevel: number }>()
)