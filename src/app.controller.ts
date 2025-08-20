import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { Public } from '@common/decorator/public.decorator';
import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiHideProperty, ApiOperation, ApiTags } from '@nestjs/swagger';
import { uniqueHash } from '@util/uniqueHash';
import { UtilService } from '@util/util.service';
import { AppService } from './app.service';
import { GetVersionResponse } from './responses';

@Public()
@ApiTags('앱')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly utilService: UtilService,
  ) {}

  @ApiOperation({ summary: '버전 조회' })
  @CombineResponses(HttpStatus.OK, GetVersionResponse)
  @Get('version')
  getVersion() {
    const version = this.appService.getVersion();

    return new GetVersionResponse(version);
  }

  @ApiHideProperty()
  @Get('hash-test')
  hashTest() {
    return {
      hashedUniqueKey: uniqueHash(),
    };
  }

  @ApiHideProperty()
  @Get('encode-test')
  encodeTest(@Query('token') token: string) {
    try {
      if (!token) {
        return {
          name: 'EncodeTestResponse',
          message: '토큰이 제공되지 않았습니다.',
          payload: {
            ok: false,
            encodedToken: null,
          },
        };
      }

      const encodedToken = this.utilService.encodeToken(token);
      return {
        name: 'EncodeTestResponse',
        message: '토큰 암호화 성공',
        payload: {
          ok: true,
          encodedToken,
        },
      };
    } catch (error: any) {
      return {
        name: 'EncodeTestResponse',
        message: error.message || '토큰 암호화에 실패했습니다.',
        payload: {
          ok: false,
          encodedToken: null,
          error: error.message,
        },
      };
    }
  }

  @ApiHideProperty()
  @Get('decode-test')
  decodeTest(@Query('token') token: string) {
    try {
      if (!token) {
        return {
          name: 'DecodeTestResponse',
          message: '토큰이 제공되지 않았습니다.',
          payload: {
            ok: false,
            decodedToken: null,
          },
        };
      }

      const decodedToken = this.utilService.decodeToken(token);
      return {
        name: 'DecodeTestResponse',
        message: '토큰 복호화 성공',
        payload: {
          ok: true,
          decodedToken,
        },
      };
    } catch (error: any) {
      return {
        name: 'DecodeTestResponse',
        message: error.message || '토큰 복호화에 실패했습니다.',
        payload: {
          ok: false,
          decodedToken: null,
          error: error.message,
        },
      };
    }
  }
}
