import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { RepositoriesComponent } from './repositories/repositories.component';
import { ReportComponent } from './report/report.component';

export const routes: Routes = [
  { path: 'me/:login/repositories', component: RepositoriesComponent },
  { path: 'report/:provider/:owner/:name', component: ReportComponent },
  { path: 'report/:provider/:owner/:name/:branch', component: ReportComponent },
  { path: 'report/:provider/:owner/:name/:branch/:label', component: ReportComponent },
  { path: '', pathMatch: 'full', component: WelcomeComponent },
];
