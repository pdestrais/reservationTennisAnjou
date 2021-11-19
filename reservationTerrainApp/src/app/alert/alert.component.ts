import { Component, OnInit } from '@angular/core';

import { AlertService } from '../service/alert.service';

@Component({
    selector: 'alert',
    templateUrl: 'alert.component.html',
    styleUrls: ['alert.component.css']
})

export class AlertComponent {
    alert: any;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.alertService.getAlert().subscribe(errorObject => { this.alert = errorObject; });
    }
}