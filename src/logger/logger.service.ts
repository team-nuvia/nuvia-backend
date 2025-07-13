import { CommonService } from '@common/common.service';
import { LogLevel, RunMode } from '@common/variable/enums';
import { Injectable } from '@nestjs/common';
import { capitalize } from '@util/capitalize';
import { dateFormat } from '@util/dateFormat';
import path from 'path';
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    log: 3, // 커스텀 log 레벨 추가
    debug: 4,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    log: 'blue', // 색상도 추가
    debug: 'magenta',
  },
};

@Injectable()
export class LoggerService {
  static contextsToIgnore: string[] = ['InstanceLoader', 'RoutesResolver', 'RouterExplorer'];

  private readonly winstonLogger: winston.Logger;
  // private readonly levels = LogLevels;
  private readonly icons = ['❌', '📢', '✨', '📄', '🐛'] as const;
  // private readonly logActivate: boolean;
  // private readonly logSaveActivate: boolean;

  context!: string;

  constructor(private readonly commonService: CommonService) {
    const commonConfig = this.commonService.getConfig('common');
    const getIcon = (level: string) => {
      const index = Object.keys(customLevels.levels).indexOf(level);
      return this.icons[index];
    };

    // this.logActivate = commonConfig.logActivate;
    // this.logSaveActivate = commonConfig.logSaveActivate;

    const dailyOption = (level: string) => {
      return {
        level,
        datePattern: 'YYYY-MM-DD',
        dirname: path.join(path.resolve(), `logs/${level}`), // 저장위치
        filename: `%DATE%.${level}.log`,
        maxFiles: 30, // 30일동안 저장
        zippedArchive: true, // 오래된거 압축
        format: winston.format.combine(winston.format.timestamp()),
      };
    };

    const transports: winston.transport[] = [new winstonDaily(dailyOption('info')), new winstonDaily(dailyOption('error'))];
    if (commonConfig.runMode === RunMode.Development) {
      transports.push(new winston.transports.Console());
    }

    this.winstonLogger = winston.createLogger({
      levels: customLevels.levels,
      level: 'log',
      // format: winston.format.json(),
      format: winston.format.combine(
        winston.format.timestamp({
          format: dateFormat('YYYY-MM-DD HH:mm:ss.SSS'),
        }),
        winston.format.printf(({ level, message, timestamp, context }) => {
          return `[${timestamp}] [${getIcon(level)} ${level.toUpperCase().padStart(5)}] [${capitalize((context as string) || 'n/a')}] ${message}`;
        }),
      ),
      transports: transports,
    });
    winston.addColors(customLevels.colors);

    this.setContext('server');
  }

  setContext(context: string) {
    if (context) {
      this.context = context;
    }
    // this.update();
  }

  // update() {
  //   for (const index in this.levels) {
  //     const level = this.levels[index];
  //     // const icon = this.icons[index];

  //     // this[level] = (message: any, ...optionalParams: any[]) => {
  //     //   const timestamp = this.timestamp();
  //     //   const tag = `[${level.toUpperCase()}] [${this.context.toUpperCase()}] [${timestamp}]`;
  //     //   const formatted = `${icon} ${tag} --- ${message} ${
  //     //     optionalParams.length ? optionalParams.map((p) => JSON.stringify(p, null, 2)).join(' ') : ''
  //     //   }`;

  //     //   // 로그 파일 저장
  //     //   if (this.logSaveActivate) {
  //     //     this.saveLog('all', formatted);
  //     //     this.saveLog(level, formatted);
  //     //   }

  //     //   // 콘솔 출력
  //     //   if (this.logActivate) {
  //     //     console[level](formatted);
  //     //   }
  //     // };
  //     // console.log('🚀 ~ LoggerService ~ update ~ this.winstonLogger:', this.winstonLogger);

  //     // console.log('🚀 ~ LoggerService ~ update ~ this:', this);
  //     // console.log('🚀 ~ LoggerService ~ update ~ this[level]:', this[level]);
  //     // this[level] = this.winstonLogger[level];
  //     Object.defineProperty(this, level, {
  //       value: this.winstonLogger[level],
  //     });
  //   }
  // }

  // private timestamp() {
  //   return dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');
  // }

  // private saveLog(type: 'all' | LogLevel, message: string) {
  //   const today = dayjs().format('YYYY-MM-DD');
  //   const logDirPath = path.resolve(LOG_DIR);

  //   // 디렉토리 없으면 생성
  //   if (!fs.existsSync(logDirPath)) {
  //     fs.mkdirSync(logDirPath, { recursive: true });
  //   }

  //   const logFilename = `${today}.${type}${LOG_EXT}`;
  //   const fullPath = path.join(logDirPath, logFilename);

  //   fs.appendFileSync(fullPath, message + '\n', 'utf8');
  // }

  log(message: any, context?: string, ...optionalParams: any[]) {
    if (context && LoggerService.contextsToIgnore.includes(context)) return;

    const contextToUse = context ?? this.context;
    this.winstonLogger.log(LogLevel.Log, message, { context: contextToUse, ...optionalParams });
  }

  info(message: any, context?: string, ...optionalParams: any[]) {
    const contextToUse = context ?? this.context;
    this.winstonLogger.info(message, { context: contextToUse, ...optionalParams });
  }

  debug(message: any, context?: string, ...optionalParams: any[]) {
    const contextToUse = context ?? this.context;
    this.winstonLogger.debug(message, { context: contextToUse, ...optionalParams });
  }

  warn(message: any, context?: string, ...optionalParams: any[]) {
    const contextToUse = context ?? this.context;
    this.winstonLogger.warn(message, { context: contextToUse, ...optionalParams });
  }

  error(message: any, context?: string, ...optionalParams: any[]) {
    const contextToUse = context ?? this.context;
    this.winstonLogger.error(message, { context: contextToUse, ...optionalParams });
  }
}
