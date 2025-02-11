import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Student } from '../../../../shared/interfaces/models';

@Component({
  selector: 'app-student-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './student-form-dialog.component.html'
})
export class StudentFormDialogComponent {
  form: FormGroup;
  classes = ['Turma A', 'Turma B', 'Turma C']; // Mock data
  schoolYears = ['2024', '2023', '2022']; // Mock data

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StudentFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Student | null
  ) {
    this.form = this.fb.group({
      name: [data?.name || '', Validators.required],
      birthDate: [data?.birthDate || '', Validators.required],
      refClass: [data?.refClass || '', Validators.required],
      schoolYear: [data?.schoolYear || '', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const student = {
        ...this.form.value,
        uniqueId: this.data?.uniqueId || crypto.randomUUID()
      };
      this.dialogRef.close(student);
    }
  }
}
