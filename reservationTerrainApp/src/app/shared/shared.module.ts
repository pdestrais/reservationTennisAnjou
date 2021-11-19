import { NgModule } from '@angular/core';

import {
  ModalComponent,
  ModalDirectivesDirective,
} from './modal/modal.component';
import { CommonModule } from '@angular/common';
import { TopNavigationComponent } from './top-navigation/top-navigation.component';
import { RouterModule } from '@angular/router';
import { SubNavigationComponent } from './sub-navigation/sub-navigation.component';
import { NotesComponent } from './notes/notes.component';
import { ButtonComponent } from './button/button.component';
import { InputComponent } from './input/input.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CardComponent } from './card/card.component';
import { LoaderComponent } from './loader/loader.component';

import { TabMenuModule } from 'primeng/tabmenu';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { NgIfMediaQuery } from '../directive/if-media-query.directive';

@NgModule({
  declarations: [
    ModalComponent,
    TopNavigationComponent,
    SubNavigationComponent,
    ModalDirectivesDirective,
    CardComponent,
    ButtonComponent,
    LoaderComponent,
    InputComponent,
    NotesComponent,
    NgIfMediaQuery,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TabMenuModule,
    ButtonModule,
    ToolbarModule,
  ],
  exports: [
    ModalComponent,
    ModalDirectivesDirective,
    TopNavigationComponent,
    LoaderComponent,
    CardComponent,
    ButtonComponent,
    InputComponent,
    SubNavigationComponent,
    NotesComponent,
  ],
})
export class SharedModule {}
