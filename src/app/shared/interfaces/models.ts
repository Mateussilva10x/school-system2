export interface Student {
  id: string;
  name: string;
  birthDate: Date;
  refClass: string;
  schoolYear: string;
}

export interface Class {
  id: string;
  name: string;
  totalStudents?: number;
  schoolYear: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface Teacher {
  id: string;
  name: string;
  birthDate: Date;
  refSubject: string;
}

export interface Grades {
  id?: string;
  p1: number;
  p2: number;
  rec: number;
  average: number;
  refSubject: string;
  refBimester: string;
  refStudent: string;
  schoolYear: string;
}

export interface Bimester {
  id: string;
  name: string;
  year: string;
}

export interface ClassDiary {
  id: string;
  date: Date;
  summary: string;
  refSubject: string;
  refClass: string;
  createdBy: string;
  schoolYear: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'TEACHER';
  token: string;
}
