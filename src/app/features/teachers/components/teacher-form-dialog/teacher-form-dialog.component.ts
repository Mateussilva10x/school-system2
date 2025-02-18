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
import { Teacher, Subject } from '../../../../shared/interfaces/models';

interface DialogData {
  teacher?: Teacher; // 🔹 Agora `teacher` é opcional
  subjects: Subject[];
}

@Component({
  selector: 'app-teacher-form-dialog',
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
  templateUrl: './teacher-form-dialog.component.html',
  styleUrls: ['./teacher-form-dialog.component.scss']
})
export class TeacherFormDialogComponent {
  form: FormGroup;
  isEditing: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TeacherFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.isEditing = !!data.teacher;
    this.form = this.fb.group({
      id: [data.teacher?.id || ''], // 🔹 ID é opcional na criação
      name: [data.teacher?.name || '', [Validators.required]],
      birthDate: [data.teacher?.birthDate ? new Date(data.teacher.birthDate) : '', [Validators.required]], // 🔹 Converte `birthDate` para `Date`
      refSubject: [data.teacher?.refSubject || '', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;
      formData.birthDate = formData.birthDate.toISOString().split('T')[0]; // 🔹 Converte `Date` para `string`
      this.dialogRef.close(formData);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
