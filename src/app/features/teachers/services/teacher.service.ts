import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Teacher, Subject } from '../../../shared/interfaces/models';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private mockTeachers: Teacher[] = [
    {
      uniqueId: '1',
      name: 'Maria Oliveira',
      birthDate: new Date('1985-03-10'),
      refSubject: '1' // Matemática
    },
    {
      uniqueId: '2',
      name: 'João Santos',
      birthDate: new Date('1982-07-15'),
      refSubject: '2' // Português
    },
    {
      uniqueId: '3',
      name: 'Ana Silva',
      birthDate: new Date('1988-11-22'),
      refSubject: '3' // Ciências
    }
  ];

  private mockSubjects: Subject[] = [
    {
      uniqueId: '1',
      name: 'Português'
    },
    {
      uniqueId: '2',
      name: 'Matemática'
    },
    {
      uniqueId: '3',
      name: 'Ciências'
    },
    {
      uniqueId: '4',
      name: 'Geografia'
    },
    {
      uniqueId: '5',
      name: 'História'
    },
    {
      uniqueId: '6',
      name: 'Filosofia'
    },
    {
      uniqueId: '7',
      name: 'Artes'
    },
    {
      uniqueId: '8',
      name: 'Inglês'
    },
    {
      uniqueId: '9',
      name: 'Ed.Física'
    }
  ]

  constructor() {}

  getTeachers(): Observable<Teacher[]> {
    return of(this.mockTeachers).pipe(delay(500));
  }

  // getTeacher(id: string): Observable<Teacher> {
  //   return this.http.get<Teacher>(`${this.apiUrl}/${id}`);
  // }

  createTeacher(teacher: Teacher): Observable<Teacher> {
    const newTeacher = {
      ...teacher,
      uniqueId: (this.mockTeachers.length + 1).toString()
    };
    this.mockTeachers.push(newTeacher);
    return of(newTeacher).pipe(delay(500));
  }

  updateTeacher(teacher: Teacher): Observable<Teacher> {
    const index = this.mockTeachers.findIndex(t => t.uniqueId === teacher.uniqueId);
    if (index !== -1) {
      this.mockTeachers[index] = teacher;
    }
    return of(teacher).pipe(delay(500));
  }

  deleteTeacher(id: string): Observable<void> {
    this.mockTeachers = this.mockTeachers.filter(t => t.uniqueId !== id);
    return of(void 0).pipe(delay(500));
  }

  getSubjects(): Observable<Subject[]> {
    return of(this.mockSubjects).pipe(delay(500));
  }
}
