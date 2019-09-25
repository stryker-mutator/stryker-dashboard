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
import { routes } from './routes';
import { AuthComponent } from './auth/auth.component';
import { AuthHeaderInterceptor } from './auth/AuthHeaderInterceptor';
import { RepositoryModule } from './repository/repository.module';
import { SharedModule } from './shared/shared.module';
import { ReportModule } from './report/report.module';

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
    RouterModule.forRoot(routes, { anchorScrolling: 'disabled', useHash: false }),
    RepositoryModule,
    ReportModule,
    SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHeaderInterceptor, multi: true }
  ]
})
export class AppModule { }
