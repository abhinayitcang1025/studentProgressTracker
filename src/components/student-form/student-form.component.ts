import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Student } from '../../models/student';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
/**
 * StudentFormComponent
 *
 * Standalone reactive form used to create or edit Student records.
 * Inputs:
 * - `student` (optional): when provided the form initializes for editing
 * Outputs:
 * - `saved` EventEmitter<Student> emitted after a successful create/update
 */
export class StudentFormComponent implements OnInit {
  /** Optional student to edit. If not provided the form will create a new student. */
  @Input() student?: Student;
  /** Emitted after the backend returns the saved Student object. */
  @Output() saved = new EventEmitter<Student>();

  /** Reactive form group for the student fields. */
  form!: FormGroup;

  constructor(private fb: FormBuilder, private studentService: StudentService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.student?.id ?? null],
      name: [this.student?.name ?? '', Validators.required],
      class: [this.student?.class ?? '', Validators.required],
      section: [this.student?.section ?? '', Validators.required],
      math: [this.student?.math ?? 0, [Validators.required, Validators.min(0), Validators.max(100)]],
      science: [this.student?.science ?? 0, [Validators.required, Validators.min(0), Validators.max(100)]],
      english: [this.student?.english ?? 0, [Validators.required, Validators.min(0), Validators.max(100)]],
      total: [{ value: this.student?.total ?? 0, disabled: true }],
      grade: [{ value: this.student?.grade ?? '', disabled: true }]
    });

    this.form.valueChanges.subscribe(() => this.updateComputedFields());
    this.updateComputedFields();
  }

  private updateComputedFields() {
  /**
   * Recalculate derived fields (total and grade) whenever marks change.
   */
    const math = Number(this.form.get('math')?.value) || 0;
    const science = Number(this.form.get('science')?.value) || 0;
    const english = Number(this.form.get('english')?.value) || 0;
    const total = math + science + english;
    const grade = this.computeGrade(total);
    this.form.get('total')?.setValue(total, { emitEvent: false });
    this.form.get('grade')?.setValue(grade, { emitEvent: false });
  }

  private computeGrade(total: number) {
  /**
   * Compute a grade string from the total marks.
   * @param total Sum of subject marks
   */
    const avg = total / 3;
    if (avg >= 90) return 'A+';
    if (avg >= 80) return 'A';
    if (avg >= 70) return 'B+';
    if (avg >= 60) return 'B';
    return 'C';
  }

  submit() {
  /**
   * Submit the form. If the form contains an id, the student is updated;
   * otherwise a new student is created. On success the `saved` event is emitted.
   */
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: Student = {
      id: this.form.get('id')?.value ?? 0,
      name: this.form.get('name')?.value,
      class: this.form.get('class')?.value,
      section: this.form.get('section')?.value,
      math: Number(this.form.get('math')?.value),
      science: Number(this.form.get('science')?.value),
      english: Number(this.form.get('english')?.value),
      total: Number(this.form.get('total')?.value),
      grade: this.form.get('grade')?.value
    };

    if (payload.id && payload.id > 0) {
      this.studentService.updateStudent(payload).subscribe((res) => this.saved.emit(res));
    } else {
      this.studentService.createStudent(payload).subscribe((res) => this.saved.emit(res));
    }
  }
}
