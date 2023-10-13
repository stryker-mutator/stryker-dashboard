import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { MenuComponent } from './menu/menu.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthComponent } from './auth/auth.component';
import { AuthHeaderInterceptor } from './auth/AuthHeaderInterceptor';
import { RepositoryModule } from './repository/repository.module';
import { SharedModule } from './shared/shared.module';
import { ReportModule } from './report/report.module';
import { AppRouterModule } from './app-router.module';

/* Import preflight styles */
import "@stryker-mutator/ui-components/dist/style.css"
/* Node resolution inside angular project does not support importing by subpath exports, so we directly import the component export by file */
import "@stryker-mutator/ui-components/dist/exports/test";

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    MenuComponent,
    WelcomeComponent,
    AuthComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    AppRouterModule,
    RepositoryModule,
    ReportModule,
    SharedModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHeaderInterceptor,
      multi: true,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], /* Lit won't work otherwise */
})
export class AppModule {}
