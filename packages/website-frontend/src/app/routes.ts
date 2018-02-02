import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { RepositoriesComponent } from './repositories/repositories.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', component: WelcomeComponent },
    { path: ':login/repositories', component: RepositoriesComponent },
];
