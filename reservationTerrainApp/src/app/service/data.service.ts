import { Injectable } from '@angular/core';
//import * as PouchDB from 'pouchdb'
//import * as PouchDB from 'pouchdb/dist/pouchdb';
import PouchDB from 'pouchdb';
//import PouchDB from 'node_modules/pouchdb';
import { environment } from '../../environments/environment'

//const PouchDB = require('pouchdb');

@Injectable()
export class DataService {
 
    db: any;
    remoteDatabase: any;
 
    constructor() {
 
        this.db = new PouchDB('resa_tennis');
        this.remoteDatabase = new PouchDB(
            environment.remote,
            {
                auth: {
                    username: environment.APIKeyUsr,
                    password: environment.APIKeyPwd
                },
                // The database already exists - no need for PouchDB to check to see
                // if it exists (and try to create it). This saves on some API requests.
                skip_setup: true
            }
        );
        let options = {
          live: true,
          retry: true,
          continuous: true
        };

        this.db.sync(this.remoteDatabase, options);
    }
 
}