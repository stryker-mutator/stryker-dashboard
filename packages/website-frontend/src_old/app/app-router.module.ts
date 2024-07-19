import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { ReportPageComponent } from './report/report-page/report-page.component';
import { AuthComponent } from './auth/auth.component';
import { RepositoryPageComponent } from './repository/repository-page/repository-page.component';
import { AuthenticatedGuard } from './auth/authenticated-guard';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'repos/:owner',
    component: RepositoryPageComponent,
    canActivate: [AuthenticatedGuard],
  },
  {
    path: 'reports',
    children: [{ path: '**', component: ReportPageComponent }],
  },
  { path: '', pathMatch: 'full', component: WelcomeComponent },
  {
    path: 'auth/:provider/callback',
    pathMatch: 'full',
    component: AuthComponent,
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'disabled',
      useHash: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRouterModule {}
