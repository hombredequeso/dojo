// Given weekly opening hours for a shop, write a program to calculate whether the shop
// is open or not at any given time.

/* ==============================================================
Making a few assumptions here:
* for the sake of thinking through this problem, we're not particularly
  concerned with details of how we specify things like the day, or open/close time
  It is quite enough to have strings and throw caution to the wind and ignore parsing errors.
* The problem of converting a particular date-time to a day/time in the week is not interesting enough
  to bother with, we'll just start with a day/time in the week.
================================================================*/

// So here is an example of the weekly opening hours to work with:
const weeklyOpeningHours = [
  {
    day:'Tuesday',
    open: '9:00',
    close: '17:00'
  },
  {
    day:'Saturday',
    open: '8:00',
    close: '13:00'
  },
];

const parseInt10 = (str) => parseInt(str, 10);

const toMinuteHours = (hourMinuteStr) => {
  const hm = hourMinuteStr.split(':').map(parseInt10)
  return hm[0]*60 + hm[1];
}

// isOpenOn: The key function.
// is dayTime within openHours
// Check: is it the same day, and the time is between opening and closing times.
const isOpenOn = (openHours, dayTime) => 
  openHours.day === dayTime.day &&
  toMinuteHours(dayTime.time) >= toMinuteHours(openHours.open) &&
  toMinuteHours(dayTime.time) < toMinuteHours(openHours.close);

const isOpen = (openingHours, dayTime) =>
  openingHours.some(openHour => isOpenOn(openHour, dayTime));


describe('isOpen', () => {
  test.each([
    [{ day: 'Tuesday',  time: '5:00'}, false],
    [{ day: 'Tuesday',  time: '13:00'}, true],
    [{ day: 'Tuesday',  time: '23:00'}, false],
    [{ day: 'Wednesday',  time: '10:00'}, false],
    [{ day: 'Saturday',  time: '11:00'}, true]
  ])('%#. isOpen %p = %p', (testTime, isOpenResult) => {
    expect(isOpen(weeklyOpeningHours, testTime)).toEqual(isOpenResult);
  })
})


// But, what if we open one day, and close another?
// The existing weeklyOpeningHours data structure cannot represent this, so it will need to change.
