import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Student, Class } from '../../shared/interfaces/models';
import { StudentService } from './services/student.service';
import { ClassService } from '../classes/services/class.service';
import { ReportService } from './services/report.service';
import { StudentFormDialogComponent } from './components/student-form-dialog/student-form-dialog.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { isAdmin } from '../../shared/utils/auth-utils';
import { AuthService } from '../../core/services/auth.service';

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
  displayedColumns: string[] = ['name', 'birthDate', 'class', 'schoolYear', 'actions'];
  students: Student[] = [];
  filteredStudents: Student[] = [];
  classes: Class[] = [];
  schoolYears: string[] = ['2024', '2023', '2022'];
  isAdminUser!:boolean

  filters = {
    name: '',
    class: '',
    schoolYear: ''
  };

  constructor(
    private dialog: MatDialog,
    private studentService: StudentService,
    private snackBar: MatSnackBar,
    private classService: ClassService,
    private reportService: ReportService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadStudents();
    this.classService.getClasses().subscribe(allClasses => {
      this.classes = allClasses;
    });
    this.isAdminUser = isAdmin(this.authService);
  }

  loadStudents() {
    this.studentService.getStudents().subscribe(students => {
      this.students = students;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredStudents = this.students.filter(student => {
      const nameMatch = !this.filters.name || student.name.toLowerCase().includes(this.filters.name.toLowerCase());
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
      this.studentService.deleteStudent(id).subscribe(() => {
        this.snackBar.open('Aluno excluído com sucesso!', 'Fechar', { duration: 3000 });
        this.loadStudents();
      });
    }
  }

  getStudentClass(id: string) {
    return this.classes.find(studentClass => studentClass.id === id)?.name;
  }

  generateReport(student: Student) {
    this.reportService.generateStudentReport(student.id);
  }
}
