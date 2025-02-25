import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [CommonModule,
      ReactiveFormsModule,
      MatDialogModule,
      MatButtonModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatDatepickerModule,
      TranslateModule,
      MatNativeDateModule],
  templateUrl: './user-form-dialog.component.html',
  styleUrl: './user-form-dialog.component.scss'
})
export class UserFormDialogComponent {
  form: FormGroup;
  roles = ['ADMIN', 'TEACHER'];
  isEditing: boolean;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<UserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditing = !!data;
    this.form = this.fb.group({
      email: [data?.email || '', [Validators.required, Validators.email]],
      password: ['', !this.isEditing ? Validators.required : []],
      role: [data?.role || 'TEACHER', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.isEditing) {
        this.userService.updateUser(this.data.id, this.form.value).subscribe(() => this.dialogRef.close(true));
      } else {
        this.userService.createUser(this.form.value).subscribe(() => this.dialogRef.close(true));
      }
    }
  }
}
