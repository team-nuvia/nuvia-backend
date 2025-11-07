import crypto from 'crypto';

const toBase64Url = (buf: Buffer) => buf.toString('base64').replace(/\+g/, '-').replace(/\//g, '_').replace(/=+$/g, '');

const fromBase64Url = (str: string) =>
  Buffer.from(
    str
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(str.length + (str.length % 4), '='),
    'base64',
  );

const getKey = () => {
  const secret = process.env.SECRET_SWAGGER_ENCRYPT as string;
  const salt = process.env.SECRET_SWAGGER_SALT as string;
  return crypto.scryptSync(secret, salt, 32);
};

export const encryptSwagger = (text: string) => {
  const key = getKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const cipherText = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const token = Buffer.concat([iv, cipherText]);
  return toBase64Url(token);
};

export const decryptSwagger = (token: string) => {
  const key = getKey();
  const data = fromBase64Url(token);
  // if (data.length <= 16) throw new Error('Invalid token');
  if (data.length <= 16) return false;
  const iv = data.subarray(0, 16);
  const cipherText = data.subarray(16);

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(cipherText), decipher.final()]);
  return decrypted.toString('utf8');
};
/**
 * "Invalid initialization vector" 에러는 암호화/복호화할 때 IV(initialization vector, 초기화 벡터) 값의 길이가
 * 암호화 알고리즘이 요구하는 byte 수(여기선 16 바이트(aes-256-cbc))와 맞지 않거나, 올바른 형식이 아닐 때 발생합니다.
 *
 * 아래 코드에서 복호화 시 IV를 만드는 부분:
 *   const iv = Buffer.from(text.slice(0, 16), 'base64url');
 * 문제가 될 수 있는 부분:
 * - 암호화된 text의 앞 16글자가 실제로 16 bytes가 아닐 수 있습니다.
 * - base64url로 인코딩된 iv는 반드시 16 bytes가 되어야 합니다(복호화시).
 *
 * 일반적으로 암호화 시 IV(16 bytes)를 붙이고, 전체를 base64url로 인코딩하는 게 맞지만,
 * 복호화 시에는 base64url로 디코딩 후 0~15번째까지가 IV, 그 뒤가 암호문이어야 합니다.
 *
 * 올바른 복호화 코드는 아래와 같습니다:
 *   const buf = Buffer.from(text, 'base64url');
 *   const iv = buf.subarray(0, 16);
 *   const encrypted = buf.subarray(16);
 *
 * 즉, slice로 자르는게 아니라, base64url 전체를 디코드한 뒤, 16바이트씩 나눠야 합니다.
 *
 * 예시 코드
 * ------------------------------
 * const buf = Buffer.from(text, 'base64url');
 * const iv = buf.subarray(0, 16);
 * const encrypted = buf.subarray(16);
 * ------------------------------
 *
 * 해당 에러가 뜰 때는 위 방식을 적용하세요.
 */
