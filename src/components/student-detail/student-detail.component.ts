import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Student } from '../../models/student';

@Component({
  selector: 'student-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
/**
 * StudentDetailComponent
 *
 * Displays subject-wise marks and computed grade for a given student.
 * Input:
 * - `student` the Student object to inspect
 */
export class StudentDetailComponent {
  /** Student to show details for (optional). */
  @Input() student?: Student;

  /**
   * Compute a grade string from the provided total.
   * @param total Sum of subject marks
   * @returns Grade string (e.g. 'A+', 'A', 'B')
   */
  computeGrade(total: number) {
    const avg = total / 3;
    if (avg >= 90) return 'A+';
    if (avg >= 80) return 'A';
    if (avg >= 70) return 'B+';
    if (avg >= 60) return 'B';
    return 'C';
  }
}
