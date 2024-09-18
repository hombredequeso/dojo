// modular arithmetic.
// Using a modulo (wrap around value)


// isBetween: equal to or greater than a AND less than b
const isBetween = (modulo)=>(a,b) => (x) => {
  const am = a % modulo;
  const bm = b % modulo;
  const xm = x % modulo;

  return (am<=bm)? (xm < bm && xm >= am): 
    (xm >= am || xm < bm);
};

describe('isBetween modulo 10', () => {
  test.each([
    [0,0,0, false],
    [0,0,1, false],
    [0,1,0, true],
    [0,1,1, false],
    [0,1,2, false],

    [1,2,1, true],
    [1,2,2, false],
    [1,2,3, false],
    [1,2,0, false],
    
    [9, 1, 9, true],
    [9, 1, 0, true],
    [9, 1, 1, false],
    [9, 1, 2, false],
    [9, 1, 8, false],

    [0, 2, 10, true],
    [0, 2, 11, true],
    [0, 2, 12, false],

    [9, 1, 19, true],
    [9, 1, 10, true],
    [9, 1, 11, false],
    [9, 1, 12, false],
    [9, 1, 18, false],

    [9, 1, 29, true],
    [9, 1, 20, true],
    [9, 1, 21, false],
    [9, 1, 22, false],
    [9, 1, 28, false],

  ])('%#. isBetween(10)(%d, %d)(%d) = %s', (a, b, x, expectedResult) => {
    expect(isBetween(10)(a,b)(x)).toEqual(expectedResult);
  })
})


const getDiff = (modulo) => (x) => (val) => {
  const diff = val - x
  return (diff >=0)? diff : diff + modulo;
}

const getClosest = (modulo) => (x) => (a,b) => {
  if (a === null) {
    return b;
  }

  const getDiffModA = getDiff(modulo)(x);
  return (getDiffModA(a) < getDiffModA(b)) ? a:b;
}


// Find the closest value (with wraparound) in arr (number[]) to x (number)
const getNext = (modulo) => (arr) => (x) => 
  arr.reduce(getClosest(modulo)(x), null);


describe('getNext mod 10', () => {
  test.each([
    [[], 0, null],
    [[1], 0, 1],
    [[1,2], 1, 1],
    [[1, 2], 0, 1],
    [[2, 1], 0, 1],
    [[1], 9, 1],
    [[1, 2], 9, 1],
    [[2, 1], 9, 1],
    [[2, 9], 8, 9],
  ])('%#. getNext(10)(%p)(%d) = %s', (arr, x, expectedResult) => {
    const result =getNext(10)(arr)(x);
    expect(result).toEqual(expectedResult);
  })
})
