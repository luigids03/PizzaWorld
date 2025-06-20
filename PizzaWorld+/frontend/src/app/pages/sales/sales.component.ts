import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { RouterModule }   from '@angular/router';
import { HttpClient }     from '@angular/common/http';
import { NgApexchartsModule } from 'ng-apexcharts';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis
} from 'ng-apexcharts';

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgApexchartsModule      // <apx-chart> is recognised here
  ],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  @ViewChild('sidebar', { static: true }) sidebar!: ElementRef<HTMLElement>;

  /** Filled after HTTP call; null until then */
  salesOpts: ChartOptions | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('/api/kpi/sales-per-day').subscribe(rows => {
      this.salesOpts = {
        series: [
          {
            name : 'Sales €',
            data : rows.map(r => [new Date(r.day).getTime(), +r.sales])
          }
        ],
        chart      : { type: 'area', height: 320, toolbar: { show: false } },
        xaxis      : { type: 'datetime' },
        yaxis      : { title: { text: 'Sales (€)' } },
        stroke     : { curve: 'smooth' },
        dataLabels : { enabled: false },
        tooltip    : { shared : true }
      };
    });
  }

  toggleSidebar(): void {
    this.sidebar.nativeElement.classList.toggle('collapsed');
  }
}
