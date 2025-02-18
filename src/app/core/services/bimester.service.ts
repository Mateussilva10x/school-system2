import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

interface Bimester {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class BimesterService {
  private apiUrl = `${environment.apiUrl}/bimesters`;

  constructor(private http: HttpClient) {}

  getBimesters(): Observable<Bimester[]> {
    return this.http.get<Bimester[]>(this.apiUrl);
  }
}
