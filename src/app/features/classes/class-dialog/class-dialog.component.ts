import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Class } from '../../../shared/interfaces/models';
import { ClassService } from '../services/class.service';

@Component({
  selector: 'app-class-dialog',
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
    MatNativeDateModule,
    MatIconModule,
    MatToolbarModule,
  ],
  templateUrl: './class-dialog.component.html',
  styleUrls: ['./class-dialog.component.scss']
})
export class ClassDialogComponent {
  form: FormGroup;
  schoolYears: string[] = ['2024', '2023', '2022'];

  constructor(
    private fb: FormBuilder,
    private classService: ClassService,
    public dialogRef: MatDialogRef<ClassDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Class
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      schoolYear: ['', Validators.required]
    });

    if (data) {
      this.form.patchValue({
        name: data.name,
        schoolYear: data.schoolYear
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const classData = this.form.value;

      if (this.data) {
        this.classService.updateClass(this.data.uniqueId, classData)
          .subscribe(() => this.dialogRef.close(true));
      } else {
        this.classService.createClass(classData)
          .subscribe(() => this.dialogRef.close(true));
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
