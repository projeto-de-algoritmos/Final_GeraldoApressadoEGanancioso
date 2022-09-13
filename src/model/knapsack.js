function max(a, b) {
  return (a > b) ? a : b;
}

// Returns the value of maximum profit
function knapSackRec(W, wt, val, n, dp) {
  if (n === 0 || W === 0) return 0;

  if (dp[n][W] !== -1) return dp[n][W];

  if (wt[n - 1] > W) {
    dp[n][W] = knapSackRec(W, wt, val, n - 1, dp);
    return dp[n][W];
  }
  // Return value of table after storing
  dp[n][W] = max(
    (val[n - 1]
      + knapSackRec(
        W - wt[n - 1],
        wt,
        val,
        n - 1,
        dp,
      )),
    knapSackRec(
      W,
      wt,
      val,
      n - 1,
      dp,
    ),
  );
  return dp[n][W];
}

export function knapsack(W, wt, val, N) {
  const dp = new Array(N + 1);
  for (let i = 0; i < dp.length; i += 1) {
    dp[i] = new Array(W + 1);
  }

  for (let i = 0; i < N + 1; i += 1) { for (let j = 0; j < W + 1; j += 1) dp[i][j] = -1; }

  return knapSackRec(W, wt, val, N, dp);
}
