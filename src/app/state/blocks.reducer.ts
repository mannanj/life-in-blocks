import { createReducer, on } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import * as blocks from '../models/blocks.model';
import * as blockActions from './blocks.actions';
import * as DEFAULTS from './DEFAULTS';

export const initialState: blocks.blocksState = getDefault();
 
export const blocksReducer = createReducer(
  initialState,
  on(blockActions.initYears, (state, { yearRange }) => {
    let years = {} as blocks.years;
    yearRange.forEach(yearNum => years[yearNum] = {});
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
  on(blockActions.setYearLoading, (state, { loading, yearNum }) => {
    let yearsLoading = [...state.yearsLoading];
    if (loading && !yearsLoading.find(yearN => yearN === yearNum)) {
      yearsLoading.push(yearNum);
    } else if (!loading && yearsLoading.find(yearN => yearN ===yearNum)) {
      yearsLoading = yearsLoading.filter(yearN => yearN !== yearNum);
    }
    return {
      ...state,
      yearsLoading
    };
  }),
  on(blockActions.setEditing, (state, { editing }) => {
    return {
      ...state,
      editing
    }
  }),
  on(blockActions.setActiveBlockId, (state, { activeBlockId }) => {
    return {
      ...state,
      activeBlockId
    }
  })
);

function getDefault() {
  return  {
    years: {} as blocks.years,
    yearsLoading: [] as number[],
    editing: DEFAULTS.BLOCKS_EDITING,
    activeBlockId: ''
  };
}