import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  // Mock data - será substituído pela integração real
  getMetrics(): Observable<any> {
    return of({
      totalStudents: 256,
      totalTeachers: 32,
      totalClasses: 12
    }).pipe(delay(1000)); // Simula delay de rede
  }
}
