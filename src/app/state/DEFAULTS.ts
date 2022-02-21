import { add, compareAsc, format, set } from 'date-fns';
import { isEqual } from 'lodash';
import * as app from 'src/app/models/app.model';
import * as blocks from 'src/app/models/blocks.model';
import * as cry from '../helpers/cryptography.helpers';
import * as dth from '../helpers/datetime.helpers';

export const NO_USER = 'NO_USER';
export const NO_SETTINGS: app.settings  = {
  id: '',
  user: NO_USER,
  dob: new Date(),
  zoom: 3.50,
  hasEntriesForYears: [] as number[],
};
export const APP_IS_STARTING = false;
export const APP_IS_LOADING = false;
export const BLOCKS_LOADING = false;
export const BLOCKS_EDITING = false;

export function WEEKS_FOR_YEAR(yearNum: number): blocks.year {
  let year = {} as blocks.year;
  const firstWeek = dth.getFirstWeekByYear(yearNum);
  for (let i = 0; i < 52; i++) {
    year[i+1] = {
      id: '',
      user: NO_USER,
      date: add(firstWeek, { weeks: i}),
      num: i + 1,
      entries: [] as blocks.entry[],
    };
  }
  // Set first week of data for our dummy data.
  if (yearNum === 2022) {
    year[1].entries = [
      { text: 'CounterCulture App development', created: new Date(2022, 0, 5, 15, 0, 0, 0), edited: new Date(2022, 0, 5, 15, 0, 0, 0)},
      { text: 'Meditation 20-60min', created: new Date(2022, 0, 5, 15, 0, 0, 0), edited: new Date(2022, 0, 5, 15, 0, 0, 0)},
      { text: 'Working Harder', created: new Date(2022, 0, 7, 15, 0, 0, 0), edited: new Date(2022, 0, 5, 15, 0, 0, 0)},
      { text: 'Moneeb and Mamu Family Hangout', created: new Date(2022, 0, 7, 15, 0, 0, 0), edited: new Date(2022, 0, 5, 15, 0, 0, 0)},
      { text: 'Sick Recovery (COVID)', created: new Date(2022, 0, 8, 15, 0, 0, 0), edited: new Date(2022, 0, 5, 15, 0, 0, 0)},
      { text: 'League of Legends', created: new Date(2022, 0, 8, 15, 0, 0, 0), edited: new Date(2022, 0, 5, 15, 0, 0, 0)},
    ];
  }
  return year;
}
// export function GET_WEEKS_BY_YEAR(): blocks.years {
//   const years = dth.getUserYears();
//   let weeksMap = {} as blocks.years;
//   years.forEach(year => {
//     weeksMap[year] = WEEKS_FOR_YEAR(year);
//   });
//   // massage it a little bit.
//   const thisWeek = dth.getMondayForWeek(new Date());
//   years.forEach(year => {
//     weeksMap[year] = weeksMap[year].map(week => {
//       if (format(thisWeek, 'MM/dd/yyyy') === format(week.date, 'MM/dd/yyyy')) {
//         week.isNow = true;
//       } else if (compareAsc(thisWeek, week.date) === 1) {
//         week.isInPast = true;
//       }
//       // set flags used by our app
//       const today = new Date(Date.now()); 
//       week?.isNow ? week.progress = (1 - dth.getWeekProgress(week, today)) : null;
//       return {...week};
//     });
//   });
//   return weeksMap;
// }

// export const WEEKS_BY_YEAR = GET_WEEKS_BY_YEAR();

export function NEW_SETTINGS(user: string, year: number): app.settings {
  return {
    id: '',
    user,
    dob: new Date(),
    zoom: 3.5,
    hasEntriesForYears: [year]
  };
}

// export function getFirstBlock(user: string, year: number) {
//   const date = dth.getMondayForWeek(new Date());
//   const weeks = WEEKS_FOR_YEAR(year);
//   console.log('date to find', date);
//   const firstBlock = weeks.find(week => isEqual(week.date, date));
//   console.log('first block!', firstBlock);
//   return {
//     ...firstBlock,
//     user,
//   }
// }