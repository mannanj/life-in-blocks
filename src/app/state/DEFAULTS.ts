
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
          journal: '',
          summary: ''
      });
  }
  // @TODO: Temp first data.
  if (year === 2022) {
    weeks[0].journal = 'This week I worked on my apps for Counter Culture and this. I got back into meditation. I started working harder. I hung out with Moneeb and Mamu\'s family. I felt better from sickness. Played lots of league.';
    weeks[0].summary = 'side-project,cousins,league';

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