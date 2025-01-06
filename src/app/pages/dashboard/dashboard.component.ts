import { Component } from '@angular/core';
import { MaterialModule } from '../../shared/shared-module/material/material.module';

@Component({
    selector: 'app-dashboard',
    imports: [MaterialModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
