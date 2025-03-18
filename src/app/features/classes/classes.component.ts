import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Class } from '../../shared/interfaces/models';
import { ClassDialogComponent } from './class-dialog/class-dialog.component';
import { ClassService } from './services/class.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from '../../core/services/loading.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss'],
})
export class ClassesComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'totalStudents',
    'schoolYear',
    'actions',
  ];
  classes: Class[] = [];
  filteredClasses: Class[] = [];
  schoolYears: string[] = ['2025', '2024', '2023', '2022'];
  filters = { schoolYear: '' };

  constructor(
    private dialog: MatDialog,
    private classService: ClassService,
    private loadingService: LoadingService,
  ) {}

  ngOnInit() {
    this.loadClasses();
  }

  loadClasses() {
    this.loadingService.show();
    this.classService
      .getClasses()
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe((classes) => {
        this.classes = classes;
        this.filteredClasses = classes;
      });
  }

  applyFilters() {
    this.filteredClasses = this.classes.filter(
      (classItem) =>
        !this.filters.schoolYear ||
        classItem.schoolYear === this.filters.schoolYear,
    );
  }

  openClassDialog(classItem?: Class) {
    const dialogRef = this.dialog.open(ClassDialogComponent, {
      width: '500px',
      data: classItem,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadClasses();
      }
    });
  }

  deleteClass(id: string) {
    if (confirm('Tem certeza que deseja excluir esta turma?')) {
      this.classService.deleteClass(id).subscribe(() => this.loadClasses());
    }
  }
}
