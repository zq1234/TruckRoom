import { Routes } from '@angular/router';
import { TruckServiceListComponent } from './components/truckservice-list/truckservice-list.component';
import { TruckServiceFormComponent } from './components/truckservice-form/truckservice-form.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  {
    path: "",
    component: TruckServiceListComponent,
  },
  {
    path: 'servicelist',
    component: TruckServiceListComponent,
  },
  {
    path: 'createservice',
    component: TruckServiceFormComponent,
  },
  {
    path: 'editservice/:id',
    component: TruckServiceFormComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
