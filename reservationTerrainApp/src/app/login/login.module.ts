import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from '../login/login.component';
import { DialogModule } from 'primeng/dialog';
import { RouterModule, Route } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ToastModule} from 'primeng/toast';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule
  ],
  declarations: [LoginComponent],
})
export class LoginModule {}
