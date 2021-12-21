import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService } from '../service/alert.service';
import { AuthenticationService } from '../service/authentication.service';
import { UserService } from '../service/user.service';

import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class LoginComponent implements OnInit {
  model: any = {};
  returnUrl!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private zone: NgZone,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
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
      this.authenticationService.login(this.model.username, this.model.password).subscribe(
        (data) => {
          console.log('user : ' + this.model.username + ' logged in');
          if (data == 'changePassword') {
            this.router.navigate(['members', { changePwd: true }]);
          } else this.router.navigate([this.returnUrl]);
        },
        (error) => {
          this.alertService.error(error);
        }
      );
    });
  }

  reset() {
    console.log('reset requested');
    this.confirmationService.confirm({
      message:
        'Nous allons re-initialiser votre mot de passe et en renvoyer un nouveau via email. Vous devrez le changer lors de votre première connection. Etes-vous sûr de vouloir continuer ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.resetPassword(this.model.username).subscribe(
          (data) => {
            this.messageService.add({
              severity: 'info',
              summary: 'Confimé',
              detail:
                'Un mail contenant votre nouveau mot de passe vous a été envoyé. Vous devrez le changer lors de votre première connection.',
            });
          },
          (error) => {
            this.alertService.error(error);
          }
        );
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled',
            });
            break;
        }
      },
    });
  }
}
