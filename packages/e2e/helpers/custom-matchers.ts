import type { Expect, Locator } from '@playwright/test';

export const matchers = {
  toExist,
};

function sleep(n: number) {
  return new Promise((res) => setTimeout(res, n));
}

type MatchParameters<T extends (...args: any) => any> = Parameters<T> extends [
  any,
  ...infer R
]
  ? R
  : never;

type AsyncMatcherFn<T extends (...args: any) => any, R> = (
  ...args: MatchParameters<T>
) => Promise<R>;

export interface PlaywrightMatchers<R> {
  /**
   * Will ensure that the element is on the page.
   */
  toExist: AsyncMatcherFn<typeof toExist, R>;
}

function assertIsLocator(
  maybeLocator: unknown
): asserts maybeLocator is Locator {
  const isLocator =
    typeof maybeLocator === 'object' &&
    maybeLocator &&
    'elementHandles' in maybeLocator &&
    'waitFor' in maybeLocator;
  if (!isLocator) {
    throw new Error(`${maybeLocator} does not appear to be a locator`);
  }
}

async function toExist(
  this: ReturnType<Expect['getState']>,
  locator: unknown,
  options?: { timeout?: number }
) {
  assertIsLocator(locator);
  const timeout = options?.timeout ?? 5000;
  const before = new Date();
  let pass: boolean;
  do {
    const elements = await locator.elementHandles();
    if (elements.length > 1) {
      throw new Error(`Found ${elements.length} elements matching ${locator}`);
    }
    pass = (elements.length === 1) != this.isNot;
    if (!pass) {
      const n = 100;
      await sleep(n);
      if (new Date().getTime() - before.getTime() > timeout) {
        break;
      }
    }
  } while (!pass);

  return {
    pass: pass != this.isNot,
    message: () => {
      const not = this.isNot ? ' not' : '';
      const hint = this.utils.matcherHint('toExist', undefined, undefined, {
        isNot: this.isNot,
        promise: this.promise,
      });

      return hint + '\n\n' + `Expected locator to${not} exist: ${locator}`;
    },
  };
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace PlaywrightTest {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Matchers<R> extends PlaywrightMatchers<R> {}
  }
}
