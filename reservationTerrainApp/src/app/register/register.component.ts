import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService } from '../service/alert.service';
import { UserService } from '../service/user.service';

@Component({
  //    moduleId: module.id.toString(),
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.css'],
})
export class RegisterComponent {
  model: any = {};
  loading = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService
  ) {}

  register() {
    this.loading = true;
    this.userService.signupNewUser(this.model).subscribe(
      (response) => {
        this.alertService.success(
          "Votre demande d'enregistrement est réussie",
          true
        );
        this.router.navigate(['/home']);
      },
      (error) => {
        this.alertService.error(error);
        this.loading = false;
      }
    );
  }

  backHome() {
    this.router.navigate(['/home']);
  }
}
