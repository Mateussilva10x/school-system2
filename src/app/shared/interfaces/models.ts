export interface Student {
  uniqueId: string;
  name: string;
  birthDate: Date;
  refClass: string;
  schoolYear: string;
}

export interface Class {
  uniqueId: string;
  name: string;
  totalStudents: number;
  schoolYear: string;
}

export interface Subject {
  uniqueId: string;
  name: string;
  year: string;
  refTeacher: string;
}

export interface Teacher {
  uniqueId: string;
  name: string;
  birthDate: Date;
  refSubject: string;
}

export interface Grades {
  uniqueId: string;
  p1: number;
  p2: number;
  rec: number;
  average: number;
  refSubject: string;
  refBimester: string;
  refStudent: string;
}

export interface Bimester {
  uniqueId: string;
  name: string;
  year: string;
}

export interface ClassDiary {
  uniqueId: string;
  date: Date;
  resume: string;
  refSubject: string;
  refClass: string;
}

export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'TEACHER';
  token: string;
}
