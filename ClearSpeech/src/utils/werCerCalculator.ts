/**
 * Word Error Rate
 */

export function calculateWER(reference: string, hypothesis: string): number {
  const refWords = normalize(reference).split(" ");
  const hypWords = normalize(hypothesis).split(" ");

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

/**
 * Character Error Rate
 */

export function calculateCER(reference: string, hypothesis: string): number {
  const normRef = normalize(reference).replace(/ /g, "");
  const normHyp = normalize(hypothesis).replace(/ /g, "");

  const refChars = normRef.split("");
  const hypChars = normHyp.split("");

  const rLen = refChars.length;
  const hLen = hypChars.length;

    const d: number[][] = Array.from({ length: rLen + 1 }, () =>
    Array(hLen + 1).fill(0)
  );

  for (let i = 0; i <= rLen; i++) d[i][0] = i;
  for (let j = 0; j <= hLen; j++) d[0][j] = j;

  for (let i = 1; i <= rLen; i++) {
    for (let j = 1; j <= hLen; j++) {
      const cost = refChars[i - 1] === hypChars[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost
      );
    }
  }

  return d[rLen][hLen] / rLen;

}


function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/[.,!?;:"'()\-]/g, "")  //remove punctuation marks
    .replace(/\s+/g, " ") //merge multiple spaces
    .trim();
}
