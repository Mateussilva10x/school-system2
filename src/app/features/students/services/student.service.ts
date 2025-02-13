import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Student, Class, Subject, Grades } from '../../../shared/interfaces/models';
import { ReportService } from './report.service';
import { GradeService } from '../../grades/services/grade.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private mockStudents: Student[] = [
    {
      uniqueId: '1',
      name: 'João Silva',
      birthDate: new Date('2010-05-15'),
      refClass: '1', // Referência à Turma A
      schoolYear: '2024'
    },
    {
      uniqueId: '2',
      name: 'Maria Santos',
      birthDate: new Date('2009-08-22'),
      refClass: '1', // Referência à Turma A
      schoolYear: '2024'
    },
    {
      uniqueId: '3',
      name: 'Pedro Oliveira',
      birthDate: new Date('2010-03-10'),
      refClass: '2', // Referência à Turma B
      schoolYear: '2024'
    }
  ];

  constructor(
    private reportService: ReportService,
    private gradeService: GradeService
  ) {}

  getStudents(): Observable<Student[]> {
    return of(this.mockStudents).pipe(delay(500));
  }

  getStudentsByClass(classId: string): Observable<Student[]> {
    const filteredStudents = this.mockStudents.filter(student => student.refClass === classId);
    return of(filteredStudents).pipe(delay(500));
  }

  createStudent(student: Student): Observable<Student> {
    this.mockStudents.push(student);
    return of(student).pipe(delay(500));
  }

  updateStudent(student: Student): Observable<Student> {
    const index = this.mockStudents.findIndex(s => s.uniqueId === student.uniqueId);
    if (index !== -1) {
      this.mockStudents[index] = student;
    }
    return of(student).pipe(delay(500));
  }

  deleteStudent(id: string): Observable<void> {
    this.mockStudents = this.mockStudents.filter(s => s.uniqueId !== id);
    return of(undefined).pipe(delay(500));
  }

  generateReport(id: string): void {
    console.log(`Gerando boletim para o aluno ${id}`);
    // Implementação do PDF será feita posteriormente
  }

  generateStudentReport(student: Student, classObj: Class, subjects: Subject[]): Observable<void> {
    return this.gradeService.getGradesByStudent(student.uniqueId, student.schoolYear).pipe(
      map((grades: Grades[]) => {
        this.reportService.generateStudentReport(student, grades, subjects, classObj);
      })
    );
  }
}
