const zip = (a, b) => a.map((value, index) => [value, b[index]]);
const unzip = (l) =>
  l.reduce(
    ([l1, l2], [a, b]) => {
      l1.push(a);
      l2.push(b);
      return [l1, l2];
    },
    [[], []]
  );
const rmElem = (l, index) => l.splice(index, 0);

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
  return array;
}

const evaluateA = (l1, l2) => {
  const positionMatches = zip(l1, l2).filter(([a, b]) => a === b).length;

  const [l1nonMatches, l2nonMatches] = unzip(
    zip(l1, l2).filter(([a, b]) => a !== b)
  );

  // watch out!! O(n^2)
  const outOfPositionMatches = l1nonMatches.reduce((count, currentVal) => {
    let matchPos = l2nonMatches.findIndex((x) => x === currentVal);
    if (matchPos !== -1) {
      rmElem(l2nonMatches, matchPos);
      return count + 1;
    }
    return count;
  }, 0);

  return [positionMatches, outOfPositionMatches];
};

// Recursive: bombs out for 10,000 elements
const evaluateB = (l1, l2) => {
  const positionMatches = zip(l1, l2).filter(([a, b]) => a === b).length;

  const [l1nonMatches, l2nonMatches] = unzip(
    zip(l1, l2).filter(([a, b]) => a !== b)
  );

  // O(n log n)
  l1nonMatches.sort();
  l2nonMatches.sort();

  // O(n)
  const f = (l1, l2, count) => {
    if (l1.length === 0 || l2.length === 0) {
      return count;
    }
    if (l1[0] === l2[0]) {
      l1nonMatches.shift();
      l2nonMatches.shift();
      return f(l1, l2, count + 1);
    }
    if (l1[0] < l2[0]) {
      l1.shift();
      return f(l1, l2, count);
    }
    if (l1[0] > l2[0]) {
      l2.shift();
      return f(l1, l2, count);
    }
  };

  const outOfPositionMatches = f(l1nonMatches, l2nonMatches, 0);

  return [positionMatches, outOfPositionMatches];
};

const evaluateC = (l1, l2) => {
  const positionMatches = zip(l1, l2).filter(([a, b]) => a === b).length;
  // Find all the nonMatches, zipped up.
  const nonMatches = zip(l1, l2).filter(([a, b]) => a !== b);

  // create a map: nonMatch -> nonMatchCount
  // e.g. : {1: [4,2], 7: [1, 0]} - meaning that there were non matching 1's: 4 in list1, and 2 in list2. (similarly for 7)
  const nonMatchSetCounts = nonMatches.reduce((set, [a, b]) => {
    set[a] ? set[a][0]++ : (set[a] = [1, 0]);
    set[b] ? set[b][1]++ : (set[b] = [0, 1]);
    return set;
  }, {});

  // Find totals of non matching counts:
  const z = Object.entries(nonMatchSetCounts).map(
    ([_nonMatchKey, [l1Count, l2Count]]) =>
      l1Count + l2Count - Math.abs(Math.max(l1Count, l2Count))
  );
  const misMatchCount = z.reduce((prev, curr) => prev + curr, 0);

  return [positionMatches, misMatchCount];
};

const toCountMap = (l) => {
  return l.reduce((countMap, x) => {
    countMap[x] ? ++countMap[x] : (countMap[x] = 1);
    return countMap;
  }, {});
};

const misMatchCount = (a, b) => a + b - Math.abs(Math.max(a, b));

const evaluateD = (l1, l2) => {
  const positionMatches = zip(l1, l2).filter(([a, b]) => a === b).length;
  // Find all the nonMatches, zipped up.
  const [l1NonMatchesMap, l2NonMatchesMap] = unzip(
    zip(l1, l2).filter(([a, b]) => a !== b)
  ).map(toCountMap);

  const nonMatchCount = Object.entries(l1NonMatchesMap).reduce(
    (currentCount, [key, l1Count]) =>
      misMatchCount(l2NonMatchesMap[key] || 0, l1Count) + currentCount,
    0
  );

  return [positionMatches, nonMatchCount];
};

const evaluateE = (l1, l2) => {
  const l1l2 = zip(l1, l2);

  // Get the number of position matches,
  // and a map of non-match-number -> [l1count, l2count]
  // (i.e. how many times non-match-number appears in l1 and l2)
  const [positionMatches, misMatchMap] = l1l2.reduce(
    ([matches, nonMatchMap], [a, b]) => {
      if (a === b) {
        return [matches + 1, nonMatchMap];
      }
      nonMatchMap[a] ? nonMatchMap[a][0]++ : (nonMatchMap[a] = [1, 0]);
      nonMatchMap[b] ? nonMatchMap[b][1]++ : (nonMatchMap[b] = [0, 1]);
      return [matches, nonMatchMap];
    },
    [0, {}]
  );

  // Now, based on the misMatchMap, add up how many amount to out-of-position matches
  const outOfPositionMatches = Object.entries(misMatchMap).reduce(
    (count, [_nonMatchKey, [l1Count, l2Count]]) =>
      count + Math.min(l1Count, l2Count),
    0
  );

  return [positionMatches, outOfPositionMatches];
};

describe("mastermind evaluate2b", () => {
  test.each([
    { a: [], b: [], expected: [0, 0] },
    { a: [1], b: [1], expected: [1, 0] },
    { a: [1, 2], b: [1, 2], expected: [2, 0] },
    { a: [1, 7, 2], b: [1, 6, 2], expected: [2, 0] },
    { a: [1, 7, 2, 6], b: [1, 6, 2, 5], expected: [2, 1] },
    { a: [1, 7, 2, 10], b: [1, 6, 2, 7], expected: [2, 1] },
    { a: [1, 7, 2, 10, 7, 11], b: [1, 6, 2, 7, 15, 7], expected: [2, 2] },
    { a: [1, 2], b: [2, 1], expected: [0, 2] },
  ])("evaluate($a, $b)", ({ a, b, expected }) => {
    expect(evaluateE(a, b)).toStrictEqual(expected);
  });
});

const bigArray1 = shuffle(
  Array(100000)
    .fill(0)
    .map((x, i) => i)
);
const bigArray2 = shuffle(
  Array(100000)
    .fill(0)
    .map((x, i) => i)
);

describe("mastermind large array timing test", () => {
  test.each([{ a: bigArray1, b: bigArray2 }])(
    "evaluate large arrays",
    ({ a, b }) => {
      const startTime = Date.now();
      const result = evaluateE(a, b);
      const endTime = Date.now();
      const executionTimeMs = endTime - startTime;

      // going to be affected by computer etc, but just saying, it can't take too long...
      // (150ms on my slow machine)
      expect(executionTimeMs).toBeLessThan(200);
      console.log(`ExecutionTime = ${executionTimeMs}ms. Result: ${result}`);
    }
  );
});
