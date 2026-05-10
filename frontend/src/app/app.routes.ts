import { Routes } from '@angular/router';
import { DashboardComponent } from './features/beneficios/pages/dashboard/dashboard.component';
import { BeneficioListComponent } from './features/beneficios/pages/benefico-list/beneficio-list.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    title: 'Dashboard'
  },
  {
    path: 'beneficios',
    component: BeneficioListComponent,
    title: 'Benefícios'
  },
  {
    path: '**',
    redirectTo: ''
  }
];