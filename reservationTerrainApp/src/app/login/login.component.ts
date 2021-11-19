import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService } from '../service/alert.service';
import { AuthenticationService } from '../service/authentication.service';

import { ButtonModule } from 'primeng/button';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: [ 'login.component.css' ]
})
export class LoginComponent implements OnInit {
  model: any = {};
  returnUrl!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private zone: NgZone
  ) {}

      ngOnInit() {
        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

/*   async ngOnInit() {
    try {
      await this.appid.init({
        clientId: '79295bc4-411d-4b9a-8b79-d48f29e13eb8',
        discoveryEndpoint:
          'https://us-south.appid.cloud.ibm.com/oauth/v4/19aaf3e8-df50-46b1-b13d-3b7f7b56fed8/.well-known/openid-configuration',
      });
    } catch (e) {
      this.alertService.error(e);
      this.loading = false;
    }
  }
 */  
  login() {
    this.zone.run(() => {
      this.authenticationService
        .login(this.model.username, this.model.password)
        .subscribe(
          (data) => {
            console.log('user : ' + this.model.username + ' logged in');
            this.router.navigate([this.returnUrl]);
          },
          (error) => {
            this.alertService.error(error);
          }
        );
    });
  }

}
