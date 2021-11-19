import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {Clubschedule} from './clubschedule.component';
import {ScheduleRoutingModule} from './clubschedule.router';
//import { ScheduleModule } from 'primeng/schedule';
import {FullCalendarModule} from '@fullcalendar/angular';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {CalendarModule} from 'primeng/calendar';
import {CheckboxModule} from 'primeng/checkbox';
import {DropdownModule} from 'primeng/dropdown';
import {ButtonModule} from 'primeng/button';
import {TabViewModule} from 'primeng/tabview';
import { CodeHighlighterModule } from 'primeng/codehighlighter';


FullCalendarModule.registerPlugins([
    dayGridPlugin,timeGridPlugin, interactionPlugin
]);

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
		CommonModule,
        FormsModule,
		ScheduleRoutingModule,
        FullCalendarModule,
        DialogModule,
        InputTextModule,
        CalendarModule,
        CheckboxModule,
        DropdownModule,
        ButtonModule,
        TabViewModule,
        CodeHighlighterModule
	],
	declarations: [
		Clubschedule
	]
})
export class ClubscheduleModule {}
