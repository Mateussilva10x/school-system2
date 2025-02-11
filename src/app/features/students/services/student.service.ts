import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Student } from '../../../shared/interfaces/models';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private mockStudents: Student[] = [
    {
      uniqueId: '1',
      name: 'João Silva',
      birthDate: new Date('2010-05-15'),
      refClass: 'Turma A',
      schoolYear: '2024'
    },
    {
      uniqueId: '2',
      name: 'Maria Santos',
      birthDate: new Date('2009-08-22'),
      refClass: 'Turma B',
      schoolYear: '2024'
    }
  ];

  getStudents(): Observable<Student[]> {
    return of(this.mockStudents).pipe(delay(500));
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
    return of(void 0).pipe(delay(500));
  }

  generateReport(id: string): void {
    console.log(`Gerando boletim para o aluno ${id}`);
    // Implementação do PDF será feita posteriormente
  }
}
