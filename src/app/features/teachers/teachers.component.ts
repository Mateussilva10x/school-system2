import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Teacher, Subject } from '../../shared/interfaces/models';
import { TeacherFormDialogComponent } from './components/teacher-form-dialog/teacher-form-dialog.component';
import { TeacherService } from './services/teacher.service';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule
  ],
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss']
})
export class TeachersComponent implements OnInit {
  displayedColumns: string[] = ['name', 'birthDate', 'subject', 'actions'];
  teachers: Teacher[] = [];
  filteredTeachers: Teacher[] = [];
  subjects: Subject[] = [];
  schoolYears: string[] = ['2025', '2024', '2023', '2022'];

  filters = {
    name: '',
    subject: '',
    schoolYear: ''
  };

  constructor(
    private dialog: MatDialog,
    private teacherService: TeacherService
  ) {}

  ngOnInit() {
    this.loadTeachers();
    this.loadSubjects();
  }

  loadTeachers() {
    this.teacherService.getTeachers().subscribe(teachers => {
      this.teachers = teachers;
      this.applyFilters();
    });
  }

  loadSubjects() {
    this.teacherService.getSubjects().subscribe(subjects => {
      this.subjects = subjects;
    });
  }

  applyFilters() {
    this.filteredTeachers = this.teachers.filter(teacher => {
      const nameMatch = teacher.name.toLowerCase().includes(this.filters.name.toLowerCase());
      const subjectMatch = !this.filters.subject || teacher.refSubject === this.filters.subject;
      // Since teachers don't have a direct schoolYear property, we'll need to handle this differently
      // For now, removing the year filter until we determine how to properly associate teachers with school years
      return nameMatch && subjectMatch;
    });
  }

  getSubjectName(refSubject: string): string {
    return this.subjects.find(s => s.id === refSubject)?.name || '';
  }

  openTeacherDialog(teacher?: Teacher) {
    const dialogRef = this.dialog.open(TeacherFormDialogComponent, {
      width: '600px',
      data: { teacher, subjects: this.subjects }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (teacher) {
          this.teacherService.updateTeacher(teacher.id, result) // 🔹 Agora passa o ID e os dados
            .subscribe(() => this.loadTeachers());
        } else {
          this.teacherService.createTeacher(result)
            .subscribe(() => this.loadTeachers());
        }
      }
    });

  }

  deleteTeacher(id: string) {
    if (confirm('Tem certeza que deseja excluir este professor?')) {
      this.teacherService.deleteTeacher(id).subscribe(() => this.loadTeachers());
    }
  }
}
