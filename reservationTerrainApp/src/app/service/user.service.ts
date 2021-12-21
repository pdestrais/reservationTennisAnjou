import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
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

  constructor(public dataService: DataService, public http: HttpClient, public zone: NgZone) {
    if (environment.production) this.backendURL = window.location.origin;
    else this.backendURL = environment.APIServer; // 'http://localhost:5001' for dev purposes
    this.getAll();
  }

  getAll(): Observable<any> {
    return this.http.get(this.backendURL + '/api/users');
  }

  resetPassword(username: string): Observable<any> {
    return this.http.post(this.backendURL + '/api/resetPassword', { username: username });
  }

  //Use NodeJS API because of crypto function used to hash Password
  create(user: User) {
    return this.http.post('/api/users', user, this.jwt()).pipe(
      map((response: any) => response.json()),
      catchError((error) => {
        return throwError(error.message || error.json().error || 'Server error');
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
    return this.http.post(this.backendURL + '/api/user/' + user._id, reqBody).pipe(
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
        } else return throwError(error.message || error.json().error || 'Server error');
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
    return this.http.post(this.backendURL + '/api/changePassword', reqBody).pipe(
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
        } else return throwError(error.message || error.json().error || 'Server error');
      })
    );
  }

  delete(_id: string, _rev: string) {
    return this.http.delete(this.backendURL + '/api/user/' + _id + '/' + _rev).pipe(
      catchError((error) => {
        if (error.error) {
          switch (error.error.code) {
            case 'NoUserIdOrUserRev':
              return throwError(
                "Erreur technique : Manque ne userId ou userRev. Prendre contact avec l'administrateur."
              );
            default:
              return throwError('Erreur technique');
          }
        } else return throwError(error.message || error.json().error || 'Erreur Technique');
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
