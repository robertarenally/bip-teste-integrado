import { Routes } from '@angular/router';
import { BeneficioListComponent } from './features/beneficios/pages/benefico-list/beneficio-list.component';
import { DashboardComponent } from './features/beneficios/pages/dashboard/dashboard.component';
import { TransferenciaComponent } from './features/beneficios/pages/transferencia/transferencia.component';

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
    path: 'transferencias',
    component: TransferenciaComponent,
    title: 'Transferências'
  },
  {
    path: '**',
    redirectTo: ''
  }
];