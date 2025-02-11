import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { DashboardService } from './services/dashboard.service';


interface DashboardMetrics {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  metrics: DashboardMetrics = {
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadMetrics();
  }

  private loadMetrics() {
    this.dashboardService.getMetrics().subscribe(metrics => {
      this.metrics = metrics;
    });
  }
}
