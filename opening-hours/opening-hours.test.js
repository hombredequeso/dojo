import {add, diff, isBetween} from './modulo-maths.test'

const minutesInDay = 24 * 60
const minutesInWeek = 7 * minutesInDay;

// Conversion of InputOpeningHours into ModuloOpeningHours

const parseInt10 = (str) => parseInt(str, 10);

const getMinuteHour = (hourMinuteStr) => {
  const hm = hourMinuteStr.split(':').map(parseInt10)
  return hm[0]*60 + hm[1];
}

const dateTimeToModulo = (dateTime) => {
  const dt = new Date(dateTime);
  return dt.getUTCDay() * minutesInDay + dt.getUTCHours() * 60 + dt.getUTCMinutes();
}

const toModulo = (day, time) => (day * minutesInDay) + getMinuteHour(time);

const openCloseToModulo = (openClose) => 
  [toModulo(openClose.open.day, openClose.open.time),
   toModulo(openClose.close.day, openClose.close.time)];


const toSingleDay = (openingHour) => {
  if ('days' in openingHour) {
    return  openingHour.days
      .map(d => ({
        open:{day:d, time: openingHour.open},
        close:{day:d, time: openingHour.close},
      }))
    }
  if ('open' in openingHour) {
    return [openingHour];
  }
  return [];
}

// const openingHoursToModulo = (openingHours) => {
//   const perDayOpeningHours = toSingleDay(openingHours);
//   return perDayOpeningHours.map(openCloseToModulo);
// }


// Domain functions using InputOpeningHours

const isOpen = (openingHours) => (dateTime) => {
  const moduloDateTime = dateTimeToModulo(dateTime);

  const singleDayOpeningHours = openingHours.flatMap(toSingleDay);
  const moduloOpeningHours = singleDayOpeningHours.map(openCloseToModulo);

  const result = moduloOpeningHours.some(hrs => isBetween(minutesInWeek)(hrs[0], hrs[1])(moduloDateTime))
  return result;
}

const reducer = (value) => (prev,current, index) => {
  if (prev == null) {
    const difference = diff(minutesInWeek)(current[0], value);
    return [current, difference, index];
  }

  const d = diff(minutesInWeek)(current[0], value);
  if (d < prev[1]) {
    return [current, d, index]
  }

  return prev;
};

// Returns: [[moduloOpen, moduloClose], minutesToNextOpen, indexOfNextOpen]
const getMinDistance = (ranges) => (value) => ranges.reduce(reducer(value), null);

// Returns [InputOpeningHours, minutesToNextOpen]
const getNextOpeningTime  = (openingHours) => (dateTime) => {
  const moduloDateTime = dateTimeToModulo(dateTime);

  const singleDayOpeningHours = openingHours.flatMap(toSingleDay);
  const moduloOpeningHours = singleDayOpeningHours.map(openCloseToModulo);

  const result = getMinDistance(moduloOpeningHours)(moduloDateTime)

  return result === null ? null : [singleDayOpeningHours[result[2]], result[1]];
}


describe('dateTimeToModulo', () => {
  test.each([
    ['Sun Midnight -> 0', new Date('2023-06-25T00:00:00.000Z'), 0],
    ['Sun one minute after midnight -> 1', new Date('2023-06-25T00:01:00.000Z'), 1],
    ['Mon midnight -> 24*60', new Date('2023-06-26T00:00:00.000Z'), 24*60],
    ['Sat one minute to midnight -> 7*24*60 -1', new Date('2023-06-17T23:59:00.000Z'), (7*24*60) -1]
  ])('%s', (_testname, dateTime, expectedResult) => {
    expect(dateTimeToModulo(dateTime)).toEqual(expectedResult);
  })
})


describe('openCloseToModulo', () => {
  test.each([
  ['Sunday all day', {open:{day:0, time: '0:00'}, close: {day:1, time: '0:00'}}, [0, 24*60]],
  ['Monday part of day', {open:{day:1, time: '8:00'}, close: {day:1, time: '9:00'}}, [32*60, 33*60]],
  ['Overnight', {open:{day:0, time: '23:00'}, close:{day:1, time: '1:00'} }, [23*60, 25*60]],
  ['Over end-of-week', {open:{day:6, time: '23:00'}, close:{day:0, time: '1:00'}}, [(7*24*60) - 60, 60]]
  ])('%s', (_testname, openClose, moduloOpenClose) => {
    expect(openCloseToModulo(openClose)).toEqual(moduloOpenClose);
  })
})


// describe('openingHoursToModulo', () => {
//   it('returns [] if no opening hours', () => {
//     expect(openingHoursToModulo({days:[], open: '8:00', close: '16:00'})).toEqual([]);
//   }),
//   it('returns [open, close] if one open day', () => {
//     expect(openingHoursToModulo({days:[0], open: '8:00', close: '16:00'})).toEqual([[480, 960]]);
//   }),
//   it('returns both open hours if open two days', () => {
//     expect(openingHoursToModulo({days:[0, 1], open: '8:00', close: '16:00'}))
//       .toEqual([
//         [480, 960],
//         [1920, 2400]
//       ]);
//   }),
//   it('returns ** if other sort', () => {
//     expect(
//       openingHoursToModulo({open:{day:0, time: '0:00'}, close: {day:1, time: '0:00'}}))
//       .toEqual([[0, 24*60]]);
//   })
// })




describe('isOpen', () => {
  test.each([
    [
      'never open returns false',
      [], '2023-06-27T10:12:23.198Z', false
    ],
    [
      'when not open returns false',
      [
        {
          days: [0],
          open: '8:00',
          close: '16:00'
        }
      ],
      '2023-06-27T11:00:00.000Z',
      false
    ],
    [
      'when open returns true',
      [
        {
          days: [2],
          open: '8:00',
          close: '16:00'
        }
      ],
      '2023-06-27T11:00:00.000Z',
      true
    ],
    [
      'when open returns true',
      [
        {
          open:{day:0, time: '0:00'}, 
          close: {day:1, time: '0:00'}
        }
      ],
      '2023-06-25T11:00:00.000Z',
      true
    ],
    [
      'when open with crossover before midnight returns true',
      [
        {
          open:{day:2, time: '9:00'}, 
          close: {day:3, time: '9:00'}
        }
      ],
      '2023-06-27T11:10:00.000Z',
      true
    ],
    [
      'when open with crossover after midnight returns true',
      [
        {
          open:{day:2, time: '9:00'}, 
          close: {day:3, time: '21:00'}
        }
      ],
      '2023-06-28T11:00:00.000Z',
      true
    ],
    [
      'when open with crossover across Sat-Sun returns true',
      [
        {
          open:{day:6, time: '21:00'}, 
          close: {day:0, time: '09:00'}
        }
      ],
      '2023-06-24T22:00:00.000Z',
      true
    ],
    [
      'when open with crossover across Sat-Sun returns true',
      [
        {
          open:{day:6, time: '21:00'}, 
          close: {day:0, time: '09:00'}
        }
      ],
      '2023-06-25T08:00:00.000Z',
      true
    ],
  ])('%s', (_testName, openingHours, dateTime, expectedResult) => {
    expect(isOpen(openingHours)(dateTime)).toEqual(expectedResult);
  })
})



describe('getMinDistance', () => {
  test.each([
    ['no opening hours returns null', [], 0, null],
    ['one opening hours return that one, current time before', [[10,20]], 0, [[10,20], 10, 0]],
    ['one opening hours return that one, current time at', [[10,20]], 10, [[10,20], 0, 0]],
    ['one opening hours return that one, current time during', [[10,20]], 15, [[10,20], 10075, 0]],
    ['one opening hours return that one, current time after', [[10,20]], 25, [[10,20], 10065, 0]],
    ['two opening hours return correct one 1', [[10,20], [30,40]], 25, [[30,40], 5, 1]],
    ['two opening hours return correct one 2', [[10,20], [30,40]], 10, [[10,20], 0, 0]],
    ['two opening hours return correct one 3', [[10,20], [30,40]], 31, [[10,20], 10059, 0]],
  ])
  ('%s', (_testName, openingHours, dateTime, expectedResult) => {
    expect(getMinDistance(openingHours)(dateTime)).toEqual(expectedResult);
  });
})


describe('getNextOpeningTime', () => {
  test.each([
    [
      'never open returns null',
      [], '2023-06-27T10:12:23.198Z', null // Tuesday
    ],
    [
      'when not open returns false',
      [
        {
          days: [0],
          open: '8:00',
          close: '16:00'
        }
      ],
      '2023-06-25T00:00:00.000Z',
      [
        {
          open:{day:0, time: '8:00'},
          close:{day:0, time: '16:00'}
        },
        480
      ]
    ],
    
    [
      'at opening time returns 0',
      [
        {
          days: [0],
          open: '8:00',
          close: '16:00'
        }
      ],
      '2023-06-25T08:00:00.000Z',
      [
        {
          open:{day:0, time: '8:00'},
          close:{day:0, time: '16:00'}
        },
        0
      ]
    ],
    [
      'at one minute after opening time returns 10080-1',
      [
        {
          open:{day:0, time: '8:00'},
          close:{day:0, time: '16:00'}
        },
      ],
      '2023-06-25T08:01:00.000Z',
      [
        {
          open:{day:0, time: '8:00'},
          close:{day:0, time: '16:00'}
        },
       10080-1 
      ]
    ],
    [
      'when open returns true',
      [
        {
          days: [0],
          open: '8:00',
          close: '16:00'
        }
      ],
      '2023-06-25T09:00:01.000Z',
      [
        {
          open:{day:0, time: '8:00'},
          close:{day:0, time: '16:00'}
        },
        10020
      ]
    ],
    [
      'returns correct amount when flipping to next day',
      [
        {
          days: [0,1],
          open: '8:00',
          close: '16:00'
        }
      ],
      '2023-06-25T17:00:00.000Z',
      [
        {
          open:{day:1, time: '8:00'},
          close:{day:1, time: '16:00'}
        },
        15*60
      ]
    ],
    [
      'returns correct amount when wrapping to next week',
      [
        {
          days: [0,1],
          open: '8:00',
          close: '16:00'
        }
      ],
      '2023-06-26T17:00:00.000Z',
      [
        {
          open:{day:0, time: '8:00'},
          close:{day:0, time: '16:00'}
        },
        10080 - (60*(17+16))
      ]
    ],
  ])('%s', (_testName, openingHours, dateTime, expectedResult) => {
    expect(getNextOpeningTime(openingHours)(dateTime)).toEqual(expectedResult);
  })
})