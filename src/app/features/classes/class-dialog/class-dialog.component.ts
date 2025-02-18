import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ClassService } from '../services/class.service';
import { Class } from '../../../shared/interfaces/models';

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
    MatIconModule,
    MatToolbarModule
  ],
  templateUrl: './class-dialog.component.html',
  styleUrls: ['./class-dialog.component.scss']
})
export class ClassDialogComponent implements OnInit {
  form: FormGroup;
  schoolYears: string[] = ['2025', '2024', '2023', '2022'];

  constructor(
    private fb: FormBuilder,
    private classService: ClassService,
    public dialogRef: MatDialogRef<ClassDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Class | null
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

  ngOnInit() {
  }

  onSubmit() {
    if (this.form.valid) {
      const classData = this.form.value;

      if (this.data) {
        this.classService.updateClass(this.data.id, classData).subscribe(() => this.dialogRef.close(true));
      } else {
        this.classService.createClass(classData).subscribe(() => this.dialogRef.close(true));
      }
    }
  }

  // 🔹 Fecha o modal sem salvar
  onCancel() {
    this.dialogRef.close();
  }
}
