import { RouterModule, Route } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { Clubschedule } from './clubschedule.component';
import { AuthGuard } from '../service/auth.guard'


const routes: Route[] = [
  {
   path: 'schedule', canActivate: [AuthGuard], component: Clubschedule
  }
];

export const ScheduleRoutingModule: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);