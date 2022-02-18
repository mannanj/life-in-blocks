import { createReducer, on } from '@ngrx/store';
import * as blocks from '../models/blocks.model';
import * as blockActions from './blocks.actions';
import * as DEFAULTS from './DEFAULTS';

export const initialState: blocks.blocksState = getDefault();
 
export const blocksReducer = createReducer(
  initialState,
  on(blockActions.setAllWeeksByYear, (state, { weeksByYear }) => {
      return {
        ...state,
        weeksByYear
      }
  }),
  on(blockActions.setWeeksForYear, (state, { blocks, year }) => {
    let weeksByYear = {...state.weeksByYear};
    return {
      ...state,
      weeksByYear
    };
  }),
  on(blockActions.setIsLoading, (state, { isLoading }) => {
    return {
      ...state,
      isLoading
    }
  }),
  on(blockActions.setIsEditing, (state, { isEditing }) => {
    return {
      ...state,
      isEditing
    }
  })
);

function getDefault() {
  return  {
    weeksByYear: {} as blocks.weeksByYear,
    isLoading: DEFAULTS.BLOCKS_LOADING,
    isEditing: DEFAULTS.BLOCKS_EDITING,
  };
}