import { createReducer, on } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import * as blocks from 'src/app/models/blocks.model';
import * as blockActions from 'src/app/state/actions/blocks.actions';
import * as DEFAULTS from 'src/app/state/DEFAULTS';

export const initialState: blocks.blocksState = getDefault();

function getDefault() {
  return  {
    years: {} as blocks.years,
    yearsLoading: [] as number[],
    editing: DEFAULTS.BLOCKS_EDITING,
    activeBlockId: ''
  };
}
 
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
  on(blockActions.updateWeek, (state, { yearNum, week }) => {
    let years = {...state.years};
    const year = cloneDeep(years[yearNum]);
    year[week.num] = {...week};
    years[yearNum] = year;
    return {
      ...state,
      years
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
