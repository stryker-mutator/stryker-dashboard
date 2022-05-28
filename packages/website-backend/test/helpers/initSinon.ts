import { PlatformTest } from '@tsed/common';
import * as sinon from 'sinon';

afterEach(async () => {
  await PlatformTest.reset();
  sinon.restore();
});
