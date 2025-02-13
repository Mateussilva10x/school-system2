import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { StudentsComponent } from './features/students/students.component';
import { TeachersComponent } from './features/teachers/teachers.component';
import { ClassesComponent } from './features/classes/classes.component';
import { GradesComponent } from './features/grades/grades.component';
import { ClassDiaryComponent } from './features/class-diary/class-diary.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: DashboardComponent },
      { path: 'students', component: StudentsComponent },
      { path: 'teachers', component: TeachersComponent },
      { path: 'classes', component: ClassesComponent },
      { path: 'grades', component: GradesComponent },
      { path: 'class-diary', component: ClassDiaryComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
      // Outras rotas serão adicionadas aqui
    ]
  }
];
