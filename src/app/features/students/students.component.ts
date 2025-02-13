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
import { MatSnackBar } from '@angular/material/snack-bar';
import { Student, Class, Subject } from '../../shared/interfaces/models';
import { StudentService } from './services/student.service';
import { StudentFormDialogComponent } from './components/student-form-dialog/student-form-dialog.component';
import { ClassService } from '../classes/services/class.service';
import { ReportService } from './services/report.service';

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
  classes: Class[] = []; // Mock data
  subjects: Subject[] = []; // Mock data
  schoolYears: string[] = ['2024', '2023', '2022']; // Mock data

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
    private reportService: ReportService
  ) {}

  ngOnInit() {
    this.loadStudents();
    this.classService.getClasses().subscribe(allClass => {
      this.classes = allClass
    })
  }

  loadStudents() {
    this.studentService.getStudents().subscribe(students => {
      this.students = students;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredStudents = this.students.filter(student => {
      const nameMatch = !this.filters.name ||
        student.name.toLowerCase().includes(this.filters.name.toLowerCase());
      const classMatch = !this.filters.class ||
        student.refClass === this.filters.class;
      const yearMatch = !this.filters.schoolYear ||
        student.schoolYear === this.filters.schoolYear;

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

  getStudentClass(id: string) {
    return this.classes.find(studentClass => studentClass.uniqueId === id)?.name
  }

  generateReport(student: Student) {
    this.reportService.generateMockReport();
    // Aqui você precisará obter a classe e as disciplinas do aluno
    // const studentClass = this.classes.find(c => c.uniqueId === student.refClass);

    // if (!studentClass) {
    //   this.snackBar.open('Erro ao gerar boletim: Turma não encontrada', 'Fechar', {
    //     duration: 3000
    //   });
    //   return;
    // }

    // this.studentService.generateStudentReport(student, studentClass, this.subjects)
    //   .subscribe({
    //     next: () => {
    //       this.snackBar.open('Boletim gerado com sucesso!', 'Fechar', {
    //         duration: 3000
    //       });
    //     },
    //     error: (error) => {
    //       console.error('Erro ao gerar boletim:', error);
    //       this.snackBar.open('Erro ao gerar boletim', 'Fechar', {
    //         duration: 3000
    //       });
    //     }
    //   });
  }
}
