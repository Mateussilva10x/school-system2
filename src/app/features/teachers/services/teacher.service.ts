import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Teacher, Subject } from '../../../shared/interfaces/models';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = `${environment.apiUrl}/teachers`; // Altere para o backend correto
  private subjectsUrl = `${environment.apiUrl}/subjects`;

  constructor(private http: HttpClient) {}

  // 🔹 Buscar professores do backend
  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.apiUrl);
  }

  // 🔹 Criar professor no backend
  createTeacher(teacher: Omit<Teacher, 'id'>): Observable<Teacher> {
    return this.http.post<Teacher>(this.apiUrl, teacher);
  }

  // 🔹 Atualizar professor no backend
  updateTeacher(id: string, teacher: Partial<Teacher>): Observable<Teacher> {
    return this.http.put<Teacher>(`${this.apiUrl}/${id}`, teacher);
  }

  // 🔹 Deletar professor no backend
  deleteTeacher(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Buscar disciplinas do backend
  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.subjectsUrl);
  }
}
