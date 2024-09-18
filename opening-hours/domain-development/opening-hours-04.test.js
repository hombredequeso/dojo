// what if we open on Saturday, close on Sunday?
// Hence cross over the end of week -> start of week boundary?
// The previous algorithm couldn't deal with this because it only
// included the idea of an ordering of days through the week: Sun, Mon, ... Sat.
// It did not include the idea that Sun comes after Sat.

const weeklyOpeningHours = [
  {
    open: {
      day: 'Tuesday',
      time: '9:00',
    },
    close: {
      day: 'Tuesday',
      time: '17:00'
    }
  },
  {
    open: {
      day: 'Thursday',
      time: '9:00',
    },
    close: {
      day: 'Monday',
      time: '13:00'
    }
  }
];

const parseInt10 = (str) => parseInt(str, 10);

const toMinuteHours = (hourMinuteStr) => {
  const hm = hourMinuteStr.split(':').map(parseInt10)
  return hm[0]*60 + hm[1];
}

const orderedDaysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const dayNumber = (day) => orderedDaysOfWeek.findIndex(d => d === day);

// Key function:
// there are 6 possible situations to cover:
//
// open and close on same day
// open then close on a subsequent day, and dayTime is on the opening day.
// open then close on a subsequent day, and dayTime is on the closing day.
// AND
// dayTime is on neither open or close day, but in between them.
// AND
// day is after open day, and open/close days cross over end-of-week-boundary
// day is before close day, and open/close days cross over end-of-week-boundary

const isOpenOn = (openingHours, dayTime) => 
  (dayTime.day === openingHours.open.day && dayTime.day === openingHours.close.day &&
  toMinuteHours(dayTime.time) >= toMinuteHours(openingHours.open.time) &&
  toMinuteHours(dayTime.time) < toMinuteHours(openingHours.close.time) ) 
  ||
  (dayTime.day === openingHours.open.day && openingHours.open.day !== openingHours.close.day &&
  toMinuteHours(dayTime.time) >= toMinuteHours(openingHours.open.time) )
  ||
  (dayTime.day === openingHours.close.day && openingHours.open.day !== openingHours.close.day &&
  toMinuteHours(dayTime.time) < toMinuteHours(openingHours.close.time) )
  ||
  (
    dayNumber(dayTime.day) > dayNumber(openingHours.open.day) &&
    dayNumber(dayTime.day) < dayNumber(openingHours.close.day)
  ) 
  ||
  (
    dayNumber(dayTime.day) > dayNumber(openingHours.open.day) &&
    dayNumber(openingHours.open.day) > dayNumber(openingHours.close.day)
  ) 
  ||
  (
    dayNumber(dayTime.day) < dayNumber(openingHours.close.day) &&
    dayNumber(openingHours.open.day) > dayNumber(openingHours.close.day)
  );

const isOpen = (weeklyOpeningHours, dayTime) =>
  weeklyOpeningHours.some(openingHours => isOpenOn(openingHours, dayTime));


describe('isOpen', () => {
  test.each([
    [{ day: 'Tuesday',  time: '5:00'}, false],
    [{ day: 'Tuesday',  time: '13:00'}, true],
    [{ day: 'Tuesday',  time: '23:00'}, false],
    [{ day: 'Wednesday',  time: '10:00'}, false],
    [{ day: 'Thursday',  time: '8:00'}, false],
    [{ day: 'Thursday',  time: '10:00'}, true],
    [{ day: 'Friday',  time: '10:00'}, true],
    [{ day: 'Saturday',  time: '10:00'}, true],
    [{ day: 'Sunday',  time: '10:00'}, true],
    [{ day: 'Monday',  time: '9:00'}, true],
    [{ day: 'Monday',  time: '18:00'}, false]

  ])('%#. isOpen %p = %p', (testTime, isOpenResult) => {
    expect(isOpen(weeklyOpeningHours, testTime)).toEqual(isOpenResult);
  })
})

// What if, reflecting on the increasing complexity it is possible to discover a more comprehensive, simpler
// way of expressing the problem.
// Note that the complexity is two fold:
//   * increasing combinations in the isOpenOn function, making it harder to reason about, and harder to know all possible scenarios are covered.
//   * increasing concepts in moving through, e.g. introducing the < and > operator for days (i.e. know the order of days).

// Both of these types of complexity are manifestations of the same underlying problem,
// that each successive variation of the problem introduced crossing open/close times over a different boundary.
// 02: over a day -> next day boundary
// 03: over a day -> more than one day later boundary
// 04: over a boundary between the end to the start of the week.

// A further question to consider is the range of related problems that this solution can easily solve.
// For instance, what if the next problem we want to solve is, what is the next opening time of the shop?
