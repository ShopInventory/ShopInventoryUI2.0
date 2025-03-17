import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../shared/shared-module/material/material.module';
import { GenericChartComponent } from 'src/app/shared/shared-component/custom-components/generic-chart/generic-chart.component';
import { CommonModule } from '@angular/common';
import { ChartsService } from '@services/charts-service/charts.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MaterialModule, GenericChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  readonly chartService = inject(ChartsService);
  barChartData: any;
  barChartOptions: any;
  lineChartData: any;
  lineChartOptions: any;
  pieChartData: any;
  pieChartOptions: any;
  doughnutChartData: any;
  doughnutChartOptions: any;

  selectedExpensesMonth: string = 'Month'; // Default text
  selectedEarningMonth: string = 'Month'; // Default text

  ngOnInit(): void {
    this.setValues();
  }

  setValues() {
    this.chartService.getChartsData().subscribe((res: any) => {
      this.barChartData = res?.barChartData;
      this.barChartOptions = res?.barChartOptions;
      this.lineChartData = res?.lineChartData;
      this.lineChartOptions = res?.lineChartOptions;
      this.pieChartData = res?.pieChartData;
      this.pieChartOptions = res?.pieChartOptions;
      this.doughnutChartData = res?.doughnutChartData;
      this.doughnutChartOptions = res?.doughnutChartOptions;
      console.log('chart res', res);
      console.log('chart this.doughnutChartData', this.doughnutChartData);
    });
  }


  selectExpensesMonth(month: string) {
    this.selectedExpensesMonth = month; // Update the selected month
  }

  selectEarningsMonth(month: string) {
    this.selectedEarningMonth = month; // Update the selected month
  }
}
