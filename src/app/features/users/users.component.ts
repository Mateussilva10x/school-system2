import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../shared/interfaces/models';
import { UserService } from './services/user.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { UserFormDialogComponent } from './components/user-form-dialog/user-form-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingService } from '../../core/services/loading.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatTableModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['email', 'role', 'createdAt', 'actions'];
  users: User[] = [];
  filteredUsers: User[] = [];
  roles = ['ADMIN', 'TEACHER'];

  filter = {
    role: '',
  };

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private loadingService: LoadingService,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loadingService.show();
    this.userService
      .getUsers()
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe((users) => {
        this.users = users;
        this.applyFilters();
      });
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(
      (user) => !this.filter.role || user.role === this.filter.role,
    );
  }

  openUserDialog(user?: User): void {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '500px',
      data: user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadUsers();
    });
  }

  deleteUser(id: string): void {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.loadUsers();
        this.snackBar.open('Usuário excluído com sucesso!', 'Fechar', {
          duration: 3000,
        });
      });
    }
  }
}
