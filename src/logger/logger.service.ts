import { CommonService } from '@common/common.service';
import { LogLevel, RunMode } from '@common/variable/enums';
import { Injectable } from '@nestjs/common';
import { DateFormat } from '@util/dateFormat';
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
      format: winston.format.combine(
        winston.format.timestamp({
          format: DateFormat.toUTC('YYYY-MM-DD HH:mm:ss.SSS'),
        }),
        winston.format.printf(({ level, message, timestamp, context }) => {
          return `[${timestamp}] [${getIcon(level)} ${level.toUpperCase().padStart(5)}] [${context ? (context as string) : 'n/a'}] ${message}`;
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
  }

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
