import { instanceToPlain } from 'class-transformer';
import 'reflect-metadata';
import { isNil } from './isNil';

function getActualType(typeOrThunk: any): any {
  if (typeof typeOrThunk === 'function') {
    try {
      return typeOrThunk();
    } catch {
      return undefined;
    }
  }
  return typeOrThunk;
}

// 기본 타입 여부 체크
function isPrimitive(type: any): boolean {
  return [String, Number, Boolean, Array, Object].includes(type);
}

export function extractExampleFromDto<T extends object>(dto: new () => T): { example: Record<string, any>; nestedRefs: (new () => any)[] } {
  const prototype = dto.prototype;
  const instance = new dto();
  const plainInstance = instanceToPlain(instance);
  const keys = Object.keys(plainInstance);

  if (keys.length === 0) {
    return { example: {}, nestedRefs: [] };
  }

  const example: Record<string, any> = {};
  const nestedRefs: (new () => any)[] = [];

  for (const key of keys) {
    const propertyMeta = Reflect.getMetadata('swagger/apiModelProperties', prototype, key) || {};
    const rawType = getActualType(propertyMeta?.type);

    if (!isNil(propertyMeta?.example)) {
      example[key] = key === 'message' ? propertyMeta.example : plainInstance[key];
    } else if (rawType && !isPrimitive(rawType)) {
      // 클래스 타입인지 확인 (constructor가 있고 prototype이 있는지)
      if (typeof rawType === 'function' && rawType.prototype && rawType.prototype.constructor === rawType) {
        nestedRefs.push(rawType);

        try {
          const { example: nestedExample } = extractExampleFromDto(rawType);
          example[key] = nestedExample;
        } catch (error) {
          console.warn(`Failed to extract example from ${rawType.name}:`, error);
          example[key] = {};
        }
      } else {
        example[key] = propertyMeta.example;
      }
    } else {
      example[key] = plainInstance[key];
    }
  }

  return { example, nestedRefs };
}
