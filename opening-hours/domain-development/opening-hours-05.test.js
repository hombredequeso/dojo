// The problem with earlier solutions is that they solve the problem of boundary-crossing bewteen different
// open/close times in an ad-hoc manner.
// Technically speaking, we end up with a function that returns the correct value, however,
// each boundary crossing caused changes to the key, most complex function in the solution.
//
// The key is to note the following:
// * There are actually 60 * 24 * 7 = 10080 distinct times in the week that the shop can open or close.
// * When the time is thought of as the integers 0, 1, ... , 10079, there is merely numbers
//   representing a successing of minutes through the week. In this representation, there are no hours,
//   or days. Such boundaries are removed.
// * the weekly-minutes (0 - 10079) wrap around. Put another way, 10080 = 0.

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

const orderedDaysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const parseInt10 = (str) => parseInt(str, 10);

const minutesInDay = 24 * 60
const minutesInWeek = 7 * minutesInDay; // 10080

const toMinuteHours = (hourMinuteStr) => {
  const hm = hourMinuteStr.split(':').map(parseInt10)
  return hm[0]*60 + hm[1];
}

const toWeeklyMinutes = (dayTime) =>
(orderedDaysOfWeek.findIndex(d => d == dayTime.day) * 7*24*60)
+ toMinuteHours(dayTime.time);


const isBetween = (modulo)=>(a,b) => (x) => 
  (a<=b)? (x < b && x >= a): 
    (x >= a || x < b)


const isOpenOn = (openingHours, dayTime) => {
  // Convert all day/times into weeklyMinute amounts (0 -> 10079)
  const dayTimeWeeklyMinutes = toWeeklyMinutes(dayTime);
  const openWeeklyMinutes = toWeeklyMinutes(openingHours.open);
  const closeWeeklyMinutes = toWeeklyMinutes(openingHours.close);

  return isBetween (minutesInWeek)(openWeeklyMinutes, closeWeeklyMinutes)(dayTimeWeeklyMinutes);
}
  // What concepts exist once the problem is converted into 'weeklyMinutes' space?
  //    1. The number of minutes (60*24*7)
  //    2. That they 'wrap' (i.e. 10080 === 0)

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
