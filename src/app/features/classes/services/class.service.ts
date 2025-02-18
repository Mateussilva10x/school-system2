import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Class } from '../../../shared/interfaces/models';
import { StudentService } from '../../students/services/student.service';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private apiUrl = `${environment.apiUrl}/classes`; // Ajuste conforme seu backend

  constructor(private http: HttpClient, private studentService: StudentService) {}

  // 🔹 Busca todas as turmas e adiciona o total de alunos
  getClasses(): Observable<Class[]> {
    return this.http.get<Class[]>(this.apiUrl).pipe(
      switchMap(classes =>
        forkJoin(
          classes.map(classItem =>
            this.calculateTotalStudents(classItem.id).pipe(
              map(total => ({ ...classItem, totalStudents: total }))
            )
          )
        )
      )
    );
  }

  // 🔹 Busca uma turma pelo ID
  getClass(id: string): Observable<Class> {
    return this.http.get<Class>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Cria uma nova turma
  createClass(classData: Omit<Class, 'id' | 'totalStudents'>): Observable<Class> {
    return this.http.post<Class>(this.apiUrl, classData);
  }

  // 🔹 Atualiza uma turma
  updateClass(id: string, classData: Partial<Omit<Class, 'totalStudents'>>): Observable<Class> {
    return this.http.put<Class>(`${this.apiUrl}/${id}`, classData);
  }

  // 🔹 Exclui uma turma
  deleteClass(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Calcula o total de alunos na turma
  private calculateTotalStudents(classId: string): Observable<number> {
    return this.studentService.getStudentsByClass(classId).pipe(
      map(students => students.length)
    );
  }
}
