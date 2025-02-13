import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GradeService } from './services/grade.service';
import { ClassService } from '../classes/services/class.service';
import { StudentService } from '../students/services/student.service';
import { Class, Subject, Student, Grades } from '../../shared/interfaces/models';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.scss']
})
export class GradesComponent implements OnInit {
  filterForm!: FormGroup;
  gradesForm!: FormGroup;
  classes: Class[] = [];
  schoolYears: string[] = ['2024', '2023', '2022'];
  subjects: Subject[] = [
    { uniqueId: '1', name: 'Português' },
    { uniqueId: '2', name: 'Matemática' },
    { uniqueId: '3', name: 'História' },
    { uniqueId: '4', name: 'Geografia' },
    { uniqueId: '5', name: 'Inglês' },
    { uniqueId: '6', name: 'Ciências' },
    { uniqueId: '7', name: 'Ed. Física' },
    { uniqueId: '8', name: 'Artes' },
    { uniqueId: '9', name: 'Filosofia' }
  ];
  students: Student[] = [];
  grades: Grades[] = [];
  bimesters = ['1º', '2º', '3º', '4º'];
  showTable = false;
  isLoading = false;
  displayedColumns: string[] = ['name', 'p1', 'p2', 'average', 'recovery', 'actions'];

  constructor(
    private fb: FormBuilder,
    private gradeService: GradeService,
    private classService: ClassService,
    private studentService: StudentService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initializeForms();
    this.loadInitialData();
  }

  private initializeForms(): void {

    this.filterForm = this.fb.group({
      classId: ['', Validators.required],
      schoolYear: ['', [Validators.required, Validators.min(2000), Validators.max(2100)]],
      subjectId: ['', Validators.required],
      bimester: ['', Validators.required]
    });

    this.gradesForm = this.fb.group({
      p1: [null, [Validators.min(0), Validators.max(10)]],
      p2: [null, [Validators.min(0), Validators.max(10)]],
      rec: [null, [Validators.min(0), Validators.max(10)]]
    });
  }

  private loadInitialData(): void {
    this.isLoading = true;
    this.classService.getClasses()
      .pipe(
        catchError(error => {
          this.showError('Erro ao carregar as turmas');
          return of([]);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(classes => this.classes = classes);
  }

  onSearch(): void {
    if (this.filterForm.valid) {
      this.isLoading = true;
      const { classId, subjectId, bimester, schoolYear } = this.filterForm.value;

      this.studentService.getStudentsByClass(classId)
        .pipe(
          catchError(error => {
            this.showError('Erro ao carregar os alunos');
            return of([]);
          })
        )
        .subscribe(students => {
          this.students = students;

          this.gradeService.getGradesByFilters(classId, schoolYear, subjectId, bimester)
            .pipe(
              catchError(error => {
                this.showError('Erro ao carregar as notas');
                return of([]);
              }),
              finalize(() => this.isLoading = false)
            )
            .subscribe(grades => {
              this.grades = grades;
              this.showTable = true;
            });
        });
    }
  }

  calculateAverage(p1: number, p2: number): number {
    return (p1 + p2) / 2;
  }

  needsRecovery(average: number): boolean {
    return average < 7;
  }

  saveGrade(student: Student, p1: number, p2: number, rec: number | null): void {
    if (p1 < 0 || p1 > 10 || p2 < 0 || p2 > 10 || (rec !== null && (rec < 0 || rec > 10))) {
      this.showError('As notas devem estar entre 0 e 10');
      return;
    }

    const average = this.calculateAverage(p1, p2);
    const { subjectId, bimester } = this.filterForm.value;

    const grade: Grades = {
      uniqueId: '', // Will be set by service
      p1,
      p2,
      rec: rec || 0,
      average,
      refSubject: subjectId,
      refBimester: bimester,
      refStudent: student.uniqueId
    };

    this.gradeService.saveGrade(grade)
      .pipe(
        catchError(error => {
          this.showError('Erro ao salvar a nota');
          return of(null);
        })
      )
      .subscribe(() => {
        this.showSuccess('Nota salva com sucesso');
      });
  }

  getStudentGrade(studentId: string, gradeType: 'p1' | 'p2' | 'rec' | 'average'): string {
    const grade = this.grades.find(g => g.refStudent === studentId)?.[gradeType];
    return grade?.toString() ?? '';
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
}
