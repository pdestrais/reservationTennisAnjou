export class Event {
    _id?: string;
    id?: string;
    _rev?: string;
    title!: string;
    start!: string;
    end!: string;
    allDay: boolean = false;
}