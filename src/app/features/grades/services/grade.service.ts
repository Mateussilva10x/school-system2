import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Grades } from '../../../shared/interfaces/models';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root',
})
export class GradeService {
  private apiUrl = `${environment.apiUrl}/grades`; // 🔹 Substitua pela URL do backend

  constructor(private http: HttpClient) {}

  getGradesByFilters(
    classId: string,
    schoolYear: string,
    subjectId: string,
    bimester: string
  ): Observable<Grades[]> {
    return this.http.get<Grades[]>(
      `${this.apiUrl}?classId=${classId}&schoolYear=${schoolYear}&subjectId=${subjectId}&bimester=${bimester}`
    );
  }

  getGradesByStudent(
    studentId: string,
    schoolYear: string
  ): Observable<Grades[]> {
    return this.http.get<Grades[]>(
      `${this.apiUrl}/student?studentId=${studentId}&schoolYear=${schoolYear}`
    );
  }

  saveGrade(grade: Grades): Observable<Grades> {
    return this.http.post<Grades>(this.apiUrl, grade);
  }

  calculateAverage(p1: number, p2: number): number {
    return (p1 + p2) / 2;
  }
}
