import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { RepositoriesComponent } from './repositories/repositories.component';
import { RepositoryComponent } from './repository/repository.component';
import { RepositoryService } from './repository/repository.service';
import { LoginComponent } from './login/login.component';
import { UserService } from './user/user.service';

@NgModule({
  declarations: [
    AppComponent,
    RepositoriesComponent,
    RepositoryComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [ 
    RepositoryService, 
    UserService 
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
