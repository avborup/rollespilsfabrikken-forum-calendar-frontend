import { weekDayNames, monthNames } from '@/constants';

export function now() {
  return new Date();
}

export function today() {
  const rightNow = now();

  const year = rightNow.getFullYear();
  const month = rightNow.getMonth();
  const date = rightNow.getDate();

  return new Date(year, month, date);
}

export function daysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

export function monthJump(oldDate, amount, dir = 1) {
  const numYears = Math.floor(amount / 12);
  const numMonths = amount % 12;

  const newDate = new Date(oldDate.getTime());

  newDate.setFullYear(numYears * dir + oldDate.getFullYear());
  newDate.setMonth(numMonths * dir + oldDate.getMonth());

  return newDate;
}

// Returns 0-indexed day of the week, Monday-Sunday
export function getWeekday(...args) {
  // FIXME: Why does the date go one month back by default?
  const date = monthJump(new Date(args), 1);
  let weekDay = date.getDay() - 1;

  if (weekDay === -1) {
    weekDay = 6;
  }

  return weekDay;
}

export function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

export function dateRangesOverlap(aStart, aEnd, bStart, bEnd) {
  const a = {
    start: aStart.getTime(),
    end: aEnd.getTime(),
  };
  const b = {
    start: bStart.getTime(),
    end: bEnd.getTime(),
  };

  const overlaps = (a.start <= b.start && b.start <= a.end) // b starts in a
    || (a.start <= b.end && b.end <= a.end) // b ends in a
    || (a.start > b.start && b.end > a.end); // a is inside b

  return overlaps;
}

export function toDoubleDigitHrMinStr(hrs, mins) {
  return `${hrs >= 10 ? '' : '0'}${hrs}:${mins >= 10 ? '' : '0'}${mins}`;
}

export function toFormattedString(date) {
  const weekdayIndex = getWeekday(date.getFullYear(), date.getMonth(), date.getDate());
  const weekday = weekDayNames[weekdayIndex];
  const year = date.getFullYear();
  const month = monthNames[date.getMonth()].toLowerCase().substring(0, 3);
  const dayDate = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  return `${weekday} ${dayDate}. ${month} ${year} kl. ${toDoubleDigitHrMinStr(hour, minute)}`;
}

export function toElapsedTimeStr(date) {
  const nowStamp = now();

  const msDiff = nowStamp.getTime() - date.getTime();
  if (msDiff < 0) {
    return 'Fra fremtiden..';
  }

  const secDiff = msDiff / 1000;
  if (secDiff < 60) {
    return `${Math.floor(secDiff)} sekund${secDiff >= 2 ? 'er' : ''}`;
  }

  const minDiff = secDiff / 60;
  if (minDiff < 60) {
    return `${Math.floor(minDiff)} minut${minDiff >= 2 ? 'ter' : ''}`;
  }

  const hrDiff = minDiff / 60;
  if (hrDiff < 24) {
    return `${Math.floor(hrDiff)} time${hrDiff >= 2 ? 'r' : ''}`;
  }

  const dayDiff = hrDiff / 24;
  if (dayDiff < 31) {
    return `${Math.floor(dayDiff)} dag${dayDiff >= 2 ? 'e' : ''}`;
  }

  const monthDiff = nowStamp.getMonth() - date.getMonth();
  if (dayDiff < 365) {
    return `${Math.floor(monthDiff)} måned${monthDiff >= 2 ? 'er' : ''}`;
  }

  const yearDiff = nowStamp.getFullYear() - date.getFullYear();
  return `${Math.floor(yearDiff)} år`;
}

export function simpleStringFormat(date) {
  return `${date.getDate()}/${date.getMonth() + 1}-${date.getFullYear()}`;
}
