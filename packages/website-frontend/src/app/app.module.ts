import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, SchemaMetadata } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { RepositoriesComponent } from './repositories/repositories.component';
import { RepositoryComponent } from './repository/repository.component';
import { RepositoryModalComponent } from './repository/modal/modal.component';
import { RepositoryService } from './repository/repository.service';
import { OrganizationsService } from './services/organizations/organizations.service';
import { LoginComponent } from './login/login.component';
import { UserService } from './user/user.service';
import { UserComponent } from './user/user.component';
import { MenuComponent } from './menu/menu.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { routes } from './routes';
import { LoadingComponent } from './loading/loading.component';
import { DashboardTitleService } from './services/DashboardTitleService';
import { ShortExplanationComponent } from './short-explanation/short-explanation.component';
import { ReportComponent } from './report/report.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    RepositoriesComponent,
    RepositoryComponent,
    RepositoryModalComponent,
    LoginComponent,
    UserComponent,
    MenuComponent,
    WelcomeComponent,
    LoadingComponent,
    ShortExplanationComponent,
    ReportComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    RouterModule.forRoot(routes, { anchorScrolling: 'disabled', useHash: false })
  ],
  providers: [
    RepositoryService,
    UserService,
    OrganizationsService,
    DashboardTitleService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
