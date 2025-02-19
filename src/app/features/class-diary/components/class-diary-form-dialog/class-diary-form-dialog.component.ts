import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Class, ClassDiary } from '../../../../shared/interfaces/models';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SubjectsService } from '../../../../core/services/subjects.service';
import { ClassService } from '../../../classes/services/class.service';

@Component({
  selector: 'app-class-diary-form-dialog',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule],
  templateUrl: './class-diary-form-dialog.component.html',
  styleUrl: './class-diary-form-dialog.component.scss'
})
export class ClassDiaryFormDialogComponent {
  form: FormGroup;
  schoolYears: string[] = ['2025', '2024', '2023', '2022'];
  classes: Class[] = [];
  subjects: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ClassDiaryFormDialogComponent>,
    private subjectsService: SubjectsService,
    private classService: ClassService,
    @Inject(MAT_DIALOG_DATA) public data: ClassDiary
  ) {
    this.form = this.fb.group({
      schoolYear: [data?.schoolYear || '', Validators.required],
      refClass: [data?.refClass || '', Validators.required],
      refSubject: [data?.refSubject || '', Validators.required],
      summary: [data?.summary || '', [Validators.required, Validators.minLength(10)]],
      date: [data?.date || new Date(), Validators.required]
    });
    this.loadClasses();
    this.loadSubjects();
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  private loadClasses(): void {
    this.classService
      .getClasses()
      .subscribe((classes) => (this.classes = classes));
  }

  private loadSubjects(): void {
   this.subjectsService.getSubjects().subscribe((subject) => {
    this.subjects = subject
   })
  }

  onCancel() {
    this.dialogRef.close();
  }
}
