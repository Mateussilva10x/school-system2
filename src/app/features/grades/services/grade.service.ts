import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Grades } from '../../../shared/interfaces/models';

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  private mockGrades: Grades[] = [];

  constructor() {}

  getGradesByFilters(classId: string, schoolYear: string, subjectId: string, bimester: string): Observable<Grades[]> {
    // Mock implementation - In a real scenario, this would be an HTTP call
    return of(this.mockGrades.filter(grade =>
      grade.refSubject === subjectId &&
      grade.refBimester === bimester
    ));
  }

  getGradesByStudent(studentId: string, schoolYear: string): Observable<Grades[]> {
    return of(this.mockGrades.filter(grade =>
      grade.refStudent === studentId
    ));
  }

  getGradesByStudentAndBimester(studentId: string, bimester: string): Observable<Grades[]> {
    return of(this.mockGrades.filter(grade =>
      grade.refStudent === studentId &&
      grade.refBimester === bimester
    ));
  }

  saveGrade(grade: Grades): Observable<Grades> {
    const existingIndex = this.mockGrades.findIndex(g =>
      g.refStudent === grade.refStudent &&
      g.refSubject === grade.refSubject &&
      g.refBimester === grade.refBimester
    );

    if (existingIndex >= 0) {
      this.mockGrades[existingIndex] = grade;
    } else {
      grade.id = Math.random().toString(36).substring(7);
      this.mockGrades.push(grade);
    }

    return of(grade);
  }

  calculateAverage(p1: number, p2: number): number {
    return (p1 + p2) / 2;
  }
}
