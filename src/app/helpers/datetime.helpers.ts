import { format, add, sub } from 'date-fns';
import * as settings from '../models/settings.model';
import * as blocks from 'src/app/models/blocks.model';



export function getUserYears(): number[] {
    const years: number[] = getYearsInRange(1990, 90);
    return years;
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
export function getStartOfWeek() {
    const dateNow = new Date(Date.now());
    if (format(dateNow, 'E') === 'Mon') {
        return dateNow;
    }
    // get monday date for this week
    let priorDay = sub(dateNow, { days: 1});
    while (format(priorDay, 'E') !== 'Mon') {
        priorDay = sub(priorDay, {days: 1});
    }
    return priorDay;
}

export function matchDayMonthYear(date1: Date, date2: Date) {
    return format(date1, 'MM/dd/yyyy') === format(date2, 'MM/dd/yyyy');
}

export function getYearsInRange(startYear: number, totalYears: number): number[] {
    const targetYear = startYear + totalYears;
    let years = [];
    startYear = startYear || 1990;  
    while ( startYear < targetYear ) {
        years.push(startYear++);
    }   
    return years;
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