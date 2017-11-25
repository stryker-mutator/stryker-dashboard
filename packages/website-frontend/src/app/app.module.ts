import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './components/app.component';
import { RepositoriesComponent } from './components/repositories/repositories.component';
import { RepositoryComponent } from './components/repository/repository.component';
import { RepositoryService } from './services/repository/repository.service';

@NgModule({
  declarations: [
    AppComponent,
    RepositoriesComponent,
    RepositoryComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [ RepositoryService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
