import { createReducer, on } from '@ngrx/store';
import * as blocks from '../models/blocks.model';
import * as blockActions from './blocks.actions';
import * as DEFAULTS from './DEFAULTS';

export interface blocksState {
  weeksByYear: blocks.weeksByYear;
}

export const initialState: blocksState = getDefault();
 
export const blocksReducer = createReducer(
  initialState,
  on(blockActions.setAllWeeksByYear, (state, { weeksByYear }) => {
      return {
        ...state,
        weeksByYear
      }
  }),
  on(blockActions.setWeeksForYear, (state, { blocks, year }) => setWeeksForYear(state, blocks, year)),
);

function getDefault() {
  return  {'weeksByYear': DEFAULTS.WEEKS_BY_YEAR() };
}

function setWeeksForYear(state: blocksState, blocks: blocks.week[], year: number) {
  let weeksByYear = {...state.weeksByYear};
  return {
    ...state,
    weeksByYear
  };
}