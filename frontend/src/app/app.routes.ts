import { Routes } from '@angular/router';
import { DashboardComponent } from './features/beneficios/pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    title: 'Dashboard'
  },
  {
    path: '**',
    redirectTo: ''
  }
];