import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ChartConfiguration } from 'chart.js';

@Injectable({
  providedIn: 'root',
})
export class ChartsService {
  constructor() {}

  getChartsData(): Observable<Record<string, any>> {
    return of({
      // ✅ Bar Chart
      barChartData: this.getBarChartData(),
      barChartOptions: this.getBarChartOptions(),

      // ✅ Line Chart
      lineChartData: this.getLineChartData(),
      lineChartOptions: this.getLineChartOptions(),

      // ✅ Pie Chart
      pieChartData: this.getPieChartData(),
      pieChartOptions: this.getPieChartOptions(),

      // ✅ Doughnut Chart
      doughnutChartData: this.getDoughnutChartData(),
      doughnutChartOptions: this.getDoughnutChartOptions(),
    });
  }

  // 📌 Bar Chart Data & Options
  private getBarChartData(): ChartConfiguration['data'] {
    return {
      labels: ['January', 'February', 'March', 'April', 'May'],
      datasets: [
        {
          label: 'Orders',
          data: [65, 59, 80, 81, 56],
          backgroundColor: ['#BAA4EB', '#F5C779', '#78C1BE', '#32CB51', '#D5D5D5'],
          // borderColor: ['#BAA4EB', '#F5C779', '#78C1BE', '#32CB51', '#D5D5D5'],
          borderWidth: 1,
          barThickness: 22,
          borderRadius: 5,
        },
      ],
    };
  }

  private getBarChartOptions(): ChartConfiguration['options'] {
    return {
      // responsive: true,
      maintainAspectRatio: true, // Allows custom height/width
      aspectRatio: 1.9,
      layout: { padding: { top: 10, bottom: 10 } },
      plugins: { legend: { display: false } },
      scales: {
        y: { border: { display: false }, grid: { color: '#EDEDED6A' } },
        x: { grid: { drawOnChartArea: false } },
      },
    };
  }

  // 📌 Line Chart Data & Options
  private getLineChartData(): ChartConfiguration['data'] {
    return {
      labels: ['January', 'February', 'March', 'April', 'May'],
      datasets: [
        {
          label: 'Sales',
          data: [100, 120, 180, 200, 220],
          fill: false, // No fill under the line
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          tension: 0.4, // Smooth curve
          pointRadius: 5, // Size of data points
          pointBackgroundColor: 'rgba(255, 159, 64, 1)',
          pointBorderWidth: 2,
          pointHoverRadius: 8,
        },
      ],
    };
  }

  private getLineChartOptions(): ChartConfiguration['options'] {
    return {
      // responsive: true,
      maintainAspectRatio: true, // Allows custom height/width
      aspectRatio: 1.9,
      scales: { y: { beginAtZero: true } },
    };
  }

  // 📌 Pie Chart Data & Options
  private getPieChartData(): ChartConfiguration['data'] {
    return {
      // labels: ['Product A', 'Product B', 'Product C'],
      datasets: [
        {
          label: 'Profit Distribution',
          data: [40, 30, 30],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          hoverOffset: 4,
        },
      ],
    };
  }

  private getPieChartOptions(): ChartConfiguration['options'] {
    return {
      responsive: true,
      maintainAspectRatio: false, // Allows custom height/width
      aspectRatio: 1.9, // Controls height (increase for shorter chart)
    };
  }

  // 📌 Doughnut Chart Data & Options
  private getDoughnutChartData(): ChartConfiguration['data'] {
    return {
      // labels: ['Online', 'Retail', 'Wholesale'],
      datasets: [
        {
          label: 'Income Sources',
          data: [50, 30, 20],
          backgroundColor: ['#4BC0C0', '#FF9F40', '#9966FF'],
          hoverOffset: 4,
        },
      ],
    };
  }

  private getDoughnutChartOptions(): ChartConfiguration['options'] {
    return {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1.4,
    };
  }
}
