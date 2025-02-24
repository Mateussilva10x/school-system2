import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { StudentsComponent } from './features/students/students.component';
import { TeachersComponent } from './features/teachers/teachers.component';
import { ClassesComponent } from './features/classes/classes.component';
import { GradesComponent } from './features/grades/grades.component';
import { ClassDiaryComponent } from './features/class-diary/class-diary.component';
import { authGuard } from './store/auth/auth.guard';
import { UsersComponent } from './features/users/users.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: DashboardComponent, canActivate: [authGuard] },
      { path: 'students', component: StudentsComponent, canActivate: [authGuard] },
      { path: 'teachers', component: TeachersComponent, canActivate: [authGuard] },
      { path: 'classes', component: ClassesComponent, canActivate: [authGuard] },
      { path: 'grades', component: GradesComponent, canActivate: [authGuard] },
      { path: 'class-diary', component: ClassDiaryComponent, canActivate: [authGuard] },
      { path: 'users', component: UsersComponent, canActivate: [authGuard] },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];
