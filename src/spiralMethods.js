// Contains all functions used to build spiral and prime numbers
// return all prime numbers until n
export function getPrimes(n, arr) {
  // already calculated, return arr
  if (n <= arr[arr.length - 1]) {
    return arr;
  }
  // else build
  var start = Math.max(3, arr[arr.length - 1]);
  for (let i = start; i <= n; i += 2) {
    let isPrime = 1;
    for (let j = 0; j < arr.length; j++) {
      if (i % arr[j] === 0) {
        isPrime = 0;
        break;
      }
    }
    if (isPrime) {
      arr.push(i);
    }
  }
  return arr;
}

// arr: spiral corners array [x_rel, y_rel, number]
// dataArr: [adPtr, steps, counter, i]
// build array of RELATIVE POSITIONS of all corner coords in spiral
export function buildSpiral(n, arr, dataArray) {
  // if arr already built
  if (n <= dataArray[3] - 1) {
    return arr;
  }

  // else build array
  // initialize spiral variables
  const axisAndDir = [
    [0, 1],
    [1, -1],
    [0, -1],
    [1, 1],
  ]; // Dir=1 right/down, Dir=-1 left/up

  // adPtr: ptr for axisAndDir 0-3
  // steps: how many steps to take; increases every 2 direction changes
  // counter: each value of 'steps' occurs twice, then direction change
  // i: current number being built
  var [adPtr, steps, counter, i] = dataArray;

  while (i <= n) {
    var axis = axisAndDir[adPtr][0];
    var delta = axisAndDir[adPtr][1];
    let temp = [...arr[arr.length - 1]]; // temp is last element of arr
    temp[axis] += steps * delta;
    temp[2] += steps;
    arr.push(temp);

    // update variables
    counter--;
    i += steps;
    if (counter === 0) {
      counter = 2;
      steps++;
    }
    adPtr++;
    adPtr = adPtr > 3 ? 0 : adPtr; // if out of bounds, point back to first
  }
  // update dataArray
  var temp = [adPtr, steps, counter, i];
  for (let j = 0; j < dataArray.length; j++) {
    dataArray[j] = temp[j];
  }
  return arr;
}

// make array of relative coords of all prime numbers
export function makePrimesArr(n, spiralCorners, primes) {
  const arr = []; // return this
  var ptr = 0; // point to primes array
  for (let i = 1; i < spiralCorners.length; i++) {
    let p1 = [...spiralCorners[i - 1]];
    let p2 = [...spiralCorners[i]];
    var interval = p2[2] - p1[2];
    while (primes[ptr] > p1[2] && primes[ptr] <= p2[2]) {
      let temp = [...p1];
      let delta = (primes[ptr] - p1[2]) / interval;
      let diffVec = [(p2[0] - p1[0]) * delta, (p2[1] - p1[1]) * delta];
      temp[0] += diffVec[0];
      temp[1] += diffVec[1];
      arr.push(temp);
      ptr++;
    }
  }
  return arr;
}

// return number of prime numbers until n
export const numPrimes = (n, primes) => {
  if (n > primes[primes.length - 1]) {
    primes = getPrimes(n, primes);
  }
  var ptr = 0;
  while (primes[ptr] <= n) {
    ptr++;
  }
  return ptr;
};
