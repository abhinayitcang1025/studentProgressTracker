import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student';
import { StudentFormComponent } from '../student-form/student-form.component';
import { StudentDetailComponent } from '../student-detail/student-detail.component';

@Component({
  selector: 'students-list',
  standalone: true,
  imports: [CommonModule, StudentFormComponent, StudentDetailComponent],
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.css']
})
/**
 * StudentsListComponent
 *
 * Displays a sortable table of students and provides actions to view details,
 * add, edit and delete students. The component delegates data operations to
 * `StudentService` and uses `StudentFormComponent` and `StudentDetailComponent`
 * to perform edits and show details respectively.
 *
 * Public API:
 * - addStudent(): open the add form
 * - editStudent(student): open the edit form
 * - viewDetails(student): open the details pane
 */
export class StudentsListComponent {
  students: Student[] = [];
  sortedStudents: Student[] = [];
  sortColumn: keyof Student | null = null;
  sortDir: 'asc' | 'desc' = 'asc';

  selectedStudent?: Student;
  showForm = false;
  editing = false;
  showDetail = false;

  constructor(private studentService: StudentService) {
    this.loadStudents();
  }

  loadStudents() {
  /**
   * Load student list from the service and refresh the sorted view.
   */
    this.studentService.getStudents().subscribe((s) => {
      this.students = s || [];
      this.applySort();
    });
  }

  applySort() {
  /**
   * Apply the currently selected column and direction to the students list.
   */
    if (!this.sortColumn) {
      this.sortedStudents = [...this.students];
      return;
    }

    const col = this.sortColumn as keyof Student;
    const dir = this.sortDir === 'asc' ? 1 : -1;
    this.sortedStudents = [...this.students].sort((a, b) => {
      const va: any = a[col] ?? '';
      const vb: any = b[col] ?? '';
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
      return String(va).localeCompare(String(vb)) * dir;
    });
  }

  sortBy(column: keyof Student) {
  /**
   * Toggle sorting by a column. Repeated calls toggle asc/desc.
   * @param column The Student property to sort by
   */
    if (this.sortColumn === column) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDir = 'asc';
    }
    this.applySort();
  }

  addStudent() {
  /**
   * Open the form to add a new student.
   */
    this.selectedStudent = undefined;
    this.editing = false;
    this.showForm = true;
    this.showDetail = false;
  }

  editStudent(student: Student) {
  /**
   * Open the form to edit an existing student.
   * @param student Student to edit
   */
    this.selectedStudent = student;
    this.editing = true;
    this.showForm = true;
    this.showDetail = false;
  }

  viewDetails(student: Student) {
  /**
   * Show the details panel for the provided student.
   * @param student Student whose details should be displayed
   */
    this.selectedStudent = student;
    this.showDetail = true;
    this.showForm = false;
  }

  deleteStudent(id: number) {
  /**
   * Delete a student after user confirmation.
   * @param id Student id to delete
   */
    if (!confirm('Delete this student?')) return;
    this.studentService.deleteStudent(id).subscribe(() => this.loadStudents());
  }

  onFormSaved(student: Student) {
    // reload list and hide form
    this.showForm = false;
    this.loadStudents();
  }
}
