import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

/* Import preflight styles */
/* Node resolution inside angular project does not support importing by subpath exports, so we directly import the component export by file */
// import "@stryker-mutator/ui-components/dist/exports/profile-button";
// import "@stryker-mutator/ui-components/dist/exports/sign-in-button";

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
