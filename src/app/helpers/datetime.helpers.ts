import { format, add, sub, set } from 'date-fns';
import * as blocks from 'src/app/models/blocks.model';
import { range } from 'lodash';
import * as DEFAULTS from 'src/app/state/DEFAULTS';

export function getUserYears(dobYear: number): number[] {
    return range(dobYear, dobYear + DEFAULTS.MAX_AGE);
}

export function getFirstWeekByYear(year: number) {
    const firstDayOfYear = new Date(year, 0, 1);
    if (format(firstDayOfYear, 'E') === 'Mon') {
        return firstDayOfYear;
    }
    let nextDay = add(firstDayOfYear, { days: 1});
    while (format(nextDay, 'E') !== 'Mon') {
        nextDay = add(nextDay, {days: 1});
    }
    return nextDay;
}

// Get the active week
export function getMondayForWeek(targetDate = new Date()): Date {
    if (format(targetDate, 'E') === 'Mon') {
        return targetDate;
    }
    // get monday date for this week
    let priorDay = sub(targetDate, { days: 1});
    while (format(priorDay, 'E') !== 'Mon') {
        priorDay = sub(priorDay, {days: 1});
    }
    return set(priorDay, { hours: 0, minutes: 0, seconds:  0, milliseconds: 0});
}

export function matchDayMonthYear(date1: Date, date2: Date) {
    return format(date1, 'MM/dd/yyyy') === format(date2, 'MM/dd/yyyy');
}

function getDaysElapsed(today: Date): number {
    // Week progress
    let daysElapsed = 0;
    switch(format(today, 'E')) { 
        case 'Mon': {
        daysElapsed = 0;
        break; 
        }
        case 'Tue': {
        daysElapsed = 1;
        break; 
        }
        case 'Wed': {
        daysElapsed = 2;
        break; 
        }
        case 'Thu': {
        daysElapsed = 3;
        break; 
        }
        case 'Fri': {
        daysElapsed = 4;
        break; 
        }
        case 'Sat': {
        daysElapsed = 5;
        break; 
        }
        case 'Sun': {
        daysElapsed = 6;
        break; 
        }
        default: { 
        daysElapsed = 0;
        break; 
        }
    }
    return daysElapsed;
}

function getDaySecondsElapsed(today: Date): number {
    const hour = parseInt(format(today, 'H'));
    const minute = parseInt(format(today, 'm'));
    const seconds = parseInt(format(today, 's'));
    const daySecondsElapsed = hour * 60 * 60 + minute * 60 + seconds;
    return daySecondsElapsed;
}

export function getWeekProgress(week: blocks.week, today: Date) {
    const daysElapsed = getDaysElapsed(today);
    const daySecondsElapsed = getDaySecondsElapsed(today);
    return (86400 * daysElapsed + daySecondsElapsed) / (86400 * 7);
}