import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MembersComponent } from './members.component';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { RouterModule, Route } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DataViewModule,
    DialogModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
  ],
  declarations: [MembersComponent],
})
export class MembersModule {}
