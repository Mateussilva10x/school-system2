import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentFormDialogComponent } from './student-form-dialog.component';

describe('StudentFormDialogComponent', () => {
  let component: StudentFormDialogComponent;
  let fixture: ComponentFixture<StudentFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentFormDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
