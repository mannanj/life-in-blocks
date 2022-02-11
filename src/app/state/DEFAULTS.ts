
import { add, set } from 'date-fns';
import * as blocks from 'src/app/models/blocks.model';
import * as cry from '../helpers/cryptography.helpers';
import * as dth from '../helpers/datetime.helpers';
import * as settings from '../models/settings.model';


export function WEEKS(year: number): blocks.week[] {
  let weeks = [] as blocks.week[];
  const firstWeek = dth.getFirstWeekByYear(year);
  for (let i = 0; i < 52; i++) {
    weeks.push({
          id: cry.genUid(),
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

export function WEEKS_BY_YEAR(): blocks.weeksByYear {
  const years: number[] = dth.getYearsInRange(1990, 90);
  let weeksMap = {} as blocks.weeksByYear;
  years.forEach(year => {
    weeksMap[year] = WEEKS(year);
  });
  return weeksMap;
}

// Config
export const SETTINGS: settings.base = {
  day: {
    startHours: 8,
    startMinutes: 0
  }
};

export const zoomLevel = 4.50;

export const isLoading = true;