// open one day, close 2 days later?

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
      day: 'Saturday',
      time: '13:00'
    }
  }
];


const orderedDaysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayNumber = (day) => orderedDaysOfWeek.findIndex(d => d === day);

const parseInt10 = (str) => parseInt(str, 10);

const toMinuteHours = (hourMinuteStr) => {
  const hm = hourMinuteStr.split(':').map(parseInt10)
  return hm[0]*60 + hm[1];
}

// Key function:
// there are 4 possible situations to cover:
//
// open and close on same day
// open and close on consecutive days, and day is the opening day.
// open and close on consecutive days, and day is the closing day.
// AND
// day is neither open or close day, but in between them.

// Note that it is necessary to introduce the idea that the days of the week are ordered.
// Looking back, it is possible to see that this idea was explicitly absent from the algorithm.
// The only day related operators required were === and !==, now >= and < are required,
// hence the idea of ordering.

const isOpenOn = (openingHours, dayTime) => 
  (dayTime.day === openingHours.open.day && dayTime.day === openingHours.close.day &&
  toMinuteHours(dayTime.time) >= toMinuteHours(openingHours.open.time) &&
  toMinuteHours(dayTime.time) < toMinuteHours(openingHours.close.time) ) ||

  (dayTime.day === openingHours.open.day && openingHours.open.day !== openingHours.close.day &&
  toMinuteHours(dayTime.time) >= toMinuteHours(openingHours.open.time) ) ||

  (dayTime.day === openingHours.close.day && openingHours.open.day !== openingHours.close.day &&
  toMinuteHours(dayTime.time) < toMinuteHours(openingHours.close.time) ) ||
  
  (
    dayNumber(dayTime.day) > dayNumber(openingHours.open.day) &&
    dayNumber(dayTime.day) < dayNumber(openingHours.close.day)
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
    [{ day: 'Saturday',  time: '17:00'}, false],

  ])('%#. isOpen %p = %p', (testTime, isOpenResult) => {
    expect(isOpen(weeklyOpeningHours, testTime)).toEqual(isOpenResult);
  })
})


// But, what if we open on Saturday, close on Sunday?
// i.e. we open/close across an end-of-week boundary,
//      or put another way, the opening day is after the closing day in the weekly day ordering.