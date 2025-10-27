import { TestBed } from '@angular/core/testing';
import { StudentFormComponent } from './student-form.component';
import { StudentService } from '../../services/student.service';
import { of } from 'rxjs';
import { Student } from '../../models/student';

describe('StudentFormComponent', () => {
  let fixture: any;
  let component: StudentFormComponent;
  let studentServiceSpy: jasmine.SpyObj<StudentService>;

  beforeEach(async () => {
    studentServiceSpy = jasmine.createSpyObj('StudentService', ['createStudent', 'updateStudent']);
    studentServiceSpy.createStudent.and.returnValue(of({ id: 101, name: 'New', class: '10', section: 'A', math: 10, science: 10, english: 10, total: 30, grade: 'C' } as Student));
    studentServiceSpy.updateStudent.and.returnValue(of({ id: 1, name: 'Updated', class: '10', section: 'A', math: 10, science: 10, english: 10, total: 30, grade: 'C' } as Student));

    await TestBed.configureTestingModule({ imports: [StudentFormComponent], providers: [{ provide: StudentService, useValue: studentServiceSpy }] }).compileComponents();

    fixture = TestBed.createComponent(StudentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compute total and grade when marks change', () => {
    component.form.get('math')!.setValue(95);
    component.form.get('science')!.setValue(96);
    component.form.get('english')!.setValue(94);
    fixture.detectChanges();
    expect(component.form.get('total')!.value).toBe(285);
    expect(component.form.get('grade')!.value).toBe('A+');
  });

  it('should call createStudent when submitting a new student', () => {
    component.form.get('id')!.setValue(null);
    component.form.get('name')!.setValue('New');
    component.form.get('class')!.setValue('10');
    component.form.get('section')!.setValue('A');
    component.form.get('math')!.setValue(10);
    component.form.get('science')!.setValue(10);
    component.form.get('english')!.setValue(10);
    component.submit();
    expect(studentServiceSpy.createStudent).toHaveBeenCalled();
  });

  it('should call updateStudent when submitting an existing student', () => {
    component.form.get('id')!.setValue(1);
    component.form.get('name')!.setValue('Updated');
    component.form.get('class')!.setValue('10');
    component.form.get('section')!.setValue('A');
    component.form.get('math')!.setValue(10);
    component.form.get('science')!.setValue(10);
    component.form.get('english')!.setValue(10);
    component.submit();
    expect(studentServiceSpy.updateStudent).toHaveBeenCalled();
  });
});
