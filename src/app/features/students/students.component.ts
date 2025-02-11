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
import { Student } from '../../shared/interfaces/models';
import { StudentService } from './services/student.service';
import { StudentFormDialogComponent } from './components/student-form-dialog/student-form-dialog.component';

@Component({
  selector: 'app-students',
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
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'birthDate', 'class', 'actions'];
  students: Student[] = [];
  filteredStudents: Student[] = [];
  classes: string[] = ['Turma A', 'Turma B', 'Turma C']; // Mock data
  schoolYears: string[] = ['2024', '2023', '2022']; // Mock data

  filters = {
    name: '',
    class: '',
    schoolYear: ''
  };

  constructor(
    private dialog: MatDialog,
    private studentService: StudentService
  ) {}

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.studentService.getStudents().subscribe(students => {
      this.students = students;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredStudents = this.students.filter(student => {
      const nameMatch = student.name.toLowerCase().includes(this.filters.name.toLowerCase());
      const classMatch = !this.filters.class || student.refClass === this.filters.class;
      const yearMatch = !this.filters.schoolYear || student.schoolYear === this.filters.schoolYear;
      return nameMatch && classMatch && yearMatch;
    });
  }

  openStudentDialog(student?: Student) {
    const dialogRef = this.dialog.open(StudentFormDialogComponent, {
      width: '600px',
      data: student
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (student) {
          this.studentService.updateStudent(result).subscribe(() => this.loadStudents());
        } else {
          this.studentService.createStudent(result).subscribe(() => this.loadStudents());
        }
      }
    });
  }

  deleteStudent(id: string) {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
      this.studentService.deleteStudent(id).subscribe(() => this.loadStudents());
    }
  }

  generateReport(student: Student) {
    this.studentService.generateReport(student.uniqueId);
  }
}
