import { createReducer, on } from '@ngrx/store';
import * as blocks from '../models/blocks.model';
import * as blockActions from './blocks.actions';
import * as dth from 'src/app/helpers/datetime.helpers';
import * as DEFAULTS from './DEFAULTS';
import { compareAsc, format } from 'date-fns';

export interface blocksState {
  weeksByYear: blocks.weeksByYear;
  zoom: blocks.zoom;
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
  })
);

function getDefault() {
  const years = Object.keys(DEFAULTS.WEEKS_BY_YEAR());
  let weeksByYear = {} as blocks.weeksByYear;
  // Set flags
  const thisWeek = dth.getStartOfWeek();
  years.forEach(year => {
    weeksByYear[parseInt(year)] = DEFAULTS.WEEKS_BY_YEAR()[parseInt(year)].map(week => {
      if (format(thisWeek, 'MM/dd/yyyy') === format(week.date, 'MM/dd/yyyy')) {
        week.isNow = true;
      } else if (compareAsc(thisWeek, week.date) === 1) {
        week.isInPast = true;
      }      
      return {...week};
    });
  });
  return  {
    weeksByYear,
    zoom: { zoomLevel: 4.50 }
  };
}