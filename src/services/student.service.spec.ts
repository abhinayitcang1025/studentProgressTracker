import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StudentService } from './student.service';
import { Student } from '../models/student';

describe('StudentService', () => {
  let service: StudentService;
  let httpMock: HttpTestingController;

  const mockStudents: Student[] = [
    { id: 1, name: 'A', class: '10', section: 'A', math: 80, science: 70, english: 75, total: 225, grade: 'A' },
    { id: 2, name: 'B', class: '9', section: 'B', math: 60, science: 65, english: 70, total: 195, grade: 'B' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [StudentService] });
    service = TestBed.inject(StudentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all students', () => {
    service.getStudents().subscribe((students) => {
      expect(students.length).toBe(2);
      expect(students).toEqual(mockStudents);
    });

    const req = httpMock.expectOne('/students');
    expect(req.request.method).toBe('GET');
    req.flush(mockStudents);
  });

  it('should fetch a student by id', () => {
    service.getStudent(1).subscribe((s) => expect(s).toEqual(mockStudents[0]));

    const req = httpMock.expectOne('/students/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockStudents[0]);
  });

  it('should create a student', () => {
    const newStudent: Student = { id: 3, name: 'C', class: '8', section: 'C', math: 50, science: 55, english: 60, total: 165, grade: 'C' };
    service.createStudent(newStudent).subscribe((res) => expect(res).toEqual(newStudent));

    const req = httpMock.expectOne('/students');
    expect(req.request.method).toBe('POST');
    req.flush(newStudent);
  });

  it('should update a student', () => {
    const updated: Student = { ...mockStudents[0], name: 'A-updated' };
    service.updateStudent(updated).subscribe((res) => expect(res).toEqual(updated));

    const req = httpMock.expectOne(`/students/${updated.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(updated);
  });

  it('should delete a student', () => {
    service.deleteStudent(1).subscribe((res) => expect(res).toBeUndefined());

    const req = httpMock.expectOne('/students/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
