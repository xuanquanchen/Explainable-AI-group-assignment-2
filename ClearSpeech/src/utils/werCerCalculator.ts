export function calculateWER(reference: string, hypothesis: string): number {
  const refWords = reference.trim().split(/\s+/);
  const hypWords = hypothesis.trim().split(/\s+/);

  const rLen = refWords.length;
  const hLen = hypWords.length;

  const d: number[][] = Array.from({ length: rLen + 1 }, () =>
    Array(hLen + 1).fill(0)
  );

  for (let i = 0; i <= rLen; i++) d[i][0] = i;
  for (let j = 0; j <= hLen; j++) d[0][j] = j;

  for (let i = 1; i <= rLen; i++) {
    for (let j = 1; j <= hLen; j++) {
      const cost = refWords[i - 1] === hypWords[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost
      );
    }
  }

  return d[rLen][hLen] / rLen;
}

export function calculateCER(reference: string, hypothesis: string): number {
  const refChars = reference.replace(/\s/g, "");
  const hypChars = hypothesis.replace(/\s/g, "");
  return calculateWER(refChars, hypChars);
}
