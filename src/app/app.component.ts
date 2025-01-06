import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { NavService } from '@services/nav/nav.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ShopInventoryUI_V2.0';

  authPageFlag: boolean = false;
  constructor(private navService: NavService) { }

  ngOnInit() {
    this.navService.currentUrl.subscribe((res: any) => {
      // console.log('navService res', res)
      this.authPageFlag = res?.startsWith('/authentication');
      // console.log('authPageFlag', this.authPageFlag)
    })
  }
}
