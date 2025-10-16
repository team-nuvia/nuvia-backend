import { Injectable } from '@nestjs/common';

/* 텍스트 전처리 알고리즘 */
@Injectable()
export class ProcessingService {
  LEVENSHTEIN_WEIGHT = 0.6 as const; // 레벤슈타인 가중치: 높을수록 편집(오타·철자 변화)에 덜 민감
  JACCARD_WEIGHT = 0.4 as const; // 자카드 가중치: 높을수록 어절(띄어쓰기) 차이에 덜 민감

  normalizeKo(s: string): string {
    if (!s) return '';
    return (
      s
        // 유니코드 정규화: NFC로 통일
        .normalize('NFC')
        // 소문자화(영문 섞이는 경우)
        .toLowerCase()
        // 양끝/중복 공백 정리
        .trim()
        .replace(/\s+/g, ' ')
        // 이모지/기호/문장부호(필요 시 유지) 제거
        .replace(/[^\p{L}\p{N}\s]/gu, '')
      // 전각→반각 등 추가 맵핑 필요하면 여기에
    );
  }

  // 한글 음절 → 초/중/종성 분해
  decomposeHangulToJamo(s: string): string {
    const CHO = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    const JUNG = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
    // prettier-ignore
    const JONG = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

    let out = '';
    for (const ch of s) {
      const code = ch.codePointAt(0)!;
      if (code >= 0xac00 && code <= 0xd7a3) {
        const sIndex = code - 0xac00;
        const jong = sIndex % 28;
        const jung = ((sIndex - jong) / 28) % 21;
        const cho = Math.floor(sIndex / 28 / 21);
        out += CHO[cho] + JUNG[jung] + (JONG[jong] ?? '');
      } else {
        out += ch; // 한글 외 문자는 그대로
      }
    }
    return out;
  }

  // 기본 레벤슈타인 거리 알고리즘즘
  levenshtein(a: string, b: string): number {
    const n = a.length,
      m = b.length;
    if (n === 0) return m;
    if (m === 0) return n;
    const dp = Array.from({ length: n + 1 }, (_, i) => [i, ...Array(m).fill(0)]);
    for (let j = 1; j <= m; j++) dp[0][j] = j;

    for (let i = 1; i <= n; i++) {
      const ai = a[i - 1];
      for (let j = 1; j <= m; j++) {
        const bj = b[j - 1];
        const cost = ai === bj ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1, // insertion
          dp[i - 1][j - 1] + cost, // substitution
        );
        // Damerau: 인접 전치
        if (i > 1 && j > 1 && ai === b[j - 2] && a[i - 2] === bj) {
          dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
        }
      }
    }
    return dp[n][m];
  }

  /* 유사도 계산 */
  similarity(aRaw: string, bRaw: string, { useJamo = true } = {}): number {
    let a = this.normalizeKo(aRaw);
    let b = this.normalizeKo(bRaw);
    if (!a && !b) return 1;
    if (!a || !b) return 0;

    if (useJamo) {
      a = this.decomposeHangulToJamo(a);
      b = this.decomposeHangulToJamo(b);
    }
    const dist = this.levenshtein(a, b);
    const maxLen = Math.max(a.length, b.length, 1);
    return 1 - dist / maxLen;
  }

  /* n-gram  */
  charNgrams(s: string, n = 2): Set<string> {
    s = this.normalizeKo(s);
    const grams = new Set<string>();
    if (s.length < n) {
      grams.add(s);
      return grams;
    }
    for (let i = 0; i <= s.length - n; i++) grams.add(s.slice(i, i + n));
    return grams;
  }

  /* 자카드 */
  jaccard(a: Set<string>, b: Set<string>): number {
    let inter = 0;
    for (const x of a) if (b.has(x)) inter++;
    const uni = a.size + b.size - inter;
    return uni === 0 ? 1 : inter / uni;
  }

  /* n-gram + 자카드 혼합 유사도 계산 */
  hybridSimilarity(a: string, b: string): number {
    const sLev = this.similarity(a, b, { useJamo: true });
    const sJac = this.jaccard(this.charNgrams(a, 2), this.charNgrams(b, 2));
    // 가중 평균: 띄어쓰기 민감도 낮추려면 자카드 가중치 약간 높게
    return this.LEVENSHTEIN_WEIGHT * sLev + this.JACCARD_WEIGHT * sJac;
  }

  pickThresholdByLen(a: string, b: string) {
    const len = Math.max(a.length, b.length); // 정규화 이후 길이가 더 적합
    if (len < 4) return 0.92;
    if (len <= 7) return 0.85;
    if (len <= 15) return 0.8;
    return 0.78;
  }
}
