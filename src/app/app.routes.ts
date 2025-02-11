import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { StudentsComponent } from './features/students/students.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: DashboardComponent },
      { path: 'students', component: StudentsComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
      // Outras rotas serão adicionadas aqui
    ]
  }
];
