import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { GradeService } from './services/grade.service';
import { ClassService } from '../classes/services/class.service';
import { StudentService } from '../students/services/student.service';
import {
  Class,
  Subject,
  Student,
  Grades,
} from '../../shared/interfaces/models';
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
import { BimesterService } from '../../core/services/bimester.service';
import { SubjectsService } from '../../core/services/subjects.service';

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
    MatIconModule,
  ],
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.scss'],
})
export class GradesComponent implements OnInit {
  filterForm!: FormGroup;
  gradesForm!: FormGroup;
  classes: Class[] = [];
  subjects: Subject[] = [];
  students: Student[] = [];
  grades: Grades[] = [];
  bimesters: any[] = [];
  schoolYears: string[] = ['2025', '2024', '2023', '2022'];
  showTable = false;
  isLoading = false;
  displayedColumns: string[] = [
    'name',
    'p1',
    'p2',
    'average',
    'recovery',
    'actions',
  ];

  constructor(
    private fb: FormBuilder,
    private gradeService: GradeService,
    private classService: ClassService,
    private studentService: StudentService,
    private bimesterService: BimesterService,
    private subjectService: SubjectsService,
    private snackBar: MatSnackBar
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadClasses();
    this.loadSubjects();
    this.loadBimesters();
  }

  private initializeForms(): void {
    this.filterForm = this.fb.group({
      classId: ['', Validators.required],
      schoolYear: ['', [Validators.required]],
      subjectId: ['', Validators.required],
      bimester: ['', Validators.required],
    });

    this.gradesForm = this.fb.group({
      grades: this.fb.array([]),
    });
  }

  private loadBimesters(): void {
    this.bimesterService.getBimesters().subscribe((bimesters) => {
      this.bimesters = bimesters;
    });
  }

  get gradesArray(): FormArray {
    return this.gradesForm.get('grades') as FormArray;
  }

  private loadClasses(): void {
    this.classService
      .getClasses()
      .subscribe((classes) => (this.classes = classes));
  }

  private loadSubjects(): void {
   this.subjectService.getSubjects().subscribe((subject) => {
    this.subjects = subject
   })
  }

  onSearch(): void {
    if (this.filterForm.valid) {
      this.isLoading = true;
      const { classId, subjectId, bimester, schoolYear } =
        this.filterForm.value;

      this.studentService.getStudentsByClass(classId).subscribe((students) => {
        this.students = students;
        this.gradesArray.clear();

        this.students.forEach((student) => {
          console.log(student);
          this.gradesArray.push(this.createGradeForm(student.id));
        });

        this.gradeService
          .getGradesByFilters(classId, schoolYear, subjectId, bimester)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((grades) => {
            this.grades = grades;
            this.showTable = true;
          });
      });
    }
  }

  getStudentForm(index: number): FormGroup {
    return this.gradesArray.at(index) as FormGroup;
  }

  calculateAverage(p1: number, p2: number): number {
    return (p1 + p2) / 2;
  }

  saveGrade(student: Student, form: FormGroup): void {
    const p1 = form.get('p1')?.value;
    const p2 = form.get('p2')?.value;
    const average = this.calculateAverage(p1, p2);
    const { subjectId, bimester } = this.filterForm.value;

    const grade: Grades = {
      p1,
      p2,
      rec: form.get('rec')?.value || 0,
      average,
      refSubject: subjectId,
      refBimester: bimester,
      refStudent: student.id,
      schoolYear: student.schoolYear
    };

    this.gradeService.saveGrade(grade).subscribe(() => {
      this.snackBar.open('Nota salva com sucesso!', 'Fechar', {
        duration: 3000,
      });
    });
  }

  needsRecovery(average: number): boolean {
    return average < 7;
  }

  private createGradeForm(studentId: string): FormGroup {
    return this.fb.group({
      id: [studentId],
      p1: [null, [Validators.min(0), Validators.max(10)]],
      p2: [null, [Validators.min(0), Validators.max(10)]],
      rec: [null, [Validators.min(0), Validators.max(10)]],
    });
  }
}
