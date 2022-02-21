import { createReducer, on } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import * as blocks from '../models/blocks.model';
import * as blockActions from './blocks.actions';
import * as DEFAULTS from './DEFAULTS';

export const initialState: blocks.blocksState = getDefault();
 
export const blocksReducer = createReducer(
  initialState,
  on(blockActions.setYears, (state, { years }) => {
      return {
        ...state,
        years
      }
  }),
  on(blockActions.setYear, (state, { year, yearNum }) => {
    let years = {...state.years};
    years[yearNum] = cloneDeep(year);
    return {
      ...state,
      years
    };
  }),
  on(blockActions.setYearLoading, (state, { isLoading, yearNum }) => {
    let yearsLoading = [...state.yearsLoading];
    console.log('load a new year?', isLoading, 'years arr', yearsLoading);
    if (isLoading && !yearsLoading.find(yearN => yearN === yearNum)) {
      yearsLoading.push(yearNum);
      console.log('adding year to load', yearsLoading);
    } else if (!isLoading && yearsLoading.find(yearN => yearN ===yearNum)) {
      yearsLoading = yearsLoading.filter(yearN => yearN !== yearNum);
      console.log('removing year to load', yearsLoading);
    }
    return {
      ...state,
      yearsLoading
    };
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
    years: {} as blocks.years,
    yearsLoading: [] as number[],
    isEditing: DEFAULTS.BLOCKS_EDITING,
  };
}