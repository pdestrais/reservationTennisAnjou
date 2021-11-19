import { Component, OnInit, SimpleChange, OnChanges } from '@angular/core';
import { EventService } from '../service/event.service';
import { AlertService } from '../service/alert.service';

import { Router } from '@angular/router';

import moment from 'moment';
//import * as moment from 'moment/moment';
//import { Moment } from 'moment/moment';

import { Event } from '../model/event';
import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking
import { Calendar, EventApi } from '@fullcalendar/core'; // useful for typechecking
import frLocale from '@fullcalendar/core/locales/fr';

@Component({
  templateUrl: './clubschedule.component.html',
  styleUrls: ['./clubschedule.component.css'],
})
export class Clubschedule implements OnInit {
  events: any[] = [];
  options: CalendarOptions = {};
  header: any;

  event: Event = new Event();
  startDate: string = '';
  startTime: string = '';

  defaultDate: string = moment().format('YYYY-MM-DD');

  dialogVisible: boolean = false;
  loading: boolean = false;

  allowToModify: boolean = true;
  deepChange: boolean = true;

  times: any[] = [
    { label: '09:00', value: '09:00:00' },
    { label: '10:00', value: '10:00:00' },
    { label: '11:00', value: '11:00:00' },
    { label: '12:00', value: '12:00:00' },
    { label: '13:00', value: '13:00:00' },
    { label: '14:00', value: '14:00:00' },
    { label: '15:00', value: '15:00:00' },
    { label: '16:00', value: '16:00:00' },
    { label: '17:00', value: '17:00:00' },
    { label: '18:00', value: '18:00:00' },
    { label: '19:00', value: '19:00:00' },
    { label: '20:00', value: '20:00:00' },
    { label: '21:00', value: '21:00:00' },
    { label: '22:00', value: '22:00:00' },
  ];

  idGen: number = 100;

  public displayBasic: boolean = false;

  constructor(
    private eventService: EventService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit() {
    //    if (!this.events) {
    let nowStart = moment().subtract(6, 'M');
    let nowEnd = moment().add(6, 'M');
    this.eventService.getAllEvents().then((events) => {
      this.events = events;
      this.events.map((event) => (event.id = event._id));
      console.log('fetched events : ' + JSON.stringify(this.events));
      this.options = {
        initialDate: '2021-01-01',
        initialView: 'dayGridWeek',
        slotDuration: '01:00:00',
        slotMinTime: '06:00:00',
        slotMaxTime: '23:00:00',
        slotEventOverlap: false,
        eventOverlap: false,
        height: 600,
        dateClick: this.handleDayClick.bind(this),
        eventDrop: this.handleEventMove.bind(this),
        //          select: this.handleDateSelect.bind(this),
        eventClick: this.handleEventClick.bind(this),
        //          eventsSet: this.handleEvents.bind(this),
        //    eventAdd:this.eventAdd.bind(this),
        //          eventChange: this.eventChange.bind(this),
        //    eventRemove:this.eventRemove.bind(this),
        headerToolbar: {
          right: 'prev,next,today',
          center: 'title',
          left: 'dayGridMonth,timeGridWeek,timeGridDay',
        },
        editable: true,
        eventStartEditable: true,
        eventDurationEditable: false,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        locale: frLocale,
        events: this.events,
      };
    });
    //    }
  }

  get endDate() {
    return this.startDate;
  }

  get endTime() {
    return moment(this.startDate + 'T' + this.startTime, 'YYYY-MM-DDTHH:mm:ss')
      .add(1, 'h')
      .format('HH:mm:SS');
  }
  showBasicDialog() {
    this.displayBasic = true;
  }

  /*   handleDateSelect(e: any) {
    console.log("handleDateSelect fired - " + JSON.stringify(e));
  }

  handleEvents(e: any) {
    console.log("handleEvents fired - " + JSON.stringify(e));
  }

    eventAdd(e: any) {
    console.log("eventAdd fired - " + JSON.stringify(e));
  }

    eventChange(e: any) {
    console.log("eventChange fired - " + JSON.stringify(e));
  }
  eventRemove(e: any) {
    console.log("eventRemove fired - " + JSON.stringify(e));
  }

  handleTimeChanges(e: any) {
/*     this.endTime = moment(this.startDate + 'T' + this.startTime)
      .add(1, 'h')
      .format('HH:mm:SS');
    this.endDate = this.startDate;
 */ /*}
   */

  handleDayClick(event: any) {
    console.log('handleDayClick fired - ' + JSON.stringify(event));
    this.event = new Event();
    this.event.title = JSON.parse(
      localStorage.getItem('currentUser')!
    ).lastname;
    if (event.view.type == 'dayGridMonth') {
      this.startDate = moment(event.date).format('YYYY-MM-DD');
      //      this.endDate = this.startDate;
      this.startTime = '09:00:00';
      //      this.endTime = '10:00:00';
    } else {
      let tmpDate = moment(event.date);
      this.startDate = tmpDate.format('YYYY-MM-DD');
      //      this.endDate = this.startDate;
      this.startTime = tmpDate.format('HH:mm:SS');
      //      this.endTime = tmpDate.add(1, 'h').format('HH:mm:SS');
    }
    this.dialogVisible = true;
    this.allowToModify = true;
  }

  handleEventMove(e: any) {
    console.log('eventMove fired - ' + JSON.stringify(e));
    this.event = new Event();
    this.event.title = e.event.title;
    this.event.start = e.event.start;
    this.event.end = e.event.end;
    this.event._id = e.event.extendedProps._id;
    this.event._rev = e.event.extendedProps._rev;
    this.eventService.deleteEvent(this.event).then(
      (data: any) => {
        console.log('event deleted');
        delete this.event._id;
        delete this.event._rev;
        this.createEvent();
        /*                 this.eventService.createEvent(this.event).then(
      (data: any) => {
        this.events.push(this.event);
        this.options.events = this.events;
        console.log('event stored');
        this.alertService.success('Enregistrement réussi', true);
      },
      (error: any) => {
        console.log('problem storing event');
        this.alertService.error(error);
        this.loading = false;
      }
    );
 */
      },
      (error: any) => {
        this.alertService.error(error);
        this.loading = false;
      }
    );
  }

  handleEventClick(e: any) {
    console.log('eventClick fired - ' + JSON.stringify(e));
    this.event = new Event();
    this.event.title = e.event.title;
    this.startDate = moment(e.event.start).format('YYYY-MM-DD');
    this.startTime = moment(e.event.start).format('HH:mm:SS');
    //    this.endDate = moment(e.event.end).format('YYYY-MM-DD');
    //    this.endTime = moment(e.event.end).format('HH:mm:SS');
    this.event._id = e.event.extendedProps._id;
    this.event._rev = e.event.extendedProps._rev;
    this.event.id = this.event._id;
    //this.event._rev = e.event._rev;
    if (
      this.event.title ==
      JSON.parse(localStorage.getItem('currentUser')!).lastname
    )
      this.allowToModify = true;
    else this.allowToModify = false;
    this.dialogVisible = true;
  }

  saveEvent() {
    this.event.start = this.startDate + 'T' + this.startTime;
    this.event.end = this.endDate + 'T' + this.endTime;
    // Check that no overlap exist with other event
    let overlap: boolean = false;
    for (let i = 0; i < this.events.length; i++) {
      //if overlap
      if (
        !(this.event.id == this.events[i]._id) &&
        !(
          this.event.start >= this.events[i].end ||
          this.event.end <= this.events[i].start
        )
      ) {
        overlap = true;
        break;
      } else {
        continue;
      }
    }
    if (overlap) {
      this.dialogVisible = false;
      this.alertService.error(
        'votre réservation est en conflit avec une autre réservation',
        true
      );
    } else {
      //new event
      this.loading = true;
      if (!this.event._id) {
        this.createEvent();
        /*       this.eventService.createEvent(this.event).then(
      (data: any) => {
        //this.events.push(this.event);
        //this.options.events = this.events;
        console.log('event stored');
        this.alertService.success('Enregistrement réussi', true);
      },
      (error: any) => {
        console.log('problem storing event');
        this.alertService.error(error);
        this.loading = false;
      }
    );
 */
      }
      //update
      else {
        //When an event is updated, this means that it's start or end is changed. As those values are used in the doc_id, we have to suppress the document and create a new one.
        this.eventService.deleteEvent(this.event).then(
          (data: any) => {
            console.log('event deleted');
            delete this.event._id;
            delete this.event._rev;
            this.createEvent();
            /*                 this.eventService.createEvent(this.event).then(
      (data: any) => {
        this.events.push(this.event);
        this.options.events = this.events;
        console.log('event stored');
        this.alertService.success('Enregistrement réussi', true);
      },
      (error: any) => {
        console.log('problem storing event');
        this.alertService.error(error);
        this.loading = false;
      }
    );
 */
          },
          (error: any) => {
            this.alertService.error(error);
            this.loading = false;
          }
        );
      }
      this.dialogVisible = false;
    }
  }

  createEvent() {
    this.eventService.createEvent(this.event).then(
      (data: any) => {
        console.log('event stored');
        this.alertService.success('Enregistrement réussi', true);
      },
      (error: any) => {
        console.log('problem storing event');
        this.alertService.error(error);
        this.loading = false;
      }
    );
  }
  deleteEvent() {
    let eventIndex = this.events.findIndex(
      (element) => element._id == this.event.id
    );
    let dbEvent = this.events[eventIndex];
    this.eventService.deleteEvent(dbEvent).then(
      (data: any) => {
        this.alertService.success('Suppression réussie', true);
        //this.events.splice(eventIndex, 1);
        //this.options.events = this.events;
      },
      (error: any) => {
        this.alertService.error(error.message ? error.message : error);
        this.loading = false;
      }
    );
    this.dialogVisible = false;
  }

  getMonthDateRange(year: number, month: number) {
    // month in moment is 0 based, so 9 is actually october, subtract 1 to compensate
    // array is 'year', 'month', 'day', etc
    var startDate = moment([year, month - 1]);
    // Clone the value before .endOf()
    var endDate = moment(startDate).endOf('month');
    return { start: startDate, end: endDate };
  }
}
