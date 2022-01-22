
import { add, set } from 'date-fns';
import * as Blocks from 'src/app/models/blocks.model';
import * as cry from '../helpers/cryptography.helpers';
import * as dh from '../helpers/date.helpers';
import * as Settings from '../models/settings.model';

// Week
function generateWeekBlockArray(): Blocks.week[] {
  let weekBlocks = [] as Blocks.week[];
  const firstWeek = dh.getFirstWeekOfThisYear();
  for (let i = 0; i < 52; i++) {
      weekBlocks.push({
          id: cry.genUid(),
          date: add(firstWeek, { weeks: i}),
          blockNo: i + 1,
          journalEntry: '',
          contextText: ''
      });
  }
  return weekBlocks;
}
export const WEEKS: Blocks.week[] = generateWeekBlockArray();
WEEKS[0].journalEntry = 'This week I worked on my apps for Counter Culture and this. I got back into meditation. I started working harder. I hung out with Moneeb and Mamu\'s family. I felt better from sickness. Played lots of league.';
WEEKS[0].contextText = 'side-project,cousins,league';
  
// Day
// There are 6 * 24hours = 144 blocks/day max.
// & each block is 10 minutes-long.
function generateDayBlockArray(): Blocks.day[] {
  let dayBlocks = [] as Blocks.day[];
  const startTime = set(new Date(Date.now()), {hours: 0, minutes: 0, seconds: 0} );
  dayBlocks.push({
    id: cry.genUid(),
    date: startTime,
    blockNo: 1,
    journalEntry: null,
    contextText: null
  });
  for (let i = 1; i < 144; i++) {
      dayBlocks.push({
        id: cry.genUid(),
        date: add(startTime, { minutes: i * 10}),
        blockNo: i + 1,
        journalEntry: null,
        contextText: null
      });
  }
  return dayBlocks;
}
export const DAYS = generateDayBlockArray();

// Config
export const SETTINGS: Settings.base = {
  day: {
    startHours: 8,
    startMinutes: 0
  }
};