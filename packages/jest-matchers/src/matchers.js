/**
 * Copyright (c) 2014, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */
 /* eslint-disable max-len */

'use strict';

import type {MatchersObject} from './types';

const diff = require('jest-diff');
const {escapeStrForRegex} = require('jest-util');
const {
  EXPECTED_COLOR,
  RECEIVED_COLOR,
  ensureNoExpected,
  ensureNumbers,
  getType,
  matcherHint,
  printReceived,
  printExpected,
} = require('jest-matcher-utils');

const equals = global.jasmine.matchersUtil.equals;

const hasIterator = object => !!(object != null && object[Symbol.iterator]);
const iterableEquality = (a, b) => {
  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    Array.isArray(a) ||
    Array.isArray(b) ||
    !hasIterator(a) ||
    !hasIterator(b)
  ) {
    return undefined;
  }
  if (a.constructor !== b.constructor) {
    return false;
  }
  const bIterator = b[Symbol.iterator]();

  for (const aValue of a) {
    const nextB = bIterator.next();
    if (
      nextB.done ||
      !global.jasmine.matchersUtil.equals(
        aValue,
        nextB.value,
        [iterableEquality],
      )
    ) {
      return false;
    }
  }
  if (!bIterator.next().done) {
    return false;
  }
  return true;
};

const matchers: MatchersObject = {
  toBe(received: any, expected: number) {
    const pass = received === expected;

    const message = pass
      ?  () => matcherHint('.not.toBe') + '\n\n' +
        `Expected value to not be (using ===):\n` +
        `  ${printExpected(expected)}\n` +
        `Received:\n` +
        `  ${printReceived(received)}`
      : () => {
        const diffString = diff(expected, received);
        return matcherHint('.toBe') + '\n\n' +
        `Expected value to be (using ===):\n` +
        `  ${printExpected(expected)}\n` +
        `Received:\n` +
        `  ${printReceived(received)}` +
        (diffString ? `\n\nDifference:\n\n${diffString}` : '');
      };

    return {message, pass};
  },

  toEqual(received: any, expected: any) {
    const pass = equals(received, expected, [iterableEquality]);

    const message = pass
      ?  () => matcherHint('.not.toEqual') + '\n\n' +
        `Expected value to not equal:\n` +
        `  ${printExpected(expected)}\n` +
        `Received:\n` +
        `  ${printReceived(received)}`
      : () => {
        const diffString = diff(expected, received);
        return matcherHint('.toEqual') + '\n\n' +
        `Expected value to equal:\n` +
        `  ${printExpected(expected)}\n` +
        `Received:\n` +
        `  ${printReceived(received)}` +
        (diffString ? `\n\nDifference:\n\n${diffString}` : '');
      };

    return {message, pass};
  },

  toBeTruthy(actual: any, expected: void) {
    ensureNoExpected(expected, 'toBeTruthy');
    const pass = !!actual;
    const message = pass
      ? matcherHint('.not.toBeTruthy', 'received', '') + '\n\n' +
        `Expected value not to be truthy, instead received\n` +
        `  ${printReceived(actual)}`
      : matcherHint('.toBeTruthy', 'received', '') + '\n\n' +
        `Expected value to be truthy, instead received\n` +
        `  ${printReceived(actual)}`;
    return {message, pass};
  },

  toBeFalsy(actual: any, expected: void) {
    ensureNoExpected(expected, 'toBeFalsy');
    const pass = !actual;
    const message = pass
      ? matcherHint('.not.toBeFalsy', 'received', '') + '\n\n' +
        `Expected value not to be falsy, instead received\n` +
        `  ${printReceived(actual)}`
      : matcherHint('.toBeFalsy', 'received', '') + '\n\n' +
        `Expected value to be falsy, instead received\n` +
        `  ${printReceived(actual)}`;
    return {message, pass};
  },

  toBeNaN(actual: any, expected: void) {
    ensureNoExpected(expected, 'toBeNaN');
    const pass = Number.isNaN(actual);
    const message = pass
      ? matcherHint('.not.toBeNaN', 'received', '') + '\n\n' +
        `Expected value not to be NaN, instead received\n` +
        `  ${printReceived(actual)}`
      : matcherHint('.toBeNaN', 'received', '') + '\n\n' +
        `Expected value to be NaN, instead received\n` +
        `  ${printReceived(actual)}`;
    return {message, pass};
  },

  toBeNull(actual: any, expected: void) {
    ensureNoExpected(expected, 'toBeNull');
    const pass = actual === null;
    const message = pass
      ? matcherHint('.not.toBeNull', 'received', '') + '\n\n' +
        `Expected value not to be null, instead received\n` +
        `  ${printReceived(actual)}`
      : matcherHint('.toBeNull', 'received', '') + '\n\n' +
        `Expected value to be null, instead received\n` +
        `  ${printReceived(actual)}`;
    return {message, pass};
  },

  toBeDefined(actual: any, expected: void) {
    ensureNoExpected(expected, 'toBeDefined');
    const pass = actual !== void 0;
    const message = pass
      ? matcherHint('.not.toBeDefined', 'received', '') + '\n\n' +
        `Expected value not to be defined, instead received\n` +
        `  ${printReceived(actual)}`
      : matcherHint('.toBeDefined', 'received', '') + '\n\n' +
        `Expected value to be defined, instead received\n` +
        `  ${printReceived(actual)}`;
    return {message, pass};
  },

  toBeUndefined(actual: any, expected: void) {
    ensureNoExpected(expected, 'toBeUndefined');
    const pass = actual === void 0;
    const message = pass
      ? matcherHint('.not.toBeUndefined', 'received', '') + '\n\n' +
        `Expected value not to be undefined, instead received\n` +
        `  ${printReceived(actual)}`
      : matcherHint('.toBeUndefined', 'received', '') + '\n\n' +
        `Expected value to be undefined, instead received\n` +
        `  ${printReceived(actual)}`;

    return {message, pass};
  },

  toBeGreaterThan(actual: number, expected: number) {
    ensureNumbers(actual, expected, '.toBeGreaterThan');
    const pass = actual > expected;
    const message = pass
      ? matcherHint('.not.toBeGreaterThan') + '\n\n' +
        `Expected value not to be greater than:\n` +
        `  ${printExpected(expected)}\n` +
        `Received:\n` +
        `  ${printReceived(actual)}`
      : matcherHint('.toBeGreaterThan') + '\n\n' +
        `Expected value to be greater than:\n` +
        `  ${printExpected(expected)}\n` +
        `Received:\n` +
        `  ${printReceived(actual)}`;
    return {message, pass};
  },

  toBeGreaterThanOrEqual(actual: number, expected: number) {
    ensureNumbers(actual, expected, '.toBeGreaterThanOrEqual');
    const pass = actual >= expected;
    const message = pass
      ? matcherHint('.not.toBeGreaterThanOrEqual') + '\n\n' +
        `Expected value not to be greater than or equal:\n` +
        `  ${printExpected(expected)}\n` +
        `Received:\n` +
        `  ${printReceived(actual)}`
      : matcherHint('.toBeGreaterThanOrEqual') + '\n\n' +
        `Expected value to be greater than or equal:\n` +
        `  ${printExpected(expected)}\n` +
        `Received:\n` +
        `  ${printReceived(actual)}`;
    return {message, pass};
  },

  toBeLessThan(actual: number, expected: number) {
    ensureNumbers(actual, expected, '.toBeLessThan');
    const pass = actual < expected;
    const message = pass
      ? matcherHint('.not.toBeLessThan') + '\n\n' +
        `Expected value not to be less than:\n` +
        `  ${printExpected(expected)}\n` +
        `Received:\n` +
        `  ${printReceived(actual)}`
      : matcherHint('.toBeLessThan') + '\n\n' +
        `Expected value to be less than:\n` +
        `  ${printExpected(expected)}\n` +
        `Received:\n` +
        `  ${printReceived(actual)}`;
    return {message, pass};
  },

  toBeLessThanOrEqual(actual: number, expected: number) {
    ensureNumbers(actual, expected, '.toBeLessThanOrEqual');
    const pass = actual <= expected;
    const message = pass
      ? matcherHint('.not.toBeLessThanOrEqual') + '\n\n' +
        `Expected value not to be less than or equal:\n` +
        `  ${printExpected(expected)}\n` +
        `Received:\n` +
        `  ${printReceived(actual)}`
      : matcherHint('.toBeLessThanOrEqual') + '\n\n' +
        `Expected value to be less than or equal:\n` +
        `  ${printExpected(expected)}\n` +
        `Received:\n` +
        `  ${printReceived(actual)}`;
    return {message, pass};
  },

  toContain(collection: Array<any> | string, value: any) {
    const collectionType = getType(collection);
    if (!Array.isArray(collection) && typeof collection !== 'string') {
      throw new Error(
        `.toContain() only works with arrays and strings. ${typeof collection}: ${printReceived(collection)} was passed.`,
      );
    }

    const pass = collection.indexOf(value) != -1;
    const message = pass
      ? () => matcherHint('.not.toContain', collectionType, 'value') + '\n\n' +
        `Expected ${collectionType}:\n` +
        `  ${printReceived(collection)}\n` +
        `Not to contain value:\n` +
        `  ${printExpected(value)}\n`
      : () => matcherHint('.toContain', collectionType, 'value') + '\n\n' +
        `Expected ${collectionType}:\n` +
        `  ${printReceived(collection)}\n` +
        `To contain value:\n` +
        `  ${printExpected(value)}`;

    return {message, pass};
  },

  toBeCloseTo(actual: number, expected: number, precision?: number = 2) {
    ensureNumbers(actual, expected, '.toBeCloseTo');
    const pass = Math.abs(expected - actual) < (Math.pow(10, -precision) / 2);
    const message = pass
      ? () => matcherHint('.not.toBeCloseTo', 'received', 'expected, precision') + '\n\n' +
        `Expected value not to be close to (with ${printExpected(precision)}-digit precision):\n` +
        `  ${printExpected(expected)}\n` +
        `Received: \n` +
        `  ${printReceived(actual)}`
      : () => matcherHint('.toBeCloseTo', 'received', 'expected, precision') + '\n\n' +
        `Expected value to be close to (with ${printExpected(precision)}-digit precision):\n` +
        `  ${printExpected(expected)}\n` +
        `Received: \n` +
        `  ${printReceived(actual)}`;

    return {message, pass};
  },

  toMatch(received: string, expected: string | RegExp) {
    if (typeof received !== 'string') {
      throw new Error(
        matcherHint('[.not].toMatch', 'string', 'expected') + '\n\n' +
        `${RECEIVED_COLOR('string')} value should be a string.\n` +
        `Received:\n` +
        `  ${getType(received)}: ${printReceived(received)}`,
      );
    }

    const isString = typeof expected == 'string';
    if (!(expected instanceof RegExp) && !isString) {
      throw new Error(
        matcherHint('[.not].toMatch', 'string', 'expected') + '\n\n' +
        `${EXPECTED_COLOR('expected')} value should be a string or a regular expression.\n` +
        `Received:\n` +
        `  ${getType(expected)}: ${printExpected(expected)}`,
      );
    }

    const pass = new RegExp(isString ? escapeStrForRegex(expected) : expected)
      .test(received);
    const message = pass
      ? () => matcherHint('.not.toMatch') +
        `\n\nExpected value not to match:\n` +
        `  ${printExpected(expected)}` +
        `\nReceived:\n` +
        `  ${printReceived(received)}`
      : () => matcherHint('.toMatch') +
        `\n\nExpected value to match:\n` +
        `  ${printExpected(expected)}` +
        `\nReceived:\n` +
        `  ${printReceived(received)}`;

    return {message, pass};
  },
};

module.exports = matchers;