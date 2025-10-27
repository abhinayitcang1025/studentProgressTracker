import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student';

@Injectable({
  providedIn: 'root'
})
/**
 * Service for CRUD operations against the students endpoint.
 *
 * Responsibilities:
 * - Fetch the list of students
 * - Fetch a single student by id
 * - Create, update, and delete students
 *
 * Usage:
 * const students$ = studentService.getStudents();
 */
export class StudentService {
  private baseUrl = '/students';

  constructor(private http: HttpClient) {}

  // Get all students
  /**
   * Retrieve all students from the backend.
   * @returns Observable that emits an array of Student objects.
   */
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.baseUrl);
  }

  // Get a student by id
  /**
   * Retrieve a single student by id.
   * @param id Student identifier
   * @returns Observable that emits the Student
   */
  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/${id}`);
  }

  // Create a new student
  /**
   * Create a new student record.
   * @param student Student payload
   * @returns Observable that emits the created Student (including id)
   */
  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.baseUrl, student);
  }

  // Update an existing student
  /**
   * Update an existing student.
   * @param student Student payload with an existing id
   * @returns Observable that emits the updated Student
   */
  updateStudent(student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.baseUrl}/${student.id}`, student);
  }

  // Delete a student
  /**
   * Delete a student by id.
   * @param id Student identifier to delete
   * @returns Observable that completes when deletion finishes
   */
  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
