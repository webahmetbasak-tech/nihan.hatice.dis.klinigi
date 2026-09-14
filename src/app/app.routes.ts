import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'hizmetler/:id',
    loadComponent: () => import('./features/services/service-detail.page').then((m) => m.ServiceDetailPage),
  },
  {
    path: 'kvkk',
    loadComponent: () => import('./features/legal/kvkk.page').then((m) => m.KvkkPage),
  },
  {
    path: '**',
    loadComponent: () => import('./features/legal/not-found.page').then((m) => m.NotFoundPage),
  },
];
