import os from 'os';
import { isArray } from 'lodash';
import { Pattern } from './types';

export function isTruthy<T>(x: T | undefined | null): x is T {
  return x !== undefined && x !== null;
}

export function isPattern(maybePattern: any): maybePattern is Pattern {
  return typeof maybePattern === 'string' || isArray(maybePattern);
}

export const strigifyJson = (object: Record<string, any>) =>
  JSON.stringify(object, null, 2).replace(/\n/g, os.EOL) + os.EOL;
