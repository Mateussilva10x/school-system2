import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Student, Class } from '../../../../shared/interfaces/models';
import { ClassService } from '../../../classes/services/class.service';

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
export class StudentFormDialogComponent implements OnInit {
  form: FormGroup;
  classes: Class[] = []; // Agora carrega do backend
  schoolYears: string[] = ['2025', '2024', '2023', '2022']; // Pode ser carregado da API no futuro

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StudentFormDialogComponent>,
    private classService: ClassService,
    @Inject(MAT_DIALOG_DATA) public data: Student | null
  ) {
    this.form = this.fb.group({
      name: [data?.name || '', Validators.required],
      birthDate: [data?.birthDate || '', Validators.required],
      refClass: [data?.refClass || '', Validators.required],
      schoolYear: [data?.schoolYear || '', Validators.required]
    });
  }

  ngOnInit() {
    // 🔹 Busca as turmas reais do backend
    this.classService.getClasses().subscribe(classes => {
      this.classes = classes;
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const student = {
        ...this.form.value,
        id: this.data?.id || crypto.randomUUID()
      };
      this.dialogRef.close(student);
    }
  }
}
