import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';
import { ClassDiary } from '../../../shared/interfaces/models';

@Injectable({
  providedIn: 'root'
})
export class ClassDiaryService {
  private apiUrl = `${environment.apiUrl}/class-diary`;

  constructor(private http: HttpClient) {}

  // 🔹 1. Buscar todos os resumos, podendo filtrar por turma, matéria, data
  getClassDiaries(filters: { refClass?: string; refSubject?: string; date?: string }): Observable<ClassDiary[]> {
    return this.http.get<ClassDiary[]>(this.apiUrl, { params: filters });
  }

  // 🔹 2. Buscar um resumo pelo ID
  getClassDiaryById(id: string): Observable<ClassDiary> {
    return this.http.get<ClassDiary>(`${this.apiUrl}/${id}`);
  }

  // 🔹 3. Criar um novo resumo
  createClassDiary(data: Omit<ClassDiary, 'id' | 'createdBy'>): Observable<ClassDiary> {
    return this.http.post<ClassDiary>(this.apiUrl, data);
  }

  // 🔹 4. Atualizar um resumo existente
  updateClassDiary(id: string, data: Partial<ClassDiary>): Observable<ClassDiary> {
    return this.http.put<ClassDiary>(`${this.apiUrl}/${id}`, data);
  }

  // 🔹 5. Excluir um resumo
  deleteClassDiary(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
