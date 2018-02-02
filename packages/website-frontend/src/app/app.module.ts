import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { RepositoriesComponent } from './repositories/repositories.component';
import { RepositoryComponent } from './repository/repository.component';
import { RepositoryModalComponent } from './repository/modal/modal.component';
import { RepositoryService } from './repository/repository.service';
import { OrganizationsService } from './organizations/organizations.service';
import { LoginComponent } from './login/login.component';
import { UserService } from './user/user.service';
import { UserComponent } from './user/user.component';
import { MenuComponent } from './menu/menu.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { routes } from './routes';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    RepositoriesComponent,
    RepositoryComponent,
    RepositoryModalComponent,
    LoginComponent,
    UserComponent,
    MenuComponent,
    WelcomeComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  providers: [
    RepositoryService,
    UserService,
    OrganizationsService
  ]
})
export class AppModule { }
