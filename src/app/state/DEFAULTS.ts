import { add } from 'date-fns';
import * as app from 'src/app/models/app.model';
import * as blocks from 'src/app/models/blocks.model';
import * as dth from 'src/app/helpers/datetime.helpers';
import * as bh from 'src/app/helpers/blocks.helpers';

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

export function GENERATE_YEAR(yearNum: number): blocks.year {
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
    // Set flags used by our app.
    bh.setFlags(year[i+1]);
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