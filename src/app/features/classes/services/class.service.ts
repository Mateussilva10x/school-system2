import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { Class } from '../../../shared/interfaces/models';
import { StudentService } from '../../students/services/student.service';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private mockClasses: Class[] = [
    {
      uniqueId: '1',
      name: 'Turma A',
      schoolYear: '2024'
    },
    {
      uniqueId: '2',
      name: 'Turma B',
      schoolYear: '2024'
    },
    {
      uniqueId: '3',
      name: 'Turma C',
      schoolYear: '2023'
    }
  ];

  constructor(private studentService: StudentService) { }

  private calculateTotalStudents(classId: string): Observable<number> {
    return this.studentService.getStudents().pipe(
      map(students => students.filter(student => student.refClass === classId).length)
    );
  }

  private addTotalStudentsToClass(classItem: Class): Observable<Class> {
    return this.calculateTotalStudents(classItem.uniqueId).pipe(
      map(total => ({
        ...classItem,
        totalStudents: total
      }))
    );
  }

  getClasses(): Observable<Class[]> {
    return of(this.mockClasses).pipe(
      map(classes => [...classes]),
      map(classes => classes.map(classItem => 
        this.addTotalStudentsToClass(classItem)
      )),
      switchMap(observables => forkJoin(observables))
    );
  }

  getClass(id: string): Observable<Class | undefined> {
    const classItem = this.mockClasses.find(c => c.uniqueId === id);
    if (!classItem) return of(undefined);
    
    return this.addTotalStudentsToClass(classItem);
  }

  createClass(classData: Omit<Class, 'uniqueId' | 'totalStudents'>): Observable<Class> {
    const newClass: Class = {
      ...classData,
      uniqueId: (this.mockClasses.length + 1).toString()
    };
    this.mockClasses.push(newClass);
    return this.addTotalStudentsToClass(newClass);
  }

  updateClass(id: string, classData: Partial<Omit<Class, 'totalStudents'>>): Observable<Class> {
    const index = this.mockClasses.findIndex(c => c.uniqueId === id);
    if (index !== -1) {
      this.mockClasses[index] = { ...this.mockClasses[index], ...classData };
      return this.addTotalStudentsToClass(this.mockClasses[index]);
    }
    throw new Error('Class not found');
  }

  deleteClass(id: string): Observable<void> {
    const index = this.mockClasses.findIndex(c => c.uniqueId === id);
    if (index !== -1) {
      this.mockClasses.splice(index, 1);
    }
    return of(void 0);
  }
}
