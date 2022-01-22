import { format, add, sub } from 'date-fns';
import * as settings from '../models/settings.model';

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

export function datesDaysMonthsYearsMatch(date1: Date, date2: Date) {
    return format(date1, 'MM/dd/yyyy') === format(date2, 'MM/dd/yyyy');
}

export function getYearsInTimeWindow(startYear: number, totalYears: number): number[] {
    const targetYear = startYear + totalYears;
    let years = [];
    startYear = startYear || 1990;  
    while ( startYear < targetYear ) {
        years.push(startYear++);
    }   
    return years;
}

export function hoursMinutesNumToClockStr(hours: number, minutes: number): string {
    let clockStr = '';
    if (hours < 10) {
        clockStr += '0' + hours.toString();
    } else {
        clockStr += hours.toString();
    }
    clockStr += ':';
    if (minutes < 10) {
        clockStr += '0' + minutes.toString();
    } else {
        clockStr += minutes.toString();
    }
    return clockStr;
}

export function reverseHoursMinutesStartToNum(hoursMinutesStr: string): settings.day {
    const startHours = parseInt(hoursMinutesStr.split(':')[0]);
    const startMinutes = parseInt(hoursMinutesStr.split(':')[1]);
    return { startHours, startMinutes };
}