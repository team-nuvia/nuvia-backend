// npm i axios를 제거하고 내장 fetch 사용
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || ''; // 사용자 생성이 보호된 경우 필요(없으면 건너뜀)
const SEED_USER = {
  email: process.env.SEED_EMAIL || 'chaplet01@gmail.com',
  password: process.env.SEED_PASSWORD || 'qweQQ!!1',
  name: 'Seed User',
  nickname: 'Seeder',
};

const SURVEY_TITLE = process.env.SURVEY_TITLE || '더미 고객 만족도 설문';
const USER_AGENT = process.env.USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SeedBot/1.0';

async function apiRequest(url, options = {}) {
  const response = await fetch(`${BASE_URL}${url}`, {
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.response = {
      status: response.status,
      data: await response.json().catch(() => ({})),
    };
    throw error;
  }

  return response.json();
}

function withAuth(token) {
  return async (url, options = {}) => {
    return apiRequest(url, {
      ...options,
      headers: {
        // Authorization: `Bearer ${token}`,
        Cookie: `access_token=${token}`,
        ...options.headers,
      },
    });
  };
}

async function signupIfPossible() {
  if (!ADMIN_TOKEN) {
    console.log('⚠️  ADMIN_TOKEN 미설정: 사용자 생성 단계는 건너뜀.');
    return;
  }
  try {
    const authed = withAuth(ADMIN_TOKEN);
    await authed('/api/v1/users', {
      method: 'POST',
      body: JSON.stringify({
        email: SEED_USER.email,
        name: SEED_USER.name,
        nickname: SEED_USER.nickname,
        password: SEED_USER.password,
      }),
    });
    console.log('✅ 사용자 생성 완료(관리자 토큰 사용).');
  } catch (e) {
    if (e.response?.status === 409) {
      console.log('ℹ️  이미 존재하는 사용자로 판단(409). 계속 진행.');
    } else {
      console.error('❌ 사용자 생성 실패:', e.response?.data || e.message);
    }
  }
}

async function login() {
  const data = await apiRequest('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: SEED_USER.email,
      password: SEED_USER.password,
      accessDevice: 'SeedScript',
      accessBrowser: 'Node',
      accessUserAgent: USER_AGENT,
    }),
  });
  const token = data?.payload?.accessToken;
  if (!token) throw new Error('로그인 토큰 없음');
  console.log('🔐 로그인 성공.');
  return token;
}

async function pickCategory(token) {
  const authed = withAuth(token);
  const data = await authed('/api/v1/surveys/categories');
  const list = data?.payload || data; // 스웨거 예시 상 payload 형식
  const first = (Array.isArray(list) && list[0]) || (Array.isArray(data?.payload) && data.payload[0]);
  if (!first) throw new Error('카테고리가 없습니다. 최소 1개 필요.');
  const catId = first.id ?? 1; // 일부 예시는 id/name 객체 형태
  return catId;
}

function isoPlusDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

async function createSurvey(token, categoryId) {
  const authed = withAuth(token);
  const payload = {
    categoryId,
    title: SURVEY_TITLE,
    description: '시드 스크립트가 생성한 더미 설문',
    isPublic: true,
    status: 'active',
    expiresAt: isoPlusDays(30),
    // 스키마상 questions는 string[] 예시이므로 간단 텍스트로 구성
    questions: ['우리 서비스 전반 만족도는?', '가장 마음에 드는 점은?', '개선이 시급한 부분은?'],
  };
  await authed('/api/v1/surveys', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  console.log('📝 설문 생성 요청 전송 완료.');

  // 방금 만든 설문 찾기(제목으로 검색 → 첫 페이지)
  const searchParams = new URLSearchParams({
    search: SURVEY_TITLE,
    page: '1',
    limit: '10',
  });
  const data = await authed(`/api/v1/surveys?${searchParams}`);
  const found = data?.payload?.data?.find((s) => s.title === SURVEY_TITLE);
  if (!found) throw new Error('생성된 설문을 목록에서 찾지 못했습니다.');
  console.log('🔎 생성 설문 ID:', found.id);
  return found.id;
}

async function getSurveyDetail(token, surveyId) {
  const authed = withAuth(token);
  const { data } = await authed.get(`/api/v1/surveys/${surveyId}`);
  return data?.payload;
}

async function startAnswer(token, surveyId) {
  const authed = withAuth(token);
  await authed.post(`/api/v1/surveys/${surveyId}/answers/start`, {
    userAgent: USER_AGENT,
  });
  console.log('🏁 응답 세션 시작');
}

async function submitDummyAnswers(token, survey) {
  const authed = withAuth(token);
  const questions = survey?.questions || [];

  if (!Array.isArray(questions) || questions.length === 0) {
    console.log('⚠️ 설문에 질문이 없어서 더미 응답을 생성할 수 없습니다.');
    return;
  }

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    // 질문 구조가 스키마에 명시되지 않아 id가 없을 수도 있어 방어적으로 처리
    const qid = q.id ?? q.questionId ?? i + 1;

    // CreateAnswerPayloadDto 스키마에 따라 answers는 '하나의 객체'로 명세됨
    // (만약 400 나오면 answers를 배열로 바꿔 시도: { answers: [{...}], ... })
    const body = {
      answers: {
        questionId: qid,
        optionIds: null, // 객관식 옵션이 있다면 [1,2] 등으로
        value: i === 0 ? '5점' : i === 1 ? 'UI가 깔끔해요' : '온보딩이 더 간단하면 좋겠어요',
      },
      status: i === questions.length - 1 ? 'completed' : 'inProgress',
    };

    try {
      await authed.post(`/api/v1/surveys/${survey.id}/answers`, body);
      console.log(`✅ Q${i + 1} 응답 전송`);
    } catch (e) {
      // 호환 이슈 대응: answers가 배열이어야 하는 서버 구현이라면 fallback
      if (e.response?.status === 400) {
        const fallback = { ...body, answers: [body.answers] };
        await authed.post(`/api/v1/surveys/${survey.id}/answers`, fallback);
        console.log(`✅ Q${i + 1} 응답 전송(fallback: answers[])`);
      } else {
        console.error(`❌ Q${i + 1} 응답 실패:`, e.response?.data || e.message);
      }
    }
  }
}

(async () => {
  try {
    await signupIfPossible();
    const token = await login();
    const categoryId = await pickCategory(token);
    const surveyId = await createSurvey(token, categoryId);
    const detail = await getSurveyDetail(token, surveyId);
    await startAnswer(token, surveyId);
    await submitDummyAnswers(token, detail);
    console.log('🎉 더미 데이터 시드 완료');
  } catch (e) {
    console.error('스크립트 실패:', e.response?.data || e.message);
    process.exit(1);
  }
})();
