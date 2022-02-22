import { createAction, props } from '@ngrx/store';
import * as blocks from '../models/blocks.model';

// Weeks
export const initYears = createAction(
  '[Blocks] Initialize Years',
  props<{ yearRange: number[] }>()
);
export const setYear = createAction(
  '[Blocks] Set Year',
  props<{ year: blocks.year, yearNum: number }>()
);
export const setYearLoading = createAction(
  '[Blocks] Set Year Loading',
  props<{ loading: boolean, yearNum: number }>()
);

// Others
export const setEditing = createAction(
  '[Blocks] Editing',
  props<{ editing: boolean }>()
)
export const setActiveBlockId = createAction(
  '[Blocks] Active Block Id',
  props<{ activeBlockId: string }>()
)