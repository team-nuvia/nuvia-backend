import { ForbiddenAccessExceptionDto } from '@common/dto/exception/forbidden-access.exception.dto';
import { DEFAULT_BLACK_LIST_IPS } from '@common/variable/globals';

export const calculateIpRange = (clientIp: IpAddress) => {
  const isIncluded = DEFAULT_BLACK_LIST_IPS.includes(clientIp);
  if (clientIp === '::1') {
    if (isIncluded) throw new ForbiddenAccessExceptionDto();
  } else {
    for (const blackIp of DEFAULT_BLACK_LIST_IPS) {
      const octets = blackIp.split('.');
      const clientOctets = clientIp.split('.');
      const isMatchIp = octets.includes('x');
      if (isMatchIp) {
        const index = octets.indexOf('x');
        const isMatchRange = clientOctets.slice(index, index + 1).join('.') === octets.slice(index, index + 1).join('.');
        if (isMatchRange) {
          throw new ForbiddenAccessExceptionDto();
        }
      }
    }
    if (isIncluded) throw new ForbiddenAccessExceptionDto();
  }
  return null;
};
