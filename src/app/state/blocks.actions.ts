import { createAction, props } from '@ngrx/store';
import * as blocks from '../models/blocks.model';

// Weeks
export const setYears = createAction(
  '[Blocks] Set Years',
  props<{ years: blocks.years }>()
);
export const setYear = createAction(
  '[Blocks] Set Year',
  props<{ year: blocks.year, yearNum: number }>()
);
export const setYearLoading = createAction(
  '[Blocks] Set Year Loading',
  props<{ isLoading: boolean, yearNum: number }>()
);

// Others
export const setIsEditing = createAction(
  '[Blocks] Is Editing',
  props<{ isEditing: boolean }>()
)