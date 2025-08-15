/* Test Values */
export const Sample = {
  username: {
    first: [
      '유별난',
      '다채로운',
      '활발한',
      '다정다감한',
      '기능적인',
      '환상적인',
      '눈에띄는',
      '감상적인',
      '조화로운',
      '발랄한',
      '따사로운',
      '냉소적인',
    ],
    last: [
      '지우개',
      '분필',
      '필통',
      '책꽂이',
      '책받침',
      '모나미펜',
      '제도샤프',
      '유성매직',
      '만년필',
      '네임펜',
      '화이트',
      '눈금자',
      '삼각자',
      '이젤',
      '화통',
    ],
  },
} as const;
export type Sample = (typeof Sample)[keyof typeof Sample];
