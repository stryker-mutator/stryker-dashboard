import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

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

@NgModule({ bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        LoginComponent,
        UserComponent,
        MenuComponent,
        WelcomeComponent,
        AuthComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA], imports: [BrowserModule,
        AppRouterModule,
        RepositoryModule,
        ReportModule,
        SharedModule], providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthHeaderInterceptor,
            multi: true,
        },
        HttpClient,
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule {}
