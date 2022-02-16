import { createReducer, on } from '@ngrx/store';
import * as blocks from '../models/blocks.model';
import * as blockActions from './blocks.actions';
import * as dth from 'src/app/helpers/datetime.helpers';
import * as DEFAULTS from './DEFAULTS';
import { compareAsc, format } from 'date-fns';

export interface blocksState {
  weeksByYear: blocks.weeksByYear;
  zoom: blocks.zoom;
  isLoading: boolean;
  isEditing: boolean;
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
  on(blockActions.setWeeksForYear, (state, { blocks, year }) => {
    let weeksByYear = {...state.weeksByYear};
    return {
      ...state,
      weeksByYear
    };
  }),
  on(blockActions.setZoomLevel, (state, { zoomLevel }) => {
    return {
      ...state,
      zoom: {
        ...state.zoom,
        zoomLevel
      }
    }
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
    zoom: { zoomLevel: DEFAULTS.zoomLevel },
    isLoading: DEFAULTS.isLoading,
    isEditing: DEFAULTS.isEditing,
  };
}