import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {DataService} from './data.service'
import { Event} from '../model/event';

@Injectable()
export class EventService {

    postSubject: any = new Subject();

    private events!: Event[];

    constructor(public dataService: DataService, public zone: NgZone) {

        this.dataService.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change: any) => {
            if(change.doc.type === 'reservation' || change.deleted){
                this.handleEventChanges(change);
            }
        });
    }

    handleEventChanges(change: any){
        this.zone.run(() => {
            console.log("incoming change : "+JSON.stringify(change));
            let changedDoc = null;
            let changedIndex:number = 0;
            
            this.events.forEach((doc, index) => {
                if(doc._id === change.id){
                changedDoc = doc;
                changedIndex = index;
                }
            });
            
            //A document was deleted
            if(change.deleted){
                this.events.splice(changedIndex, 1);
            } 
            else {
                //A document was updated
                if(changedDoc){
                    this.events[changedIndex] = change.doc;
                } 
                //A document was added
                else {
                    this.events.push(change.doc); 
                }
            } 
            this.postSubject.next(this.events);   
        });
 
    }

    // startDate and endDate must be in the form of "YYYY-MM-DD"
    getEvents(startDate: string, endDate: string) {
/*        var querySelector = {
                                "selector": {
                                    "$and": [
                                    {
                                        "type": "reservation|event.start|event.end"
                                    },
                                    {
                                        "$and": [
                                        {"date": {"$gt":startDate}}, 
                                        {"date": {"$lt":endDate}}
                                        ]
                                    }
                                    ]
                                },
                                "sort": [
                                    {
                                    "date": "asc"
                                    },
                                    {
                                    "startTime": "asc"
                                    }
                                ]
                            }

        return this.http.post(this.dataUrl+"/events/find",querySelector)
                    .map(res => res.json().doc.docs.map(function(eventDoc){
                                                        let event = <Event>({});
                                                        event._id = eventDoc._id;
                                                        event._rev = eventDoc._rev;
                                                        event.title = eventDoc.player;
                                                        event.start = eventDoc.date+"T"+eventDoc.startTime;
                                                        event.end = eventDoc.date+"T"+eventDoc.endTime;
                                                        return event; 
                                                    })
                        );
*/
        if (this.events) {
            return Promise.resolve(this.events);
        }
        
        return new Promise(resolve => {
            this.dataService.db.allDocs({
                include_docs: true,
                startkey: "reservation|"+startDate+"T00:00:00",
                endkey:"reservation|"+endDate+"\uffff"
            })
            .then((result: any) => {
                this.events = [];
                let docs = result.rows.map((row: any) => {
                    this.events.push(row.doc);
                });
                resolve(this.events);
            })
            .catch((error: any) => {
                console.log(error);
            }); 
        });
    }

    getAllEvents():Promise<Event[]> {
        if (this.events) {
            return Promise.resolve(this.events);
        }
        return new Promise(resolve => {
            this.dataService.db.allDocs({
                include_docs: true,
                startkey: "reservation",
                endkey:"reservation\uffff"
            })
            .then((result: any) => {
                this.events = [];
                let docs = result.rows.map((row: any) => {
                    this.events.push(row.doc);
                });
                resolve(this.events);
            })
            .catch((error:any) => {
                console.log(error);
            }); 
        });
    }

    // startDate and endDate must be in the form of "YYYY-MM-DD"
    createEvent(event: any) {
        event._id = "reservation|"+event.start+"|"+event.end+"|"+event.title;
        event.type = "reservation";
        return this.dataService.db.put(event);
/*        return this.http.post(this.dataUrl+"/events",event)
                    .map(res => res.json());
*/
    }

    updateEvent(event: any) {
        return this.dataService.db.put(event).catch((err: any) => {
            console.log(err);
        });
/*        return this.http.put(this.dataUrl+"/events",event)
                    .map(res => res.json());
*/
    }

    deleteEvent(event: any) {
        return this.dataService.db.remove(event);
/*        return this.http.delete(this.dataUrl+"/events",event)
                    .map(res => res.json());
*/
    }
}