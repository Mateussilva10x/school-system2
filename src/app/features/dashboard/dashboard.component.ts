import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DashboardService } from './services/dashboard.service';
import { LoadingService } from '../../core/services/loading.service';

interface DashboardMetrics {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  metrics: DashboardMetrics = {
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
  };

  constructor(
    private dashboardService: DashboardService,
    private loadingService: LoadingService,
  ) {}

  ngOnInit() {
    this.loadMetrics();
  }

  private loadMetrics() {
    this.loadingService.show();
    this.dashboardService.getMetrics().subscribe({
      next: (metrics) => {
        this.metrics = metrics;
        this.loadingService.hide();
      },
      error: () => this.loadingService.hide(),
    });
  }
}
