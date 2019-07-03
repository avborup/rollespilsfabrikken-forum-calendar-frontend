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
