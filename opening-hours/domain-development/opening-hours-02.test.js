// Open and Close on different days.

// The previous structure could not represent this, so it is necessary to use a different
// opening and closing structure, capable of different open/close days.

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
      day: 'Friday',
      time: '9:00',
    },
    close: {
      day: 'Saturday',
      time: '13:00'
    }
  }
];


const parseInt10 = (str) => parseInt(str, 10);

const toMinuteHours = (hourMinuteStr) => {
  const hm = hourMinuteStr.split(':').map(parseInt10)
  return hm[0]*60 + hm[1];
}


// The key function
// Because the openingHours structure has changed, the key function has to be basically rewritten.
// 
// There are 3 different situations to cover:
//
// open and close on same day
// AND 
// open then close on the next day, and dayTime is on the opening day.
// open then close on the next day, and dayTime is on the closing day.

const isOpenOn = (openingHours, dayTime) => 
  (dayTime.day === openingHours.open.day && dayTime.day === openingHours.close.day &&
  toMinuteHours(dayTime.time) >= toMinuteHours(openingHours.open.time) &&
  toMinuteHours(dayTime.time) < toMinuteHours(openingHours.close.time) ) 
  ||
  (dayTime.day === openingHours.open.day && openingHours.open.day !== openingHours.close.day &&
  toMinuteHours(dayTime.time) >= toMinuteHours(openingHours.open.time) ) 
  ||
  (dayTime.day === openingHours.close.day  && openingHours.open.day !== openingHours.close.day &&
  toMinuteHours(dayTime.time) < toMinuteHours(openingHours.close.time) );


const isOpen = (weeklyOpeningHours, dayTime) =>
  weeklyOpeningHours.some(openingHours => isOpenOn(openingHours, dayTime));


describe('isOpen', () => {
  test.each([
    [{ day: 'Tuesday',  time: '5:00'}, false],
    [{ day: 'Tuesday',  time: '13:00'}, true],
    [{ day: 'Tuesday',  time: '23:00'}, false],
    [{ day: 'Wednesday',  time: '10:00'}, false],
    [{ day: 'Friday',  time: '8:00'}, false],
    [{ day: 'Friday',  time: '10:00'}, true],
    [{ day: 'Saturday',  time: '10:00'}, true],
    [{ day: 'Saturday',  time: '17:00'}, false],

  ])('%#. isOpen %p = %p', (testTime, isOpenResult) => {
    expect(isOpen(weeklyOpeningHours, testTime)).toEqual(isOpenResult);
  })
})


// But, what if we open one day, close 2 days later?
// This algorithm will not work, it will claim the shop is closed, when in fact, it is open.
