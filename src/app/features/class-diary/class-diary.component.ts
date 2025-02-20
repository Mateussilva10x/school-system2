import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ClassDiary, Class } from '../../shared/interfaces/models';
import { ClassService } from '../classes/services/class.service';
import { ClassDiaryService } from './services/class-diary.service';
import { SubjectsService } from '../../core/services/subjects.service';
import { ClassDiaryFormDialogComponent } from './components/class-diary-form-dialog/class-diary-form-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { Actions } from '@ngrx/effects';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import moment from "moment/moment";

@Component({
  selector: 'app-class-diary',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule, MatCardModule],
  templateUrl: './class-diary.component.html',
  styleUrl: './class-diary.component.scss'
})
export class ClassDiaryComponent implements OnInit {
  filterForm!: FormGroup;
  classDiaries: any[] = [];
  classes: Class[] = [];
  subjects: any[] = [];
  schoolYears: string[] = ['2025', '2024', '2023', '2022'];
  currentUserId!: string | null

  constructor(
    private fb: FormBuilder,
    private classDiaryService: ClassDiaryService,
    private classService: ClassService,
    private subjectService: SubjectsService,
    private dialog: MatDialog,
    private actions$: Actions,
    private authService: AuthService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUser()?.id || null;
    this.loadClasses();
    this.loadSubjects();
  }

  private initForm(): void {
    this.filterForm = this.fb.group({
      refClass: [''],
      refSubject: [''],
      startDate: [null],
      endDate: [null],
      schoolYear: ['']
    });
  }

  loadClassDiaries(): void {
    const filters = this.sanitizeForm(this.filterForm.value);
    this.classDiaryService.getClassDiaries(filters).subscribe(diaries => {
      this.mapDiaries(diaries)
    });
  }

  openDialog(diary?: ClassDiary): void {
    const dialogRef = this.dialog.open(ClassDiaryFormDialogComponent, {
      width: '600px',
      data: diary
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (diary) {
          this.classDiaryService.updateClassDiary(diary.id, result).subscribe(() => {
            this.loadClassDiaries();
          });
        } else {
          this.classDiaryService.createClassDiary(result).subscribe(() => {
            this.loadClassDiaries();
          });
        }
      }
    });
  }
  canEditOrDelete(diary: ClassDiary): boolean {
    return diary.userId === this.currentUserId;
  }

  deleteClassDiary(id: string): void {
    if (confirm('Tem certeza que deseja excluir este resumo?')) {
      this.classDiaryService.deleteClassDiary(id).subscribe(() => this.loadClassDiaries());
    }
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

  private mapDiaries(diaries: ClassDiary[]) {
    diaries.forEach(diary => {
      const className = this.classes.find(studentClass => studentClass.id === diary.refClass)
      const subjectName = this.subjects.find(subject => subject.id === diary.refSubject)
      this.classDiaries.push({
        ...diary,
        className: className?.name || '',
        subjectName: subjectName.name || '',
        createdByName: ''
      })
    })
  }

  private sanitizeForm(form: any) {
    for (let key in form) {
      if (form[key]) {
        if (key === 'startDate' || key === 'endDate') {
          form[key] = moment(form[key]).toISOString();
        } else {
          form[key] = form[key]?.trim();
        }
      } else {
        delete form[key];
       }
    }

    return form;
  }
}
