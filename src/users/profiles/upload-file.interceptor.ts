import { FileInterceptor } from '@nestjs/platform-express';
import { isNil } from '@util/isNil';
import { NoExistsUploadFileExceptionDto } from './dto/exception/no-exists-upload-file.exception.dto';
import { UnsupportedFileFormatExceptionDto } from './dto/exception/unsupported-file-format.exception.dto';

export const UploadFileInterceptor = (fileSize: number = 5 * 1024 * 1024) =>
  FileInterceptor('file', {
    limits: {
      fileSize,
    },
    fileFilter: (_req, file, callback) => {
      if (isNil(file)) {
        return callback(new NoExistsUploadFileExceptionDto(), false);
      }
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        const extension = file.originalname.split('.').pop();
        return callback(new UnsupportedFileFormatExceptionDto(extension), false);
      }
      callback(null, true);
    },
  });
