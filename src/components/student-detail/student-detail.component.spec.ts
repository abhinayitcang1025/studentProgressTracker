import { TestBed } from '@angular/core/testing';
import { StudentDetailComponent } from './student-detail.component';
import { Student } from '../../models/student';

describe('StudentDetailComponent', () => {
  let fixture: any;
  let component: StudentDetailComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StudentDetailComponent] }).compileComponents();
    fixture = TestBed.createComponent(StudentDetailComponent);
    component = fixture.componentInstance;
  });

  it('should display computed grade matching computed logic', () => {
    const student: Student = { id: 1, name: 'Test', class: '10', section: 'A', math: 90, science: 95, english: 92, total: 277, grade: 'A+' };
    component.student = student;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Computed Grade');
    expect(component.computeGrade(student.total)).toBe('A+');
  });
});
