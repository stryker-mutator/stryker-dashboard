import { init, getCurrent } from '../lib/browser';

before(async () => {
  await init();
});

after(async () => {
  await getCurrent().close();
});
