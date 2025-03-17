import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, ViewChild, OnDestroy } from '@angular/core';
import { MaterialModule } from 'src/app/shared/shared-module/material/material.module';
import {
  Chart,
  ChartConfiguration,
  ChartType,
  registerables
} from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-generic-chart',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './generic-chart.component.html',
  styleUrl: './generic-chart.component.scss'
})
export class GenericChartComponent implements AfterViewInit, OnDestroy {
  @Input() chartId: string = 'defaultChart'; // Unique ID for the chart
  @Input() chartType: ChartType = 'bar'; // Chart type
  @Input() chartData: ChartConfiguration['data'];
  @Input() chartOptions: ChartConfiguration['options'];

  @ViewChild('chartCanvas', { static: true }) chartCanvas: any;
  private chartInstance!: Chart;

  constructor() {
    this.chartData = this.getDefaultData(); // ✅ Initialize default data in the constructor
    this.chartOptions = this.getDefaultOptions(); // ✅ Initialize default options in the constructor
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeChart();
    }, 500);
  }

  private initializeChart() {
    if (this.chartCanvas?.nativeElement) {
      // ✅ Destroy previous instance to prevent flickering or duplication
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      this.chartInstance = new Chart(this.chartCanvas.nativeElement, {
        type: this.chartType,
        data: this.chartData,
        options: this.chartOptions,
      });

      console.log('Chart Instance:', this.chartInstance);
    } else {
      console.error('❌ Error: chartCanvas is not available!');
    }
  }

  // ✅ Destroy chart instance when component is destroyed
  ngOnDestroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

  // ✅ Default Chart Data
  private getDefaultData(): ChartConfiguration['data'] {
    return {
      labels: ['January', 'February', 'March', 'April', 'May'],
      datasets: [
        {
          label: 'Orders',
          data: [65, 59, 80, 81, 56],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  }

  // ✅ Default Chart Options
  private getDefaultOptions(): ChartConfiguration['options'] {
    return {
      responsive: true,
      maintainAspectRatio: false, // ✅ Prevents unnecessary resizing
      animation: { duration: 0 }, // ✅ Reduces flickering
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };
  }
}
