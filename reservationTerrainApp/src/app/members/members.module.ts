import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MembersComponent } from './members.component';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { RouterModule, Route } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DataViewModule,
    DialogModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    ConfirmPopupModule,
    ConfirmDialogModule,
  ],
  declarations: [MembersComponent],
  providers: [ConfirmationService],
})
export class MembersModule {}
