/* eslint-disable no-continue */
function max(a, b) {
  return (a > b) ? a : b;
}

function knapsackRec(capacity, items, n, dp) {
  if (n === 0 || capacity === 0) return 0;

  if (dp[n][capacity] !== -1) return dp[n][capacity];

  if (items[n - 1].weight > capacity) {
    dp[n][capacity] = knapsackRec(capacity, items, n - 1, dp);

    return dp[n][capacity];
  }

  dp[n][capacity] = max(
    (items[n - 1].value + knapsackRec(capacity - items[n - 1].weight, items, n - 1, dp)),
    knapsackRec(capacity, items, n - 1, dp),
  );

  return dp[n][capacity];
}

function findSolution(capacity, result, items, n, memoization) {
  const solution = [];
  for (let i = n; i > 0 && result > 0; i -= 1) {
    if (result === memoization[i - 1][capacity]) {
      continue;
    } else {
      solution.push(items[i - 1]);
      result -= items[i - 1].value;
      capacity -= items[i - 1].weight;
    }
  }
  return solution;
}

export function knapsack(items, capacity) {
  const n = items.length;
  const memoization = new Array(n + 1);
  for (let i = 0; i < memoization.length; i += 1) {
    memoization[i] = new Array(capacity + 1);
    for (let j = 0; j < capacity + 1; j += 1) {
      memoization[i][j] = -1;
    }
  }
  const result = knapsackRec(capacity, items, n, memoization);

  const solution = findSolution(capacity, result, items, n, memoization);

  return solution;
}
