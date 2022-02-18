
import { add, compareAsc, format, set } from 'date-fns';
import * as app from 'src/app/models/app.model';
import * as blocks from 'src/app/models/blocks.model';
import * as cry from '../helpers/cryptography.helpers';
import * as dth from '../helpers/datetime.helpers';

export const ZOOM_LEVEL = 3.50;
export const isLoading = true;
export const isEditing = false;
export const NEW_USER = 'NEW_USER';

export function YEAR_HAS_DATA(): {[key: number]: boolean} {
  return {2022: true};
}

// Blocks data
export function WEEKS(year: number): blocks.week[] {
  let weeks = [] as blocks.week[];
  const firstWeek = dth.getFirstWeekByYear(year);
  for (let i = 0; i < 52; i++) {
    weeks.push({
          id: cry.genUid(),
          user: NEW_USER,
          date: add(firstWeek, { weeks: i}),
          num: i + 1,
          entries: [] as blocks.entry[],
      });
  }
  // @TODO: Temp first data.
  if (year === 2022) {
    weeks[0].entries = [
      { text: 'CounterCulture App development', created: new Date(2022, 0, 5, 15, 0, 0, 0), edited: new Date(2022, 0, 5, 15, 0, 0, 0)},
      { text: 'Meditation 20-60min', created: new Date(2022, 0, 5, 15, 0, 0, 0), edited: new Date(2022, 0, 5, 15, 0, 0, 0)},
      { text: 'Working Harder', created: new Date(2022, 0, 7, 15, 0, 0, 0), edited: new Date(2022, 0, 5, 15, 0, 0, 0)},
      { text: 'Moneeb and Mamu Family Hangout', created: new Date(2022, 0, 7, 15, 0, 0, 0), edited: new Date(2022, 0, 5, 15, 0, 0, 0)},
      { text: 'Sick Recovery (COVID)', created: new Date(2022, 0, 8, 15, 0, 0, 0), edited: new Date(2022, 0, 5, 15, 0, 0, 0)},
      { text: 'League of Legends', created: new Date(2022, 0, 8, 15, 0, 0, 0), edited: new Date(2022, 0, 5, 15, 0, 0, 0)},
    ];
  }
  return weeks;
}
export function GET_WEEKS_BY_YEAR(): blocks.weeksByYear {
  const years = dth.getUserYears();
  let weeksMap = {} as blocks.weeksByYear;
  years.forEach(year => {
    weeksMap[year] = WEEKS(year);
  });
  // massage it a little bit.
  const thisWeek = dth.getStartOfWeek();
  years.forEach(year => {
    weeksMap[year] = weeksMap[year].map(week => {
      if (format(thisWeek, 'MM/dd/yyyy') === format(week.date, 'MM/dd/yyyy')) {
        week.isNow = true;
      } else if (compareAsc(thisWeek, week.date) === 1) {
        week.isInPast = true;
      }
      // set flags used by our app
      const today = new Date(Date.now()); 
      week?.isNow ? week.progress = (1 - dth.getWeekProgress(week, today)) : null;
      return {...week};
    });
  });
  return weeksMap;
}

export const WEEKS_BY_YEAR = GET_WEEKS_BY_YEAR();

// Settings
export const SETTINGS: app.settings  = {
  id: '',
  user: NEW_USER,
  yearHasData: YEAR_HAS_DATA(),
  currentYearOfData: WEEKS_BY_YEAR[2022],
  zoom: { zoomLevel: ZOOM_LEVEL },
};