const openingHours = [
  {
    day:'Friday',
    open: '9:00',
    close: '17:00'
  },
  {
    day:'Saturday',
    open: '8:00',
    close: '13:00'
  },
];

const closedTimeToTest = {
  day: 'Tuesday',
  time: '10:00'
}

const openTimeToTest = {
  day: 'Saturday',
  time: '11:00'
}

const parseInt10 = (str) => parseInt(str, 10);

const toMinuteHours = (hourMinuteStr) => {
  const hm = hourMinuteStr.split(':').map(parseInt10)
  return hm[0]*60 + hm[1];
}

const isOpenOn = (openHour, dayTime) => 
  openHour.day === dayTime.day &&
  toMinuteHours(dayTime.time) >= toMinuteHours(openHour.open) &&
  toMinuteHours(dayTime.time) < toMinuteHours(openHour.close);

const isOpen = (openingHours, dayTime) =>
  openingHours.some(openHour => isOpenOn(openHour, dayTime));

describe('isOpen', () => {
  test('returns false if closed', () => {
    expect(isOpen(openingHours, closedTimeToTest)).toEqual(false);
  })

  test('returns true if open', () => {
    expect(isOpen(openingHours, openTimeToTest)).toEqual(true);
  })
})


// What if we open one day, and close another?


const weeklyOpeningHours2 = [
  {
    open: {
      day: 'Thursday',
      time: '9:00',
    },
    close: {
      day: 'Thursday',
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


const isOpenOn2 = (openingHours, dayTime) => 
  (dayTime.day === openingHours.open.day && dayTime.day === openingHours.close.day &&
  toMinuteHours(dayTime.time) >= toMinuteHours(openingHours.open.time) &&
  toMinuteHours(dayTime.time) < toMinuteHours(openingHours.close.time) ) ||

  (dayTime.day === openingHours.open.day &&
  toMinuteHours(dayTime.time) >= toMinuteHours(openingHours.open.time) ) ||

  (dayTime.day === openingHours.close.day &&
  toMinuteHours(dayTime.time) < toMinuteHours(openingHours.close.time) );

const isOpen2 = (weeklyOpeningHours, dayTime) =>
  weeklyOpeningHours.some(openingHours => isOpenOn2(openingHours, dayTime));

describe('isOpen2', () => {
  test('returns false if closed', () => {
    expect(isOpen2(weeklyOpeningHours2, closedTimeToTest)).toEqual(false);
  })

  test('returns true if open', () => {
    expect(isOpen2(weeklyOpeningHours2, {day: 'Saturday', time: '1:00'})).toEqual(true);
  })
})

// what if we open one day, close 2 days later?

const weeklyOpeningHours3 = [
  {
    open: {
      day: 'Wednesday',
      time: '9:00',
    },
    close: {
      day: 'Wednesday',
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


const orderedDaysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesay', 'Thursday', 'Friday', 'Saturday'];

const isOpenOn3 = (openingHours, dayTime) => 
  (dayTime.day === openingHours.open.day && dayTime.day === openingHours.close.day &&
  toMinuteHours(dayTime.time) >= toMinuteHours(openingHours.open.time) &&
  toMinuteHours(dayTime.time) < toMinuteHours(openingHours.close.time) ) ||

  (dayTime.day === openingHours.open.day &&
  toMinuteHours(dayTime.time) >= toMinuteHours(openingHours.open.time) ) ||

  (dayTime.day === openingHours.close.day &&
  toMinuteHours(dayTime.time) < toMinuteHours(openingHours.close.time) ) ||
  
  (
    (orderedDaysOfWeek.findIndex(d => d === dayTime.day) > orderedDaysOfWeek.findIndex(d => d === openingHours.open.day)) &&
    (orderedDaysOfWeek.findIndex(d => d === dayTime.day) < orderedDaysOfWeek.findIndex(d => d === openingHours.close.day)));

const isOpen3 = (weeklyOpeningHours, dayTime) =>
  weeklyOpeningHours.some(openingHours => isOpenOn3(openingHours, dayTime));


describe('isOpen3', () => {
  test('returns false if closed', () => {
    expect(isOpen3(weeklyOpeningHours3, closedTimeToTest)).toEqual(false);
  })

  test('returns true if open', () => {
    expect(isOpen3(weeklyOpeningHours3, {day: 'Friday', time: '1:00'})).toEqual(true);
  })
})


// what if we open on Saturday, close on Sunday?


const weeklyOpeningHours4 = [
  {
    open: {
      day: 'Wednesday',
      time: '9:00',
    },
    close: {
      day: 'Wednesday',
      time: '17:00'
    }
  },
  {
    open: {
      day: 'Saturday',
      time: '9:00',
    },
    close: {
      day: 'Monday',
      time: '13:00'
    }
  }
];


const isOpenOn4 = (openingHours, dayTime) => 
  (dayTime.day === openingHours.open.day && dayTime.day === openingHours.close.day &&
  toMinuteHours(dayTime.time) >= toMinuteHours(openingHours.open.time) &&
  toMinuteHours(dayTime.time) < toMinuteHours(openingHours.close.time) ) ||

  (dayTime.day === openingHours.open.day &&
  toMinuteHours(dayTime.time) >= toMinuteHours(openingHours.open.time) ) ||

  (dayTime.day === openingHours.close.day &&
  toMinuteHours(dayTime.time) < toMinuteHours(openingHours.close.time) ) ||
  
  (
    (orderedDaysOfWeek.findIndex(d => d === dayTime.day) > 
     orderedDaysOfWeek.findIndex(d => d === openingHours.open.day)) &&
    (orderedDaysOfWeek.findIndex(d => d === dayTime.day) < 
     orderedDaysOfWeek.findIndex(d => d === openingHours.close.day))
  ) ||
  
  (
    (orderedDaysOfWeek.findIndex(d => d === openingHours.open.day) >
    orderedDaysOfWeek.findIndex(d => d === openingHours.close.day)) &&
    (orderedDaysOfWeek.findIndex(d => d === dayTime.day) > 
     orderedDaysOfWeek.findIndex(d => d === openingHours.open.day))
  ) ||
  (
    (orderedDaysOfWeek.findIndex(d => d === openingHours.open.day) >
    orderedDaysOfWeek.findIndex(d => d === openingHours.close.day)) &&
    (orderedDaysOfWeek.findIndex(d => d === dayTime.day) < 
     orderedDaysOfWeek.findIndex(d => d === openingHours.close.day))
  );



const isOpen4 = (weeklyOpeningHours, dayTime) =>
  weeklyOpeningHours.some(openingHours => isOpenOn4(openingHours, dayTime));

describe('isOpen4', () => {
  test('returns false if closed', () => {
    expect(isOpen4(weeklyOpeningHours4, closedTimeToTest)).toEqual(false);
  })

  test('returns true if open', () => {
    expect(isOpen4(weeklyOpeningHours4, {day: 'Saturday', time: '10:00'})).toEqual(true);
  })


  test('returns true if open on Sunday', () => {
    expect(isOpen4(weeklyOpeningHours4, {day: 'Sunday', time: '10:00'})).toEqual(true);
  })
})

// But, what if we do this?


const weeklyOpeningHours5 = [
  {
    open: {
      day: 'Wednesday',
      time: '9:00',
    },
    close: {
      day: 'Wednesday',
      time: '17:00'
    }
  },
  {
    open: {
      day: 'Saturday',
      time: '9:00',
    },
    close: {
      day: 'Monday',
      time: '13:00'
    }
  }
];

const toWeeklyMinutes = (dayTime) =>
(orderedDaysOfWeek.findIndex(d => d == dayTime.day) * 7*24*60)
+ toMinuteHours(dayTime.time);


import {add, diff, isBetween} from './modulo-maths.test'

const minutesInDay = 24 * 60
const minutesInWeek = 7 * minutesInDay;

const isOpenOn5 = (openingHours, dayTime) => {
  const dayTimeWeeklyMinutes = toWeeklyMinutes(dayTime);
  const openWeeklyMinutes = toWeeklyMinutes(openingHours.open);
  const closeWeeklyMinutes = toWeeklyMinutes(openingHours.close);
  // What concepts exist now we are in 'weeklyminutes' space?
  //    1. The number of minutes
  //    2. That they 'wrap'
  return isBetween (minutesInWeek)(openWeeklyMinutes, closeWeeklyMinutes)(dayTimeWeeklyMinutes);
}

const isOpen5 = (weeklyOpeningHours, dayTime) =>
  weeklyOpeningHours.some(openingHours => isOpenOn5(openingHours, dayTime));


describe('isOpen5', () => {
  test('returns false if closed', () => {
    expect(isOpen5(weeklyOpeningHours5, closedTimeToTest)).toEqual(false);
  })

  test('returns true if open', () => {
    expect(isOpen5(weeklyOpeningHours5, {day: 'Saturday', time: '10:00'})).toEqual(true);
  })


  test('returns true if open on Sunday', () => {
    expect(isOpen5(weeklyOpeningHours5, {day: 'Sunday', time: '10:00'})).toEqual(true);
  })
})