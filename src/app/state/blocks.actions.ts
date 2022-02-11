import { createAction, props } from '@ngrx/store';
import * as blocks from '../models/blocks.model';

// Weeks
export const setAllWeeksByYear = createAction(
  '[Blocks] Set All Weeks By Year',
  props<{ weeksByYear: blocks.weeksByYear }>()
);
export const setWeeksForYear = createAction(
  '[Blocks] Set Weeks For Year',
  props<{ blocks: blocks.week[], year: number }>()
);

// Zoom
export const setZoomLevel = createAction(
  '[Blocks] Set Zoom Level',
  props<{ zoomLevel: number }>()
)

// Others
export const setIsLoading = createAction(
  '[Blocks] Blocks Are Loading',
  props<{ isLoading: boolean }>()
)