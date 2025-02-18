import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Student } from '../../../shared/interfaces/models';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  generateStudentReport(studentId: string) {
    const url = `${this.apiUrl}/generate/${studentId}`;
    return this.http.get(url, { responseType: 'blob' }).subscribe((pdf) => {
      const blob = new Blob([pdf], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }
}
