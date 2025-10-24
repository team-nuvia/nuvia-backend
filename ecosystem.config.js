module.exports = {
  apps: [
    {
      name: 'nuvia-backend-prod',
      script: 'dist/main.js',
      instances: 2, // 기본적으로 2개 인스턴스 실행
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      min_uptime: '10s', // 최소 가동 시간
      max_restarts: 10, // 최대 재시작 횟수
      restart_delay: 4000, // 재시작 지연 시간
      kill_timeout: 5000, // 프로세스 종료 대기 시간
      wait_ready: true, // ready 이벤트 대기
      listen_timeout: 10000, // listen 이벤트 타임아웃
      env_production: {
        NODE_ENV: 'production',
        PORT: 443,
        instances: 2, // 운영환경에서 2개 인스턴스
      },
      error_file: './logs/error/pm2-error.log',
      out_file: './logs/info/pm2-out.log',
      log_file: './logs/info/pm2-combined.log',
      time: true,
      merge_logs: true, // 로그 병합
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z', // 로그 날짜 형식
    },
    {
      name: 'nuvia-backend-dev',
      script: 'dist/main.js',
      watch: true,
      env_development: {
        NODE_ENV: 'development',
        RUN_ON: 'local',
        PORT: 3000,
        watch: true,
        instances: 1, // 개발환경에서는 단일 인스턴스
      },
    },
  ],
};
