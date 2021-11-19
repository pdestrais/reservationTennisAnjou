import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
/* import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
 */
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthenticationService {
  private backendURL: string = '';

  constructor(private http: HttpClient) {
    if (environment.production) this.backendURL = window.location.origin;
    else this.backendURL = 'http://localhost:5001'; // for dev purposes
  }

  login(username: string, password: string) {
    return this.http
      .post(this.backendURL + '/api/login', {
        username: username,
        password: password,
      })
      .pipe(
        map((response: any) => {
          // login successful if there's a jwt token in the response
          //if username or password is not correct, a message is returned by the server
          if ((response.code = !'OK')) {
            switch (response.code) {
              case 'BadPassword':
                throw new Error('Mot de passe incorrect');
              case 'LoginUsernameNotExist':
                throw new Error("Nom d'utilisateur inconnu");
              case 'NoUsername':
                throw new Error("Pas de nom d'utilisateur");
              case 'NoPassword':
                throw new Error('Pas de mot de passe');
            }
          } else if (response && response.user && response.user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }
        }),
        catchError((error) => {
          if (error.error) {
            switch (error.error.code) {
              case 'BadPassword':
                return throwError('Mot de passe incorrect');
              case 'LoginUsernameNotExist':
                return throwError("Nom d'utilisateur inconnu");
              case 'NoUsername':
                return throwError("Pas de nom d'utilisateur");
              case 'NoPassword':
                return throwError('Pas de mot de passe');
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

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }
}
