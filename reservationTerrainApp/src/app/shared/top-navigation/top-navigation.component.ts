import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItem } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';

import { Router } from '@angular/router';
import { AlertService } from '../../service/alert.service';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-ui-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.css'],
})
export class TopNavigationComponent implements OnInit {
  public loggedInUser: any;
  public toggleOn: boolean = false;

  constructor(private router: Router, private alertService: AlertService) {}

  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem('currentUser')!);
  }

  ngDoCheck() {
    // Custom change detection
    this.loggedInUser = JSON.parse(localStorage.getItem('currentUser')!);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.loggedInUser = '';
    this.router.navigate(['/login']);
  }

  toggleMenu() {
    this.toggleOn = !this.toggleOn;
  }
}
