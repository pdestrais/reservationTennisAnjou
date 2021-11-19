import { RouterModule, Route } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AuthGuard } from './service/auth.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { MembersComponent } from './members/members.component';

const routes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'home'},
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'members', canActivate: [AuthGuard], component: MembersComponent },
//  { loadChildren: 'app/dashboard/dashboard.module#DashboardModule', path: 'dashboard' },
//  { loadChildren: 'app/profile/profile.module#ProfileModule', path: 'profile' },
//  { loadChildren: 'app/weather/weather.module#WeatherModule', path: 'weather' },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }

];

export const AppRoutingModule: ModuleWithProviders<RouterModule> = RouterModule.forRoot(
  routes,
  {
    useHash: true
  }
);
