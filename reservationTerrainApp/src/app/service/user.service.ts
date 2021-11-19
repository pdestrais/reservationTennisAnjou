import { Injectable, NgZone } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable, from, throwError } from 'rxjs';

import { DataService } from './data.service';
import { User } from '../model/user';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class UserService {
  private postSubject: any = new Subject();
  private backendURL: string;
  private users: User[] = [];

  constructor(
    public dataService: DataService,
    public http: HttpClient,
    public zone: NgZone
  ) {
    if (environment.production) this.backendURL = window.location.origin;
    else this.backendURL = environment.APIServer; // 'http://localhost:5001' for dev purposes
    this.getAll();
    this.dataService.db
      .changes({ live: true, since: 'now', include_docs: true })
      .on('change', (change: any) => {
        if (change.doc.type === 'membre') {
          this.handleEventChanges(change);
        }
      });
  }

  getChanges$(): Observable<any> {
    return this.postSubject;
  }

  handleEventChanges(change: any) {
    this.zone.run(() => {
      console.log('incoming change : ' + JSON.stringify(change));
      let changedDoc = null;
      let changedIndex: number = 0;

      this.users.forEach((doc, index) => {
        if (doc._id === change.id) {
          changedDoc = doc;
          changedIndex = index;
        }
      });

      //A document was deleted
      if (change.deleted) {
        this.users.splice(changedIndex, 1);
      } else {
        //A document was updated
        if (changedDoc) {
          this.users[changedIndex] = change.doc;
        }
        //A document was added
        else {
          this.users.push(change.doc);
        }
      }
      this.postSubject.next(this.users);
    });
  }

  /*getAllii() : Observable<any> {
        return Observable.fromPromise(
            this.initDB()
                .then(() => {
                    return this.db.allDocs({ include_docs: true });
                })
                .then(docs => {

                    // Each row has a .doc object and we just want to send an 
                    // array of birthday objects back to the calling code,
                    // so let's map the array to contain just the .doc objects.

                    return docs.rows.map(row => {
                        // Convert string to date, doesn't happen automatically.
                        row.doc.Date = new Date(row.doc.Date);
                        return row.doc;
                    });
                }));
    }
*/
  getAllOld(): Observable<any> {
    return from(
      this.dataService.db
        .allDocs({
          include_docs: true,
          startkey: 'membre|',
          endkey: 'membre|\uffff',
        })
        .then((result: any) => {
          this.users = [];
          result.rows.map((row: any) => {
            this.users.push(row.doc);
          });
          return this.users;
        })
        .catch((error: any) => {
          console.log(error);
          return this.handleError(error);
        })
    );
  }

  getAll(): Observable<any> {
    return this.http.get(this.backendURL + '/api/users');
    /*         from(this.dataService.db.allDocs({
                include_docs: true,
                startkey: "membre|",
                endkey:"membre|\uffff"
            })
            .then((result:any) => {
                this.users = [];
                result.rows.map((row:any) => {
                    this.users.push(row.doc);
                });
                return this.users;
            })
            .catch((error:any) => {
                console.log(error);
                return this.handleError(error);
            })); 
 */
  }

  getById(_id: string) {
    this.dataService.db
      .get(_id)
      .then((result: any) => {
        return result.doc;
      })
      .catch((error: any) => {
        console.log(error);
        return this.handleError(error);
      });
  }

  //Use NodeJS API because of crypto function used to hash Password
  create(user: User) {
    return this.http.post('/api/users', user, this.jwt()).pipe(
      map((response: any) => response.json()),
      catchError((error) => {
        return throwError(
          error.message || error.json().error || 'Server error'
        );
      })
    );
  }

  signupNewUser(user: User) {
    let url = this.backendURL + '/api/processSignupRequest';
    return this.http.post(url, user);
  }

  //Use NodeJS API because of crypto function used to hash Password (if password is changed)
  update(user: User) {
    let reqBody = { ...user };
    return this.http
      .post(this.backendURL + '/api/user/' + user._id, reqBody)
      .pipe(
        catchError((error) => {
          if (error.error) {
            switch (error.error.code) {
              case 'NoUsername':
                return throwError("Pas de nom d'utilisateur");
              case 'UsernameNotExist':
                return throwError("Le nom d'utilisateur n'existe pas");
              default:
                return throwError('Erreur technique');
            }
          } else
            return throwError(
              error.message || error.json().error || 'Server error'
            );
        })
      );
  }

  //Use NodeJS API because of crypto function used to hash Password (if password is changed)
  updatePwd(user: User, currPwd: string, newPwd: string) {
    let reqBody = {
      user: user,
      username: user.username,
      oldPassword: currPwd,
      newPassword: newPwd,
    };
    return this.http
      .post(this.backendURL + '/api/changePassword', reqBody)
      .pipe(
        catchError((error) => {
          if (error.error) {
            switch (error.error.code) {
              case 'NoUsername':
                return throwError("Pas de nom d'utilisateur");
              case 'NoPreviousPassword':
                return throwError("Pas d'ancien mot de passe");
              case 'NoNewPassword':
                return throwError('Pas de nouveau mot de passe');
              case 'UsernameNotExist':
                return throwError("Le nom d'utilisateur n'existe pas");
              case 'BadPassword':
                return throwError("L'ancien mot de passe est incorrect");
              case 'PendingResetPassword':
                return throwError(
                  'Une demande de reréinitialisation de mot de passe est en cours. Finissez là avant de changer votre mot de passe.'
                );
              default:
                return throwError('Erreur technique');
            }
          } else
            return throwError(
              error.message || error.json().error || 'Server error'
            );
        })
      );
  }

  delete(_id: string, _rev: string) {
    return from(
      this.dataService.db
        .remove(_id, _rev)
        .then((result: any) => {
          return result;
        })
        .catch((error: any) => {
          console.log(error);
          return this.handleError(error);
        })
    );
  }

  private handleError(error: any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof HttpErrorResponse) {
      errMsg = `${error.status} - ${error.statusText || ''} ${error.error}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return errMsg;
  }
  // private helper methods

  private jwt() {
    // create authorization header with jwt token
    let currentUser = JSON.parse(localStorage.getItem('currentUser')!);
    if (currentUser && currentUser.token) {
      let headers = new HttpHeaders({ Authorization: currentUser.token });
      return { headers: headers };
    } else return {};
  }
}
