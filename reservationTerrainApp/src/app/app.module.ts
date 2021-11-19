import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.router';
//import { effects, store, instrumentation } from './store';
import { SharedModule } from './shared/shared.module';
import { ClubscheduleModule } from './clubschedule/clubschedule.module';
//import { WeatherService } from './weather/weather.service';
import { MembersModule } from './members/members.module';

import { AlertComponent } from './alert/alert.component';
import { AuthGuard } from './service/auth.guard';
import { AlertService } from './service/alert.service';
import { AuthenticationService } from './service/authentication.service';
import { DataService } from './service/data.service';
import { UserService } from './service/user.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { EventService } from './service/event.service';
import { HomeComponent } from './home/home.component';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ClubscheduleModule,
    MembersModule,
    InputTextModule,
    ButtonModule,
  ],
  providers: [
    DataService,
    EventService,
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
