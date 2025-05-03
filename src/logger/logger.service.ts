import { LogLevel, LogLevels } from '@common/variable/enums';
import { LOG_DIR, LOG_EXT } from '@common/variable/environment';
import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import fs from 'fs';
import path from 'path';

@Injectable()
export class LoggerService {
  levels = LogLevels;
  icons = ['📄', '✨', '🐛', '📢', '❌'] as const;
  context!: string;

  constructor() {
    this.setContext('Server');
  }

  setContext(context: string) {
    if (context) {
      this.context = context;
    }
    this.update();
  }

  update() {
    for (const index in this.levels) {
      const level = this.levels[index];
      const icon = this.icons[index];

      this[level] = (message: any, ...optionalParams: any[]) => {
        const timestamp = this.timestamp();
        const tag = `[${level.toUpperCase()}] [${this.context.toUpperCase()}] [${timestamp}]`;
        const formatted = `${icon} ${tag} --- ${message} ${
          optionalParams.length
            ? optionalParams.map((p) => JSON.stringify(p)).join(' ')
            : ''
        }`;

        // 콘솔 출력
        console[level](formatted);

        // 로그 파일 저장
        this.saveLog(level, formatted);
      };
    }
  }

  private timestamp() {
    return dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');
  }

  private saveLog(type: LogLevel, message: string) {
    const today = dayjs().format('YYYY-MM-DD');
    const logDirPath = path.resolve(LOG_DIR);

    // 디렉토리 없으면 생성
    if (!fs.existsSync(logDirPath)) {
      fs.mkdirSync(logDirPath, { recursive: true });
    }

    const logFilename = `${today}.${type}${LOG_EXT}`;
    const fullPath = path.join(logDirPath, logFilename);

    fs.appendFileSync(fullPath, message + '\n', 'utf8');
  }

  log!: (message: any, ...optionalParams: any[]) => void;
  info!: (message: any, ...optionalParams: any[]) => void;
  debug!: (message: any, ...optionalParams: any[]) => void;
  warn!: (message: any, ...optionalParams: any[]) => void;
  error!: (message: any, ...optionalParams: any[]) => void;
}
