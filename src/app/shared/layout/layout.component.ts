import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth/auth.actions';
import { AuthService } from '../../core/services/auth.service';
import { isAdmin } from '../utils/auth-utils';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  menuItemsAdmin = [
    { path: '/home', icon: 'dashboard', label: 'Dashboard' },
    { path: '/students', icon: 'school', label: 'Alunos' },
    { path: '/teachers', icon: 'person', label: 'Professores' },
    { path: '/classes', icon: 'groups', label: 'Turmas' },
    { path: '/grades', icon: 'grade', label: 'Notas' },
    { path: '/class-diary', icon: 'book', label: 'Diário de Classe' },
    { path: '/users', icon: 'group', label: 'Usuários' }
  ];
  menuItemsTeacher = [
    { path: '/home', icon: 'dashboard', label: 'Dashboard' },
    { path: '/students', icon: 'school', label: 'Alunos' },
    { path: '/grades', icon: 'grade', label: 'Notas' },
    { path: '/class-diary', icon: 'book', label: 'Diário de Classe' },
  ];

  isAdminUser!: boolean

  constructor(private store: Store, private authService: AuthService) {}

  ngOnInit(): void {
    this.isAdminUser = isAdmin(this.authService);
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
