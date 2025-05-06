import { isNil } from './isNil';

type ReturnType<Type> = Type extends BooleanConstructor
  ? boolean
  : Type extends NumberConstructor
    ? number
    : Type extends StringConstructor
      ? string
      : never;

export const envConsumer = (envs: NodeJS.ProcessEnv) => {
  const getEnvAs = <
    Type extends BooleanConstructor | NumberConstructor | StringConstructor,
    Return extends ReturnType<Type>,
  >(
    type: Type,
    propertyName: string,
    defaultValue?: Return,
  ): Return => {
    const value = envs[propertyName];

    if (isNil(value)) {
      if (defaultValue) {
        return defaultValue;
      }

      throw new Error(`"${propertyName}" 환경 변수가 정의되지 않았습니다.`);
    }

    try {
      if (type === Boolean) return !!JSON.parse(value) as Return;
      if (type === Number) return parseInt(value) as Return;
      if (type === String) return value as Return;
    } catch (error) {
      console.error('Env parse error:', error);
    }

    throw new Error(`지원하지 않는 변환 타입입니다. [${type}]`);
  };

  return getEnvAs;
};
