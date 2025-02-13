import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassDiaryFormDialogComponent } from './class-diary-form-dialog.component';

describe('ClassDiaryFormDialogComponent', () => {
  let component: ClassDiaryFormDialogComponent;
  let fixture: ComponentFixture<ClassDiaryFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassDiaryFormDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClassDiaryFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
